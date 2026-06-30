import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SalesPipelineDashboard = () => {
  const [pipelineData, setPipelineData] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [repPerformance, setRepPerformance] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(((typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'http://localhost:5001' : '') + '/api/sales-pipeline');
      if (!response.ok) throw new Error('Failed to fetch pipeline data');

      const data = await response.json();
      setPipelineData(data.pipelineByStage);
      setConversionData(data.conversionRates);
      setRepPerformance(data.repPerformance);
      setForecastData(data.forecast);
    } catch (err) {
      setError(err.message);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockPipeline = [
      { stage: 'Prospect', value: 850000, count: 42 },
      { stage: 'Qualified', value: 625000, count: 25 },
      { stage: 'Proposal', value: 450000, count: 12 },
      { stage: 'Negotiation', value: 280000, count: 7 },
      { stage: 'Closed Won', value: 180000, count: 4 },
    ];

    const mockConversion = [
      { stage: 'Prospect → Qualified', rate: 59.5, count: 25 },
      { stage: 'Qualified → Proposal', rate: 48.0, count: 12 },
      { stage: 'Proposal → Negotiation', rate: 58.3, count: 7 },
      { stage: 'Negotiation → Closed', rate: 57.1, count: 4 },
    ];

    const mockReps = [
      { rep: 'Sarah Chen', deals: 8, value: 485000, winRate: 62 },
      { rep: 'Marcus Johnson', deals: 6, value: 320000, winRate: 58 },
      { rep: 'Priya Patel', deals: 7, value: 385000, winRate: 64 },
      { rep: 'James Wilson', deals: 5, value: 245000, winRate: 52 },
      { rep: 'Lisa Rodriguez', deals: 6, value: 290000, winRate: 59 },
    ];

    const mockForecast = [
      { month: 'Jan', forecast: 425000, actual: 380000 },
      { month: 'Feb', forecast: 520000, actual: 495000 },
      { month: 'Mar', forecast: 580000, actual: 612000 },
      { month: 'Apr', forecast: 650000, actual: 628000 },
      { month: 'May', forecast: 720000, actual: 685000 },
      { month: 'Jun', forecast: 800000, actual: null },
    ];

    setPipelineData(mockPipeline);
    setConversionData(mockConversion);
    setRepPerformance(mockReps);
    setForecastData(mockForecast);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const styles = {
    container: {
      background: '#0f172a',
      minHeight: '100vh',
      padding: '32px',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      color: '#94a3b8',
      fontSize: '14px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    card: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#f1f5f9',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#3b82f6',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    tableHeader: {
      background: '#0f172a',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #334155',
      fontWeight: '600',
      color: '#cbd5e1',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #334155',
    },
    tableRow: {
      background: '#1e293b',
    },
    tableRowAlt: {
      background: '#0f172a',
    },
    errorMessage: {
      background: '#7f1d1d',
      border: '1px solid #991b1b',
      borderRadius: '4px',
      padding: '12px',
      marginBottom: '16px',
      color: '#fecaca',
      fontSize: '14px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>📈 Sales Pipeline Dashboard</div>
          <div style={styles.subtitle}>Loading pipeline data...</div>
        </div>
      </div>
    );
  }

  const totalPipelineValue = pipelineData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const avgDealSize = totalPipelineValue / pipelineData?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>📈 Sales Pipeline Dashboard</div>
        <div style={styles.subtitle}>Real-time pipeline metrics and performance analytics</div>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          ⚠️ {error} - Showing demo data
        </div>
      )}

      {/* Key Metrics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${(totalPipelineValue / 1000000).toFixed(1)}M</div>
          <div style={styles.statLabel}>Total Pipeline</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${(avgDealSize / 1000).toFixed(0)}K</div>
          <div style={styles.statLabel}>Avg Deal Size</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{pipelineData?.reduce((sum, item) => sum + item.count, 0)}</div>
          <div style={styles.statLabel}>Total Opportunities</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>59%</div>
          <div style={styles.statLabel}>Avg Win Rate</div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Pipeline by Stage */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>💰 Pipeline by Stage</div>
          {pipelineData && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <div style={{ marginTop: '16px', fontSize: '12px' }}>
            <table style={styles.table}>
              <tbody>
                {pipelineData?.map((stage, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <td style={styles.tableCell}>{stage.stage}</td>
                    <td style={styles.tableCell} align="right">${(stage.value / 1000).toFixed(0)}K</td>
                    <td style={styles.tableCell} align="right">{stage.count} deals</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecast vs Actual */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>📊 Revenue Forecast vs Actual</div>
          {forecastData && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                  formatter={(value) => value ? `$${(value / 1000).toFixed(0)}K` : 'N/A'}
                />
                <Legend />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stage Conversion Rates */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>📈 Conversion Rates</div>
          {conversionData && (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="stage" type="category" stroke="#94a3b8" width={120} />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="rate" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '16px', fontSize: '12px' }}>
                <table style={styles.table}>
                  <tbody>
                    {conversionData?.map((item, idx) => (
                      <tr key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                        <td style={styles.tableCell}>{item.stage}</td>
                        <td style={styles.tableCell} align="right"><strong>{item.rate.toFixed(1)}%</strong></td>
                        <td style={styles.tableCell} align="right">{item.count} deals</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sales Rep Performance */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>🎯 Sales Rep Performance</div>
          {repPerformance && (
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={repPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="rep" angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '16px', fontSize: '12px' }}>
                <table style={styles.table}>
                  <tbody>
                    {repPerformance?.map((rep, idx) => (
                      <tr key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                        <td style={styles.tableCell}>{rep.rep}</td>
                        <td style={styles.tableCell} align="right">{rep.deals} deals</td>
                        <td style={styles.tableCell} align="right">${(rep.value / 1000).toFixed(0)}K</td>
                        <td style={styles.tableCell} align="right"><strong>{rep.winRate}%</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Deal Distribution by Win Rate */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>🏆 Deal Distribution</div>
          {repPerformance && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={repPerformance}
                  dataKey="value"
                  nameKey="rep"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ rep, value }) => `${rep}: $${(value / 1000).toFixed(0)}K`}
                >
                  {repPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* HubSpot Integration Notice */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '24px',
      }}>
        <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
          <strong>💡 HubSpot Integration:</strong> This dashboard is configured to sync with HubSpot CRM.
          To connect your HubSpot account:
          <ol style={{ marginTop: '12px', marginLeft: '20px', color: '#94a3b8' }}>
            <li>Add your HubSpot API key to the <code style={{background: '#0f172a', padding: '2px 6px', borderRadius: '3px'}}>HUBSPOT_API_KEY</code> environment variable</li>
            <li>The dashboard will automatically pull real deal data from your HubSpot pipeline</li>
            <li>Data syncs every 30 minutes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelineDashboard;
