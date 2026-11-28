/**
 * The single fictional demo story reused across the hero, workflows, qualification,
 * omnichannel, mobile CRM and the walkthrough video. Keep every section consistent with this.
 * ALL DATA IS ILLUSTRATIVE.
 */
export const story = {
  buyer: { name: 'Rohan Mehta', short: 'Rohan M.', phone: '+91 98••• ••210', source: 'Meta Ads' },
  project: { name: 'Skyline Residences', campaign: 'Skyline Residences · Launch', location: 'Whitefield, Bengaluru' },
  requirement: { configuration: '3 BHK', budget: '₹2 Crore', budgetShort: '₹2 Cr', purpose: 'Self-use', timeline: '6 Months', status: 'Ready to move' },
  agent: { name: 'Aria', languages: 'EN · HI' },
  score: 86,
  visit: { day: 15, label: 'Sat, 15 Nov', time: '11:00 AM', short: 'Sat 15 · 11 AM' },
  executive: { name: 'Kavya Rao', role: 'Senior sales executive' },
} as const;
