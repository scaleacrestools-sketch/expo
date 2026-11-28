/**
 * ALL VALUES IN THIS FILE ARE ILLUSTRATIVE DEMONSTRATION DATA.
 * They are not product results, customer data or benchmarks.
 */
export const heroMetrics = [
  { label: 'Total Calls', value: 2480, suffix: '' },
  { label: 'Connect Rate', value: 68, suffix: '%' },
  { label: 'Qualified Leads', value: 846, suffix: '' },
  { label: 'Site Visits', value: 124, suffix: '' },
];

export const heroLeads = [
  { name: 'Rohan M.', source: 'Meta Ads', need: '3 BHK · ₹2 Cr', status: 'New', tone: 'cold' },
  { name: 'Ananya S.', source: 'Website', need: '2 BHK · ₹1.2 Cr', status: 'Calling', tone: 'brand' },
  { name: 'Vikram K.', source: '99acres', need: 'Plot · ₹85 L', status: 'Warm', tone: 'warm' },
  { name: 'Priya D.', source: 'Google Ads', need: '4 BHK · ₹3.5 Cr', status: 'Visit booked', tone: 'ok' },
  { name: 'Arjun T.', source: 'CSV import', need: '3 BHK · ₹1.8 Cr', status: 'Callback', tone: 'cold' },
] as const;

export const heroTrend = [32, 44, 38, 56, 52, 68, 61, 74, 70, 86, 80, 94];

export const performanceMetrics = [
  { label: 'Total Calls', value: 2480, format: 'int', delta: '+12%' },
  { label: 'Connected Calls', value: 1686, format: 'int', delta: '+9%' },
  { label: 'Avg. Response Time', value: 42, format: 'sec', delta: '−18s' },
  { label: 'Qualified Leads', value: 846, format: 'int', delta: '+15%' },
  { label: 'Site Visits Booked', value: 124, format: 'int', delta: '+7%' },
  { label: 'Cost per Qualified Lead', value: 310, format: 'inr', delta: '−6%' },
] as const;

export const callVolume = [
  { day: 'Mon', calls: 290, connected: 196 },
  { day: 'Tue', calls: 340, connected: 236 },
  { day: 'Wed', calls: 315, connected: 212 },
  { day: 'Thu', calls: 410, connected: 284 },
  { day: 'Fri', calls: 380, connected: 262 },
  { day: 'Sat', calls: 450, connected: 304 },
  { day: 'Sun', calls: 295, connected: 192 },
];

export const qualificationBars = [
  { label: 'Budget', value: 82 },
  { label: 'Location', value: 74 },
  { label: 'Config.', value: 88 },
  { label: 'Timeline', value: 61 },
  { label: 'Visit intent', value: 47 },
];

export const outcomeDistribution = [
  // Share of all 2,480 calls. Connected (qualified + callback + not interested) = 68%, matching the connect rate.
  { label: 'Qualified', value: 34, color: '#6A3FF0' },
  { label: 'Callback', value: 18, color: '#38BDF8' },
  { label: 'Not interested', value: 16, color: '#98A2B3' },
  { label: 'No answer', value: 32, color: '#F59E0B' },
];

export const campaigns = [
  { name: 'Premium Apartments', leads: 250, connected: 180, qualified: 72, visits: 24, status: 'Active' },
  { name: 'Luxury Residences', leads: 180, connected: 126, qualified: 54, visits: 18, status: 'Active' },
  { name: 'Residential Plots', leads: 320, connected: 224, qualified: 96, visits: 32, status: 'Scheduled' },
] as const;

/** Conceptual funnel comparison: illustrative only. */
export const funnel = {
  stages: ['New Leads', 'Contacted Leads', 'Qualified Buyers', 'Site Visits Booked'],
  manual: [1000, 420, 150, 40],
  ai: [1000, 680, 290, 85],
};
