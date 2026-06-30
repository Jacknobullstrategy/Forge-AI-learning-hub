import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [newMetric, setNewMetric] = useState({
    metricName: '',
    metricValue: '',
    metricUnit: '',
    description: '',
  });

  const [newSchedule, setNewSchedule] = useState({
    dataSource: '',
    scheduleCron: '',
  });

  const apiBase = (typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'http://localhost:5001' : '';

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken);
      setIsLoggedIn(true);
      setMessage('✅ Logged in successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMetrics(await res.json());
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
    setLoading(false);
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/schedules`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setSchedules(await res.json());
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
    setLoading(false);
  };

  // Fetch audit log
  const fetchAuditLog = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/audit-log?limit=50`, {
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setAuditLog(await res.json());
      }
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
    setLoading(false);
  };

  // Update metric
  const handleUpdateMetric = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ...newMetric, userId: 'admin' }),
      });
      if (res.ok) {
        setMessage('✅ Metric updated successfully');
        setNewMetric({ metricName: '', metricValue: '', metricUnit: '', description: '' });
        await fetchMetrics();
      } else {
        setMessage('❌ Failed to update metric');
      }
    } catch (error) {
      console.error('Error updating metric:', error);
      setMessage('❌ Error updating metric');
    }
    setLoading(false);
  };

  // Create schedule
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newSchedule),
      });
      if (res.ok) {
        setMessage('✅ Schedule created successfully');
        setNewSchedule({ dataSource: '', scheduleCron: '' });
        await fetchSchedules();
      } else {
        setMessage('❌ Failed to create schedule');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      setMessage('❌ Error creating schedule');
    }
    setLoading(false);
  };

  // Trigger manual refresh
  const handleManualRefresh = async (dataSource) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/refresh/${dataSource}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMessage(`✅ Refresh triggered for ${dataSource}`);
        await fetchSchedules();
      }
    } catch (error) {
      console.error('Error triggering refresh:', error);
      setMessage('❌ Error triggering refresh');
    }
    setLoading(false);
  };

  // Load data when tab changes
  useEffect(() => {
    if (!isLoggedIn) return;
    if (activeTab === 'metrics') fetchMetrics();
    else if (activeTab === 'schedules') fetchSchedules();
    else if (activeTab === 'audit') fetchAuditLog();
  }, [activeTab, isLoggedIn]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      padding: '32px',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    loginForm: {
      maxWidth: '400px',
      margin: '0 auto',
      background: '#1e293b',
      padding: '32px',
      borderRadius: '8px',
      border: '1px solid #475569',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      color: '#cbd5e1',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #475569',
      borderRadius: '4px',
      background: '#0f172a',
      color: 'white',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
    },
    tabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      borderBottom: '1px solid #475569',
      paddingBottom: '12px',
    },
    tab: {
      padding: '8px 16px',
      background: 'transparent',
      color: '#94a3b8',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      borderBottom: '2px solid transparent',
    },
    tabActive: {
      color: '#3b82f6',
      borderBottomColor: '#3b82f6',
    },
    card: {
      background: '#1e293b',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #475569',
      marginBottom: '24px',
    },
    section: {
      marginBottom: '32px',
    },
    message: {
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    messageSuccess: {
      background: '#064e3b',
      color: '#10b981',
      border: '1px solid #10b981',
    },
    messageError: {
      background: '#7f1d1d',
      color: '#ef4444',
      border: '1px solid #ef4444',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      color: 'white',
      fontSize: '12px',
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #475569',
      fontWeight: '600',
      color: '#cbd5e1',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #1e293b',
    },
    buttonSmall: {
      padding: '6px 12px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
    },
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 Admin Dashboard</h1>
          <p style={{ color: '#cbd5e1' }}>Enter your admin token to access</p>
        </div>
        <form style={styles.loginForm} onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Token</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your admin token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
            />
          </div>
          <button style={styles.button}>Login</button>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '16px', textAlign: 'center' }}>
            Set ADMIN_TOKEN in .env to enable admin access
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔧 Admin Dashboard</h1>
        <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>Manage metrics, schedules, and data</p>
        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.includes('✅') ? styles.messageSuccess : styles.messageError),
            }}
          >
            {message}
          </div>
        )}
      </div>

      <div style={styles.tabs}>
        {['metrics', 'schedules', 'audit'].map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div>
          <div style={styles.card}>
            <h2 style={{ ...styles.title, fontSize: '20px', marginBottom: '20px' }}>
              Update Metric
            </h2>
            <form onSubmit={handleUpdateMetric}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Metric Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., enterprises_with_ai_strategy"
                    value={newMetric.metricName}
                    onChange={(e) => setNewMetric({ ...newMetric, metricName: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Value</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="e.g., 72"
                    step="0.01"
                    value={newMetric.metricValue}
                    onChange={(e) => setNewMetric({ ...newMetric, metricValue: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Unit (optional)</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., %, $B, months"
                    value={newMetric.metricUnit}
                    onChange={(e) => setNewMetric({ ...newMetric, metricUnit: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description (optional)</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., McKinsey Q1 2025"
                    value={newMetric.description}
                    onChange={(e) =>
                      setNewMetric({ ...newMetric, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <button style={styles.button} disabled={loading}>
                {loading ? '⏳ Updating...' : '📊 Update Metric'}
              </button>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={{ ...styles.title, fontSize: '20px', marginBottom: '20px' }}>
              Current Metrics
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Metric Name</th>
                    <th style={styles.th}>Value</th>
                    <th style={styles.th}>Unit</th>
                    <th style={styles.th}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td style={styles.td}>{metric.metric_name}</td>
                      <td style={styles.td}>{metric.metric_value}</td>
                      <td style={styles.td}>{metric.metric_unit || '-'}</td>
                      <td style={styles.td}>
                        {new Date(metric.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div>
          <div style={styles.card}>
            <h2 style={{ ...styles.title, fontSize: '20px', marginBottom: '20px' }}>
              Create Schedule
            </h2>
            <form onSubmit={handleCreateSchedule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Data Source</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., mckinsey, gartner, internal"
                    value={newSchedule.dataSource}
                    onChange={(e) => setNewSchedule({ ...newSchedule, dataSource: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cron Expression</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="e.g., 0 0 * * 0 (weekly Sunday)"
                    value={newSchedule.scheduleCron}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, scheduleCron: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px' }}>
                Cron format: minute hour day month weekday (0=Sun, 1=Mon, etc.)
              </p>
              <button style={styles.button} disabled={loading}>
                {loading ? '⏳ Creating...' : '📅 Create Schedule'}
              </button>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={{ ...styles.title, fontSize: '20px', marginBottom: '20px' }}>
              Active Schedules
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Data Source</th>
                    <th style={styles.th}>Cron</th>
                    <th style={styles.th}>Last Run</th>
                    <th style={styles.th}>Next Run</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td style={styles.td}>{schedule.data_source}</td>
                      <td style={styles.td}>{schedule.schedule_cron}</td>
                      <td style={styles.td}>
                        {schedule.last_run
                          ? new Date(schedule.last_run).toLocaleString()
                          : 'Never'}
                      </td>
                      <td style={styles.td}>
                        {schedule.next_run
                          ? new Date(schedule.next_run).toLocaleString()
                          : '-'}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.buttonSmall}
                          onClick={() => handleManualRefresh(schedule.data_source)}
                          disabled={loading}
                        >
                          🔄 Refresh
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div style={styles.card}>
          <h2 style={{ ...styles.title, fontSize: '20px', marginBottom: '20px' }}>
            Audit Log
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Table</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log) => (
                  <tr key={log.id}>
                    <td style={styles.td}>{new Date(log.created_at).toLocaleString()}</td>
                    <td style={styles.td}>{log.action}</td>
                    <td style={styles.td}>{log.table_name || '-'}</td>
                    <td style={styles.td}>{log.user_id || '-'}</td>
                    <td style={styles.td}>
                      {log.new_value ? JSON.stringify(log.new_value).substring(0, 50) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
