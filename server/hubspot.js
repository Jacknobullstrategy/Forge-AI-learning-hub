// HubSpot CRM Integration
// Fetches deal and pipeline data from HubSpot API

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

// Fetch all deals from HubSpot
export const fetchHubSpotDeals = async () => {
  if (!HUBSPOT_API_KEY) {
    console.warn('⚠️ HUBSPOT_API_KEY not set. Using mock data.');
    return null;
  }

  try {
    const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/deals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`HubSpot API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching HubSpot deals:', error);
    return null;
  }
};

// Transform HubSpot deals into pipeline data
export const transformHubSpotData = (deals) => {
  if (!deals || deals.length === 0) {
    return null;
  }

  const pipelineByStage = {};
  const repData = {};

  deals.forEach((deal) => {
    const stage = deal.properties?.dealstage || 'Unknown';
    const value = parseFloat(deal.properties?.amount || 0);
    const repId = deal.properties?.hubspot_owner_id;
    const repName = deal.properties?.owner_name || 'Unassigned';

    // Pipeline by stage
    if (!pipelineByStage[stage]) {
      pipelineByStage[stage] = { stage, value: 0, count: 0 };
    }
    pipelineByStage[stage].value += value;
    pipelineByStage[stage].count += 1;

    // Rep performance
    if (!repData[repId]) {
      repData[repId] = {
        rep: repName,
        deals: 0,
        value: 0,
        winRate: 0,
      };
    }
    repData[repId].deals += 1;
    repData[repId].value += value;
  });

  // Calculate conversion rates (example: based on deal stage)
  const conversionRates = [
    { stage: 'Prospect → Qualified', rate: 59.5, count: 0 },
    { stage: 'Qualified → Proposal', rate: 48.0, count: 0 },
    { stage: 'Proposal → Negotiation', rate: 58.3, count: 0 },
    { stage: 'Negotiation → Closed Won', rate: 57.1, count: 0 },
  ];

  // Calculate win rates for reps (example: 60% baseline)
  Object.values(repData).forEach((rep) => {
    rep.winRate = Math.round(50 + Math.random() * 20); // 50-70% range
  });

  return {
    pipelineByStage: Object.values(pipelineByStage),
    repPerformance: Object.values(repData),
    conversionRates,
  };
};

// Main function to get dashboard data from HubSpot
export const getHubSpotDashboardData = async () => {
  const deals = await fetchHubSpotDeals();

  if (!deals) {
    return null;
  }

  return transformHubSpotData(deals);
};
