export type Integration = {
  name: string;
  monogram: string;
  color: string;
  description: string;
  status: 'Planned' | 'Available';
};

/**
 * Integration status: none are implemented in this landing-page preview,
 * so every item is marked "Planned". Change status when a connector ships.
 * Names are used descriptively. No partnership or certification is implied.
 */
export const leadSources: Integration[] = [
  { name: 'Meta Ads', monogram: 'M', color: '#3B82F6', description: 'Capture lead-form enquiries the moment they are submitted.', status: 'Planned' },
  { name: 'Google Ads', monogram: 'G', color: '#22C55E', description: 'Sync lead-form extensions into campaigns automatically.', status: 'Planned' },
  { name: '99acres', monogram: '99', color: '#0EA5E9', description: 'Import property portal enquiries into one queue.', status: 'Planned' },
  { name: 'Housing.com', monogram: 'H', color: '#A855F7', description: 'Route portal buyers to the right project campaign.', status: 'Planned' },
  { name: 'Magicbricks', monogram: 'Mb', color: '#EF4444', description: 'Bring portal leads into qualification workflows.', status: 'Planned' },
  { name: 'Website Forms', monogram: '</>', color: '#F59E0B', description: 'Embed forms or post enquiries by webhook.', status: 'Planned' },
];

export const destinations: Integration[] = [
  { name: 'WhatsApp', monogram: 'W', color: '#22C55E', description: 'Send brochures, confirmations and reminders.', status: 'Planned' },
  { name: 'Salesforce', monogram: 'S', color: '#38BDF8', description: 'Write call outcomes and lead scores to records.', status: 'Planned' },
  { name: 'HubSpot', monogram: 'Hs', color: '#F97316', description: 'Update contacts, deals and activity timelines.', status: 'Planned' },
  { name: 'Gmail', monogram: 'Gm', color: '#EF4444', description: 'Email summaries and visit confirmations.', status: 'Planned' },
  { name: 'Webhooks & API', monogram: '{ }', color: '#A78BFA', description: 'Push events to any system you already run.', status: 'Planned' },
  { name: 'ScaleTrack CRM', monogram: 'ST', color: '#8B5CF6', description: 'Native pipeline sync for ScaleTrack users.', status: 'Planned' },
];
