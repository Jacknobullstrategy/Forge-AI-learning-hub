import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { generateMockData } from './mockData';
import './SaaSDashboard.css';

export default function SaaSDashboard() {
  const [data, setData] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your SaaS metrics analyst. Ask me anything about revenue, churn, customers, or growth trends.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load mock data
    const mockData = generateMockData();
    setData(mockData);
  }, []);

  useEffect(() => {
    // Auto-scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          dashboardData: data
        })
      });

      const result = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', text: result.message }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I couldn\'t process that. Make sure the backend is running.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!data) return <div className="loading">Loading dashboard...</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="saas-dashboard">
      <header className="dashboard-header">
        <h1>SaaS Metrics Dashboard</h1>
        <p>Real-time business intelligence for {data.teamSize} people</p>
      </header>

      <div className="dashboard-container">
        {/* Left: Metrics and Charts */}
        <div className="main-content">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="kpi-label">MRR</div>
              <div className="kpi-value">${(data.kpis.mrr / 1000).toFixed(1)}K</div>
              <div className="kpi-change">+{data.kpis.growth}% YoY</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Customers</div>
              <div className="kpi-value">{data.kpis.customers}</div>
              <div className="kpi-change">Growing steadily</div>
            </div>
            <div className="kpi-card alert">
              <div className="kpi-label">Churn Rate</div>
              <div className="kpi-value">{data.kpis.churn}%</div>
              <div className="kpi-change">Watch this metric</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">LTV:CAC</div>
              <div className="kpi-value">{data.kpis.ltv_cac_ratio}x</div>
              <div className="kpi-change">Healthy unit economics</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">NRR</div>
              <div className="kpi-value">{data.kpis.nrr}%</div>
              <div className="kpi-change">Strong expansion</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">ARR</div>
              <div className="kpi-value">${(data.kpis.arr / 1000000).toFixed(1)}M</div>
              <div className="kpi-change">Annualized</div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            {/* Revenue Trend */}
            <div className="chart-container">
              <h3>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.charts.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Actual MRR" />
                  <Line type="monotone" dataKey="target" stroke="#10b981" name="Target" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Growth */}
            <div className="chart-container">
              <h3>Customer Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.customers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Total Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Churn Rate */}
            <div className="chart-container">
              <h3>Monthly Churn Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.charts.churn}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" name="Churn %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Segment */}
            <div className="chart-container">
              <h3>Revenue by Customer Segment</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.segments.bySize}
                    dataKey="mrr"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="health-section">
            <h3>Platform Health</h3>
            <div className="health-grid">
              <div className="health-item">
                <span className="health-label">NPS Score</span>
                <span className="health-value">{data.health.nps}</span>
              </div>
              <div className="health-item">
                <span className="health-label">Payment Success Rate</span>
                <span className="health-value">{data.health.paymentSuccess}%</span>
              </div>
              <div className="health-item">
                <span className="health-label">API Uptime</span>
                <span className="health-value">{data.health.apiUptime}%</span>
              </div>
              <div className="health-item">
                <span className="health-label">Avg Response Time</span>
                <span className="health-value">{data.health.avgResponseTime}ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chatbot */}
        <aside className="chatbot-sidebar">
          <div className="chatbot-header">
            <h3>AI Metrics Assistant</h3>
            <span className="badge">Powered by Claude</span>
          </div>

          <div className="chatbot-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            {chatLoading && (
              <div className="message assistant">
                <div className="message-content">Analyzing metrics...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="Ask about revenue, churn, customers..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()}>
              Send
            </button>
          </form>

          <div className="chatbot-tips">
            <p className="tips-title">Try asking:</p>
            <ul>
              <li>What's driving our revenue growth?</li>
              <li>Is our churn rate a concern?</li>
              <li>How is each segment performing?</li>
              <li>What's our LTV:CAC ratio tell us?</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
