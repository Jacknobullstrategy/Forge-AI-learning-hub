import cron from 'node-cron';
import { query } from './db.js';

// Map of active cron jobs
const activeJobs = new Map();

// Sample data fetchers - replace with your actual data sources
const dataFetchers = {
  mckinsey: async () => {
    console.log('📊 Fetching McKinsey AI data...');
    // Replace with actual API call to your data source
    return {
      'enterprises_with_ai_strategy': 72,
      'ai_budget_growth': 32,
      'implementation_success_rate': 56,
    };
  },
  gartner: async () => {
    console.log('📊 Fetching Gartner data...');
    return {
      'avg_roi': 3.8,
      'time_to_value_months': 18,
      'adoption_rate': 65,
    };
  },
  forrester: async () => {
    console.log('📊 Fetching Forrester data...');
    return {
      'skills_gap_percentage': 65,
      'training_need_rate': 58,
      'talent_shortage': 67,
    };
  },
  internal: async () => {
    console.log('📊 Fetching internal enterprise data...');
    return {
      'company_ai_adoption': 45,
      'team_readiness': 6.2,
      'implementation_progress': 52,
    };
  },
};

// Initialize scheduler
export const initScheduler = async () => {
  console.log('🕐 Initializing scheduler...');

  try {
    // Get all active schedules from database
    const result = await query(
      "SELECT * FROM refresh_schedules WHERE status = 'active'"
    );

    for (const schedule of result.rows) {
      scheduleRefresh(schedule.data_source, schedule.schedule_cron);
    }

    console.log(`✅ Scheduler initialized with ${result.rows.length} tasks`);
  } catch (error) {
    console.error('Error initializing scheduler:', error);
  }
};

// Schedule a refresh task
export const scheduleRefresh = (dataSource, cronExpression) => {
  // Cancel existing job if it exists
  if (activeJobs.has(dataSource)) {
    activeJobs.get(dataSource).stop();
  }

  console.log(`📅 Scheduling ${dataSource} with cron: ${cronExpression}`);

  const job = cron.schedule(cronExpression, async () => {
    try {
      console.log(`🔄 Running refresh for ${dataSource}...`);

      // Fetch data from appropriate source
      const fetcher = dataFetchers[dataSource];
      if (!fetcher) {
        console.error(`No fetcher found for ${dataSource}`);
        return;
      }

      const data = await fetcher();

      // Store metrics
      for (const [metricName, metricValue] of Object.entries(data)) {
        await query(
          `INSERT INTO metrics (metric_name, metric_value, updated_by)
           VALUES ($1, $2, $3)
           ON CONFLICT (metric_name) DO UPDATE SET
           metric_value = $2, updated_at = CURRENT_TIMESTAMP, updated_by = $3`,
          [metricName, metricValue, dataSource]
        );

        // Log to history
        await query(
          'INSERT INTO metric_history (metric_name, metric_value, source) VALUES ($1, $2, $3)',
          [metricName, metricValue, dataSource]
        );
      }

      // Update schedule's last_run
      await query(
        `UPDATE refresh_schedules
         SET last_run = CURRENT_TIMESTAMP
         WHERE data_source = $1`,
        [dataSource]
      );

      console.log(`✅ Refresh completed for ${dataSource}`);
    } catch (error) {
      console.error(`Error during refresh for ${dataSource}:`, error);
    }
  });

  activeJobs.set(dataSource, job);
};

// Stop scheduler
export const stopScheduler = () => {
  console.log('⏹️ Stopping scheduler...');
  activeJobs.forEach((job) => job.stop());
  activeJobs.clear();
};

// Add a new data fetcher (for custom integrations)
export const addDataFetcher = (name, fetcher) => {
  dataFetchers[name] = fetcher;
  console.log(`✅ Added data fetcher: ${name}`);
};

export default { initScheduler, scheduleRefresh, stopScheduler, addDataFetcher };
