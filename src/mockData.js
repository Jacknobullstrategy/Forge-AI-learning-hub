// Generate realistic SaaS metrics for a 200-300 person company
export const generateMockData = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Generate historical data (12 months)
  const revenueData = [];
  const churnData = [];
  const customerData = [];
  const usageData = [];

  let baseRevenue = 150000;
  let baseCustomers = 180;
  let baseChurn = 5.2;

  for (let i = 0; i < 12; i++) {
    const growth = 1 + (Math.random() * 0.08 - 0.02); // 2-8% monthly growth
    baseRevenue = baseRevenue * growth;
    baseCustomers = Math.floor(baseCustomers * (1 + (Math.random() * 0.1 - 0.02)));
    baseChurn = Math.max(2, Math.min(8, baseChurn + (Math.random() * 1 - 0.5)));

    revenueData.push({
      month: months[i],
      value: Math.round(baseRevenue),
      target: Math.round(baseRevenue * 1.15)
    });

    churnData.push({
      month: months[i],
      value: parseFloat(baseChurn.toFixed(1))
    });

    customerData.push({
      month: months[i],
      value: baseCustomers,
      mrr: Math.round(baseRevenue)
    });

    usageData.push({
      month: months[i],
      activeUsers: Math.floor(baseCustomers * (8 + Math.random() * 3)),
      features: Math.floor(baseCustomers * (4 + Math.random() * 2))
    });
  }

  // Current KPIs (from last month)
  const currentMRR = revenueData[11].value;
  const currentARR = currentMRR * 12;
  const currentCustomers = customerData[11].value;
  const currentChurn = churnData[11].value;

  const cac = 2500; // Customer acquisition cost
  const ltv = (currentMRR * 100) / currentChurn; // Simplified LTV calculation
  const ltv_cac_ratio = ltv / cac;

  return {
    kpis: {
      mrr: currentMRR,
      arr: currentARR,
      customers: currentCustomers,
      churn: currentChurn,
      cac,
      ltv: Math.round(ltv),
      ltv_cac_ratio: parseFloat(ltv_cac_ratio.toFixed(2)),
      growth: 6.2, // YoY growth %
      nrr: 118 // Net revenue retention
    },
    charts: {
      revenue: revenueData,
      churn: churnData,
      customers: customerData,
      usage: usageData
    },
    segments: {
      bySize: [
        { name: 'Enterprise', count: 12, mrr: Math.round(currentMRR * 0.45) },
        { name: 'Mid-Market', count: 45, mrr: Math.round(currentMRR * 0.35) },
        { name: 'SMB', count: Math.floor(currentCustomers - 57), mrr: Math.round(currentMRR * 0.20) }
      ],
      byProduct: [
        { name: 'Core Platform', usage: 98, revenue: '45%' },
        { name: 'Analytics', usage: 72, revenue: '28%' },
        { name: 'Integrations', usage: 45, revenue: '17%' },
        { name: 'Premium Support', usage: 22, revenue: '10%' }
      ]
    },
    teamSize: 278,
    health: {
      nps: 42,
      paymentSuccess: 99.2,
      apiUptime: 99.98,
      avgResponseTime: 245 // ms
    }
  };
};

// Sample questions the chatbot can answer
export const chatbotContext = (data) => `
You are a SaaS metrics expert helping the C-suite and ops team understand business performance.
Here is the current dashboard data:

**Key Metrics:**
- Monthly Recurring Revenue (MRR): $${data.kpis.mrr.toLocaleString()}
- Annual Recurring Revenue (ARR): $${data.kpis.arr.toLocaleString()}
- Total Customers: ${data.kpis.customers}
- Monthly Churn Rate: ${data.kpis.churn}%
- Customer Acquisition Cost (CAC): $${data.kpis.cac}
- Customer Lifetime Value (LTV): $${data.kpis.ltv.toLocaleString()}
- LTV:CAC Ratio: ${data.kpis.ltv_cac_ratio}x
- YoY Growth: ${data.kpis.growth}%
- Net Revenue Retention: ${data.kpis.nrr}%

**Company:**
- Team Size: ${data.teamSize} people
- Health Score: NPS ${data.health.nps}, Payment Success ${data.health.paymentSuccess}%, API Uptime ${data.health.apiUptime}%

**Revenue by Segment:**
${data.segments.bySize.map(s => `- ${s.name}: ${s.count} customers, $${s.mrr.toLocaleString()} MRR`).join('\n')}

**Product Usage:**
${data.segments.byProduct.map(p => `- ${p.name}: ${p.usage}% usage, ${p.revenue} of revenue`).join('\n')}

Answer questions about metrics, trends, and business health in a concise way. Provide context and recommendations where relevant.
`;
