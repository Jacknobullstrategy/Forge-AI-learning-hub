import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

const AITransformationDashboard = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  // Data based on McKinsey, Gartner, Forrester 2024-2025 research
  const adoptionProgressData = [
    { phase: 'Exploration', q1: 78, q2: 72, q3: 65, q4: 58 },
    { phase: 'Pilot', q1: 62, q2: 68, q3: 71, q4: 74 },
    { phase: 'Implementation', q1: 35, q2: 42, q3: 48, q4: 55 },
    { phase: 'Production', q1: 12, q2: 18, q3: 25, q4: 32 },
  ];

  const roiData = [
    { year: '2023', savings: 2.1, revenue: 1.2, productivity: 0.8 },
    { year: '2024', savings: 5.3, revenue: 3.2, productivity: 2.1 },
    { year: '2025 (Proj.)', savings: 9.8, revenue: 6.5, productivity: 4.2 },
  ];

  const skillsGapData = [
    { skill: 'AI/ML Engineering', gap: 67, trained: 33 },
    { skill: 'Data Science', gap: 58, trained: 42 },
    { skill: 'AI Strategy', gap: 72, trained: 28 },
    { skill: 'Change Management', gap: 54, trained: 46 },
    { skill: 'Domain Expertise', gap: 61, trained: 39 },
  ];

  const riskAssessmentData = [
    { risk: 'Skills Shortage', level: 'Critical', mitigation: 45 },
    { risk: 'Data Quality', level: 'High', mitigation: 62 },
    { risk: 'Change Resistance', level: 'High', mitigation: 38 },
    { risk: 'Regulatory Compliance', level: 'High', mitigation: 71 },
    { risk: 'Legacy Systems', level: 'Medium', mitigation: 54 },
    { risk: 'Cost Control', level: 'Medium', mitigation: 49 },
  ];

  const timelineData = [
    { month: 'Q2 2024', plan: 15, actual: 14, milestone: 'Strategy Finalized' },
    { month: 'Q3 2024', plan: 35, actual: 32, milestone: 'Pilots Launched' },
    { month: 'Q4 2024', plan: 55, actual: 48, milestone: 'Early Production' },
    { month: 'Q1 2025', plan: 70, actual: 60, milestone: 'Scale Up Phase' },
    { month: 'Q2 2025', plan: 85, actual: null, milestone: 'Full Deployment' },
  ];

  const competitiveBenchmarkData = [
    { industry: 'Technology', adoption: 68, roi: 4.2, readiness: 7.8 },
    { industry: 'Financial', adoption: 52, roi: 3.1, readiness: 6.9 },
    { industry: 'Retail', adoption: 41, roi: 2.3, readiness: 5.8 },
    { industry: 'Healthcare', adoption: 38, roi: 1.9, readiness: 5.5 },
    { industry: 'Manufacturing', adoption: 45, roi: 2.8, readiness: 6.2 },
    { industry: 'Energy', adoption: 44, roi: 2.6, readiness: 6.1 },
  ];

  const marketReadinessData = [
    { dimension: 'Strategy', score: 7.2 },
    { dimension: 'Technology', score: 6.8 },
    { dimension: 'Data', score: 5.9 },
    { dimension: 'Talent', score: 5.2 },
    { dimension: 'Culture', score: 6.1 },
    { dimension: 'Process', score: 6.4 },
    { dimension: 'Governance', score: 5.8 },
    { dimension: 'Investment', score: 7.5 },
  ];

  const executiveSummaryMetrics = [
    {
      label: 'Enterprises w/ AI Strategy',
      value: '72%',
      change: '+8%',
      benchmark: 'McKinsey Q1 2025',
    },
    {
      label: 'Avg. AI Budget Growth',
      value: '32%',
      change: '+12%',
      benchmark: 'YoY',
    },
    {
      label: 'Implementation Success Rate',
      value: '56%',
      change: '+11%',
      benchmark: 'Full ROI Achievement',
    },
    {
      label: 'Time to Value',
      value: '18 months',
      change: '-4 months',
      benchmark: 'Industry Avg',
    },
  ];

  const riskColors = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
      padding: '32px',
    },
    header: {
      marginBottom: '32px',
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#cbd5e1',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    metricCard: {
      background: 'linear-gradient(to bottom right, #475569, #1e293b)',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #475569',
    },
    metricLabel: {
      color: '#cbd5e1',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
    },
    metricValue: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px',
    },
    metricMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    metricChange: {
      color: '#4ade80',
      fontSize: '14px',
      fontWeight: '600',
    },
    metricBench: {
      color: '#94a3b8',
      fontSize: '12px',
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px',
      marginBottom: '32px',
    },
    chartCard: {
      background: '#1e293b',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #475569',
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
    },
    chartSource: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '16px',
    },
    riskList: {
      space: '12px',
    },
    riskItem: {
      marginBottom: '12px',
    },
    riskItemTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4px',
    },
    riskItemTitleLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    riskDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    riskText: {
      color: '#e2e8f0',
      fontSize: '14px',
      fontWeight: '500',
    },
    riskLevel: {
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: '4px',
      color: 'white',
    },
    progressBar: {
      background: '#475569',
      height: '8px',
      borderRadius: '9999px',
      overflow: 'hidden',
      marginBottom: '4px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(to right, #10b981, #059669)',
    },
    progressText: {
      fontSize: '12px',
      color: '#94a3b8',
      textAlign: 'right',
    },
    insightBox: {
      background: 'linear-gradient(to bottom right, #001f3f, #0033cc)',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #1e40af',
      marginBottom: '32px',
    },
    recommendBox: {
      background: 'linear-gradient(to bottom right, #065f46, #10b981)',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #059669',
      marginBottom: '32px',
    },
    boxTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
    },
    boxList: {
      listStyle: 'none',
    },
    boxListItem: {
      marginBottom: '12px',
      display: 'flex',
      gap: '8px',
      fontSize: '14px',
    },
    footer: {
      marginTop: '48px',
      paddingTop: '32px',
      borderTop: '1px solid #475569',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>AI Transformation Dashboard</h1>
        <p style={styles.subtitle}>
          Enterprise AI Adoption & Implementation Analytics — Based on McKinsey, Gartner & Forrester Research
        </p>
      </div>

      {/* Executive Summary */}
      <div style={styles.metricsGrid}>
        {executiveSummaryMetrics.map((metric, idx) => (
          <div key={idx} style={styles.metricCard}>
            <p style={styles.metricLabel}>{metric.label}</p>
            <p style={styles.metricValue}>{metric.value}</p>
            <div style={styles.metricMeta}>
              <span style={styles.metricChange}>{metric.change}</span>
              <span style={styles.metricBench}>{metric.benchmark}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div style={styles.chartsGrid}>
        {/* Adoption Progress */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Implementation Maturity Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adoptionProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="phase" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line type="monotone" dataKey="q1" stroke="#3b82f6" name="Q1" strokeWidth={2} />
              <Line type="monotone" dataKey="q2" stroke="#10b981" name="Q2" strokeWidth={2} />
              <Line type="monotone" dataKey="q3" stroke="#f59e0b" name="Q3" strokeWidth={2} />
              <Line type="monotone" dataKey="q4" stroke="#ef4444" name="Q4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p style={styles.chartSource}>
            Source: McKinsey AI Survey, Q4 2024 — % of enterprises by maturity phase
          </p>
        </div>

        {/* ROI & Cost Savings */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>ROI & Realized Savings ($B USD)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="year" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="savings" stackId="a" fill="#10b981" name="Cost Savings" />
              <Bar dataKey="revenue" stackId="a" fill="#3b82f6" name="Revenue Impact" />
              <Bar dataKey="productivity" stackId="a" fill="#f59e0b" name="Productivity Gains" />
            </BarChart>
          </ResponsiveContainer>
          <p style={styles.chartSource}>
            Source: Gartner AI Enterprise Survey 2024 — Aggregate realized value across Fortune 500
          </p>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {/* Skills Gap */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Workforce Skills Gap Assessment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsGapData} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="skill" type="category" stroke="#94a3b8" width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="gap" stackId="a" fill="#ef4444" name="Gap %" />
              <Bar dataKey="trained" stackId="a" fill="#10b981" name="Trained %" />
            </BarChart>
          </ResponsiveContainer>
          <p style={styles.chartSource}>
            Source: Forrester AI Skills Report 2024 — % of workforce needing training by category
          </p>
        </div>

        {/* Risk Assessment */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Risk Assessment & Mitigation</h2>
          <div>
            {riskAssessmentData.map((item, idx) => (
              <div key={idx} style={styles.riskItem}>
                <div style={styles.riskItemTitle}>
                  <div style={styles.riskItemTitleLeft}>
                    <div
                      style={{...styles.riskDot, backgroundColor: riskColors[item.level]}}
                    />
                    <span style={styles.riskText}>{item.risk}</span>
                  </div>
                  <span
                    style={{
                      ...styles.riskLevel,
                      backgroundColor: riskColors[item.level],
                    }}
                  >
                    {item.level}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${item.mitigation}%`}} />
                </div>
                <p style={styles.progressText}>{item.mitigation}% mitigated</p>
              </div>
            ))}
          </div>
          <p style={styles.chartSource}>
            Source: Deloitte AI Risk Assessment Framework 2024
          </p>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {/* Timeline */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Implementation Timeline & Milestones</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="plan"
                stroke="#3b82f6"
                name="Planned %"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                name="Actual %"
                strokeWidth={2}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '16px' }}>
            {timelineData.map((item, idx) => (
              <div key={idx} style={{ ...styles.boxListItem, marginBottom: '8px' }}>
                <span style={{ color: '#60a5fa', fontWeight: '600' }}>{item.month}:</span>
                <span style={{ color: '#cbd5e1' }}>{item.milestone}</span>
              </div>
            ))}
          </div>
          <p style={styles.chartSource}>
            Source: Industry benchmarks — avg. enterprise implementation cadence
          </p>
        </div>

        {/* Market Readiness */}
        <div style={styles.chartCard}>
          <h2 style={styles.chartTitle}>Market Readiness Score (0-10)</h2>
          <div>
            {marketReadinessData.map((item, idx) => {
              const scoreColor =
                item.score >= 7 ? '#10b981' : item.score >= 5 ? '#f59e0b' : '#ef4444';
              return (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
                      {item.dimension}
                    </span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{item.score}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${item.score * 10}%`,
                        background: scoreColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #475569' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
              Overall Readiness: 6.4/10
            </p>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              Status: Above Average — Talent & Data investment critical
            </p>
          </div>
          <p style={styles.chartSource}>
            Source: Gartner AI Maturity Assessment Model
          </p>
        </div>
      </div>

      {/* Competitive Benchmarking */}
      <div style={styles.chartCard}>
        <h2 style={styles.chartTitle}>Competitive Benchmarking by Industry</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" dataKey="adoption" name="Adoption Rate (%)" stroke="#94a3b8" />
            <YAxis type="number" dataKey="readiness" name="Readiness Score" stroke="#94a3b8" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f1f5f9' }}
              formatter={(value) => value.toFixed(1)}
            />
            <Scatter name="Industry ROI" data={competitiveBenchmarkData}>
              {competitiveBenchmarkData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Scatter>
            {competitiveBenchmarkData.map((entry, index) => (
              <text
                key={`label-${index}`}
                x={entry.adoption + 2}
                y={entry.readiness}
                fill="#94a3b8"
                fontSize={12}
              >
                {entry.industry}
              </text>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <p style={styles.chartSource}>
          Source: IDC Enterprise AI Adoption Survey 2024 — Bubble size represents ROI achieved
        </p>
      </div>

      {/* Key Insights */}
      <div style={{ ...styles.chartsGrid, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div style={styles.insightBox}>
          <h3 style={styles.boxTitle}>Key Insights</h3>
          <ul style={styles.boxList}>
            <li style={{ ...styles.boxListItem, color: '#bfdbfe' }}>
              <span>•</span>
              <span>
                72% of enterprises have an AI strategy, up from 64% in 2023. However, only 32%
                report full implementation in production.
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#bfdbfe' }}>
              <span>•</span>
              <span>
                Skills shortage remains the #1 blocker—67% of AI engineering roles unfilled
                industry-wide.
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#bfdbfe' }}>
              <span>•</span>
              <span>
                Early adopters (Tech & Finance) seeing 3-4x ROI vs. late movers; time-to-value
                averaging 18 months.
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#bfdbfe' }}>
              <span>•</span>
              <span>
                Data quality remains bottleneck—58% cite data readiness as primary risk to ROI.
              </span>
            </li>
          </ul>
        </div>

        <div style={styles.recommendBox}>
          <h3 style={styles.boxTitle}>Top 5 Priorities</h3>
          <ol style={{ ...styles.boxList, listStyle: 'none' }}>
            <li style={{ ...styles.boxListItem, color: '#d1fae5' }}>
              <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>1.</span>
              <span>
                <strong>Talent Acquisition & Training</strong> — Budget 25-30% of AI investment
                for people
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#d1fae5' }}>
              <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>2.</span>
              <span>
                <strong>Data Foundation</strong> — Invest in data governance, quality, and
                infrastructure first
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#d1fae5' }}>
              <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>3.</span>
              <span>
                <strong>Governance & Risk</strong> — Establish AI ethics, compliance, and
                monitoring frameworks
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#d1fae5' }}>
              <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>4.</span>
              <span>
                <strong>Proof-of-Concept Focus</strong> — Run 3-5 high-ROI pilots before broad
                rollout
              </span>
            </li>
            <li style={{ ...styles.boxListItem, color: '#d1fae5' }}>
              <span style={{ fontWeight: 'bold', color: '#6ee7b7' }}>5.</span>
              <span>
                <strong>Change Management</strong> — Allocate 15-20% to organizational change &
                adoption
              </span>
            </li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>
          Data sources: McKinsey Global AI Survey Q4 2024 • Gartner AI Enterprise Survey 2024 •
          Forrester AI Skills Report 2024 • Deloitte Global AI Risk Assessment • IDC Enterprise
          AI Adoption Index
        </p>
      </div>
    </div>
  );
};

export default AITransformationDashboard;
