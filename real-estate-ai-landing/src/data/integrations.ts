import type { BrandIconKey } from './brand-icons';

/**
 * Integration catalogue. None are implemented in this preview, so the section carries one
 * section-level "planned" disclosure instead of a label on every card.
 * `brand` uses a CC0 Simple Icons mark (see brand-icons.ts). Brands without a licensed mark
 * (Salesforce removed its mark from Simple Icons; 99acres, Housing.com and Magicbricks have none)
 * use a neutral interface icon (`icon`, a Lucide name) and are identified by name only.
 */
export type Integration = { name: string; detail: string; brand?: BrandIconKey; icon?: 'Building2' | 'Home' | 'Blocks' | 'FileText' | 'Cloud' | 'Webhook' | 'BarChart3'; tint: string };

export const leadSources: Integration[] = [
  { name: 'Meta Ads', detail: 'Lead-form enquiries', brand: 'meta', tint: '#0467DF' },
  { name: 'Google Ads', detail: 'Lead-form extensions', brand: 'googleads', tint: '#4285F4' },
  { name: '99acres', detail: 'Portal enquiries', icon: 'Building2', tint: '#0d1424' },
  { name: 'Housing.com', detail: 'Portal enquiries', icon: 'Home', tint: '#0d1424' },
  { name: 'Magicbricks', detail: 'Portal enquiries', icon: 'Blocks', tint: '#0d1424' },
  { name: 'Website Forms', detail: 'Embed or post by webhook', icon: 'FileText', tint: '#0d1424' },
];

export const destinations: Integration[] = [
  { name: 'WhatsApp', detail: 'Brochures and confirmations', brand: 'whatsapp', tint: '#25D366' },
  { name: 'Salesforce', detail: 'Outcomes and lead scores', icon: 'Cloud', tint: '#0d1424' },
  { name: 'HubSpot', detail: 'Contacts, deals, timelines', brand: 'hubspot', tint: '#FF7A59' },
  { name: 'Gmail', detail: 'Visit confirmations', brand: 'gmail', tint: '#EA4335' },
  { name: 'Webhooks & API', detail: 'Events to any system', icon: 'Webhook', tint: '#0d1424' },
  { name: 'ScaleTrack CRM', detail: 'Native pipeline sync', icon: 'BarChart3', tint: '#0d1424' },
];
