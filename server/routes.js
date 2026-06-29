import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { query } from './db.js';
import { getHubSpotDashboardData } from './hubspot.js';

const router = express.Router();

// Middleware to validate admin token
const validateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ==================== PUBLIC ENDPOINTS ====================

// Get current metrics for dashboard
router.get('/api/metrics', async (req, res) => {
  try {
    const result = await query('SELECT * FROM metrics ORDER BY updated_at DESC');
    const metrics = {};
    result.rows.forEach(row => {
      metrics[row.metric_name] = {
        value: parseFloat(row.metric_value),
        unit: row.metric_unit,
        description: row.description,
        updatedAt: row.updated_at,
      };
    });
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get dashboard data (aggregated metrics for charts)
router.get('/api/dashboard-data', async (req, res) => {
  try {
    const result = await query('SELECT data_key, data_value FROM dashboard_data');
    const data = {};
    result.rows.forEach(row => {
      data[row.data_key] = row.data_value;
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get historical data for a metric
router.get('/api/history/:metricName', async (req, res) => {
  try {
    const { metricName } = req.params;
    const { days = 30 } = req.query;
    const result = await query(
      `SELECT metric_value, recorded_at FROM metric_history
       WHERE metric_name = $1 AND recorded_at > NOW() - INTERVAL '${days} days'
       ORDER BY recorded_at ASC`,
      [metricName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Update a metric (requires admin token)
router.post('/api/admin/metrics', validateAdmin, async (req, res) => {
  try {
    const { metricName, metricValue, metricUnit, description, userId } = req.body;

    if (!metricName || metricValue === undefined) {
      return res.status(400).json({ error: 'metricName and metricValue required' });
    }

    // Update or insert metric
    await query(
      `INSERT INTO metrics (metric_name, metric_value, metric_unit, description, updated_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (metric_name) DO UPDATE SET
       metric_value = $2, metric_unit = $3, description = $4, updated_by = $5, updated_at = CURRENT_TIMESTAMP`,
      [metricName, metricValue, metricUnit, description, userId]
    );

    // Log to history
    await query(
      'INSERT INTO metric_history (metric_name, metric_value, metric_unit, source) VALUES ($1, $2, $3, $4)',
      [metricName, metricValue, metricUnit, 'manual']
    );

    // Audit log
    await query(
      'INSERT INTO audit_log (action, table_name, record_id, new_value, user_id) VALUES ($1, $2, $3, $4, $5)',
      ['UPDATE', 'metrics', null, JSON.stringify({ metricName, metricValue }), userId]
    );

    res.json({ success: true, message: 'Metric updated' });
  } catch (error) {
    console.error('Error updating metric:', error);
    res.status(500).json({ error: 'Failed to update metric' });
  }
});

// Bulk update dashboard data
router.post('/api/admin/dashboard-data', validateAdmin, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'data object required' });
    }

    for (const [key, value] of Object.entries(data)) {
      await query(
        `INSERT INTO dashboard_data (data_key, data_value)
         VALUES ($1, $2)
         ON CONFLICT (data_key) DO UPDATE SET data_value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value)]
      );
    }

    res.json({ success: true, message: 'Dashboard data updated' });
  } catch (error) {
    console.error('Error updating dashboard data:', error);
    res.status(500).json({ error: 'Failed to update dashboard data' });
  }
});

// Get all metrics for admin panel
router.get('/api/admin/metrics', validateAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM metrics ORDER BY metric_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get audit log
router.get('/api/admin/audit-log', validateAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const result = await query(
      'SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// Get refresh schedules
router.get('/api/admin/schedules', validateAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM refresh_schedules ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create/update refresh schedule
router.post('/api/admin/schedules', validateAdmin, async (req, res) => {
  try {
    const { dataSource, scheduleCron } = req.body;

    if (!dataSource || !scheduleCron) {
      return res.status(400).json({ error: 'dataSource and scheduleCron required' });
    }

    const result = await query(
      `INSERT INTO refresh_schedules (data_source, schedule_cron, status)
       VALUES ($1, $2, 'active')
       ON CONFLICT (data_source) DO UPDATE SET schedule_cron = $2, status = 'active'
       RETURNING *`,
      [dataSource, scheduleCron]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Trigger manual refresh
router.post('/api/admin/refresh/:dataSource', validateAdmin, async (req, res) => {
  try {
    const { dataSource } = req.params;

    // Update last_run and next_run
    await query(
      `UPDATE refresh_schedules
       SET last_run = CURRENT_TIMESTAMP
       WHERE data_source = $1`,
      [dataSource]
    );

    // TODO: Trigger actual data fetch based on dataSource
    // This would call your data integration logic

    res.json({ success: true, message: `Triggered refresh for ${dataSource}` });
  } catch (error) {
    console.error('Error triggering refresh:', error);
    res.status(500).json({ error: 'Failed to trigger refresh' });
  }
});

// Delete a metric
router.delete('/api/admin/metrics/:metricName', validateAdmin, async (req, res) => {
  try {
    const { metricName } = req.params;
    await query('DELETE FROM metrics WHERE metric_name = $1', [metricName]);
    res.json({ success: true, message: 'Metric deleted' });
  } catch (error) {
    console.error('Error deleting metric:', error);
    res.status(500).json({ error: 'Failed to delete metric' });
  }
});

// ==================== SALES PIPELINE ENDPOINTS ====================

// Get sales pipeline data (public endpoint)
router.get('/api/sales-pipeline', async (req, res) => {
  try {
    let pipelineData = null;
    let source = 'mock';

    // Try to fetch from HubSpot first
    if (process.env.HUBSPOT_API_KEY) {
      pipelineData = await getHubSpotDashboardData();
      if (pipelineData) {
        source = 'hubspot';
      }
    }

    // Fall back to mock data if HubSpot is unavailable
    if (!pipelineData) {
      const pipelineByStage = [
        { stage: 'Prospect', value: 850000, count: 42 },
        { stage: 'Qualified', value: 625000, count: 25 },
        { stage: 'Proposal', value: 450000, count: 12 },
        { stage: 'Negotiation', value: 280000, count: 7 },
        { stage: 'Closed Won', value: 180000, count: 4 },
      ];

      const conversionRates = [
        { stage: 'Prospect → Qualified', rate: 59.5, count: 25 },
        { stage: 'Qualified → Proposal', rate: 48.0, count: 12 },
        { stage: 'Proposal → Negotiation', rate: 58.3, count: 7 },
        { stage: 'Negotiation → Closed', rate: 57.1, count: 4 },
      ];

      const repPerformance = [
        { rep: 'Sarah Chen', deals: 8, value: 485000, winRate: 62 },
        { rep: 'Marcus Johnson', deals: 6, value: 320000, winRate: 58 },
        { rep: 'Priya Patel', deals: 7, value: 385000, winRate: 64 },
        { rep: 'James Wilson', deals: 5, value: 245000, winRate: 52 },
        { rep: 'Lisa Rodriguez', deals: 6, value: 290000, winRate: 59 },
      ];

      const forecast = [
        { month: 'Jan', forecast: 425000, actual: 380000 },
        { month: 'Feb', forecast: 520000, actual: 495000 },
        { month: 'Mar', forecast: 580000, actual: 612000 },
        { month: 'Apr', forecast: 650000, actual: 628000 },
        { month: 'May', forecast: 720000, actual: 685000 },
        { month: 'Jun', forecast: 800000, actual: null },
      ];

      pipelineData = {
        pipelineByStage,
        conversionRates,
        repPerformance,
        forecast,
      };
    }

    res.json({
      ...pipelineData,
      source,
    });
  } catch (error) {
    console.error('Error fetching sales pipeline:', error);
    res.status(500).json({ error: 'Failed to fetch sales pipeline data' });
  }
});

// ==================== CHATBOT ENDPOINTS ====================

// Chat with AI metrics assistant (Claude)
router.post('/api/chat', async (req, res) => {
  try {
    const { message, dashboardData } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Anthropic API key not configured. Set ANTHROPIC_API_KEY env var.'
      });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const client = new Anthropic({ apiKey });

    // Build context from dashboard data
    const context = `You are a SaaS metrics expert helping the C-suite and ops team understand business performance.
Here is the current dashboard data:

**Key Metrics:**
- Monthly Recurring Revenue (MRR): $${dashboardData.kpis.mrr.toLocaleString()}
- Annual Recurring Revenue (ARR): $${dashboardData.kpis.arr.toLocaleString()}
- Total Customers: ${dashboardData.kpis.customers}
- Monthly Churn Rate: ${dashboardData.kpis.churn}%
- Customer Acquisition Cost (CAC): $${dashboardData.kpis.cac}
- Customer Lifetime Value (LTV): $${dashboardData.kpis.ltv.toLocaleString()}
- LTV:CAC Ratio: ${dashboardData.kpis.ltv_cac_ratio}x
- YoY Growth: ${dashboardData.kpis.growth}%
- Net Revenue Retention: ${dashboardData.kpis.nrr}%

**Company:**
- Team Size: ${dashboardData.teamSize} people
- NPS: ${dashboardData.health.nps}
- Payment Success Rate: ${dashboardData.health.paymentSuccess}%
- API Uptime: ${dashboardData.health.apiUptime}%

**Revenue by Segment:**
${dashboardData.segments.bySize.map(s => `- ${s.name}: ${s.count} customers, $${s.mrr.toLocaleString()} MRR`).join('\n')}

**Product Usage:**
${dashboardData.segments.byProduct.map(p => `- ${p.name}: ${p.usage}% usage, ${p.revenue} of revenue`).join('\n')}

Answer questions about metrics, trends, and business health in a concise way (2-3 sentences). Provide actionable insights when relevant.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 256,
      system: context,
      messages: [
        { role: 'user', content: message }
      ]
    });

    const assistantMessage = response.content[0].text;

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in chatbot:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;
