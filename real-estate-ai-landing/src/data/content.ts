import conversations from './voice-conversations.json';
/** Approved landing page copy. Edit text here; components read from this file. */

export const nav = {
  links: [
    { label: 'Solutions', href: '#features', dropdown: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'For Teams', href: '#use-cases' },
  ],
  solutions: [
    { label: 'AI Voice Agents', desc: 'Natural property conversations', href: '#voice-agents', icon: 'Mic' },
    { label: 'Lead Qualification', desc: 'Budget, intent and timeline', href: '#qualification', icon: 'ListChecks' },
    { label: 'Site Visit Booking', desc: 'Calendar slots and reminders', href: '#how-it-works', icon: 'CalendarCheck' },
    { label: 'Database Reactivation', desc: 'Re-engage older enquiries', href: '#features', icon: 'RefreshCw' },
    { label: 'Omnichannel Automation', desc: 'Voice, WhatsApp, email, SMS', href: '#omnichannel', icon: 'Workflow' },
    { label: 'Sales Analytics', desc: 'Campaign and call outcomes', href: '#performance', icon: 'BarChart3' },
  ],
};

export const hero = {
  eyebrow: 'AI Voice Agents Built for Real Estate',
  title: 'From property enquiries to qualified buyers.',
  description: 'Automate sales calls, understand buyer intent and schedule property visits with intelligent AI agents.',
  primaryCta: 'Book a Demo',
  secondaryCta: 'Hear a Sample Call',
  features: ['Lead Qualification', 'Site Visit Booking', 'Database Reactivation', 'Instant Follow-up'],
};

export const trusted = {
  heading: 'Built for the real estate industry.',
  /** Replace with authorised client logos later: { name, logo: '/assets/images/clients/x.svg' } */
  items: [
    { name: 'Real Estate Developers', icon: 'Building2' },
    { name: 'Channel Partners', icon: 'Handshake' },
    { name: 'Property Consultants', icon: 'UserRoundCheck' },
    { name: 'Marketing Agencies', icon: 'Megaphone' },
    { name: 'Sales Teams', icon: 'Users' },
  ] as { name: string; icon: string; logo?: string }[],
};

export const problem = {
  eyebrow: 'The Problem',
  title: 'Stop letting valuable property enquiries go unanswered.',
  description:
    'Traditional real estate sales teams often struggle to respond quickly to every enquiry, follow up consistently, and manage large lead databases. Intelligent automation helps keep prospects engaged throughout the sales journey.',
  cards: [
    { title: 'Late-Night Enquiries', body: 'Property enquiries arriving outside normal office hours can remain unattended.' },
    { title: 'Delayed Follow-ups', body: 'Delayed responses can cause interested buyers to lose interest or explore competing properties.' },
    { title: 'Unused Databases', body: 'Previously acquired leads often remain in spreadsheets or CRMs without consistent engagement.' },
  ],
};

export const funnelCopy = {
  eyebrow: 'Lead to Site Visit',
  title: 'Keep every property enquiry moving forward.',
  description: 'Guide incoming enquiries through contact, qualification, and site visit scheduling using an automated sales workflow.',
};

export const performanceCopy = {
  eyebrow: 'Performance & Results',
  title: 'Understand your sales performance at every stage.',
  description: 'Track calling activity, buyer qualification, site visit bookings, and campaign outcomes from one centralized dashboard.',
};

export const howItWorks = {
  eyebrow: 'How It Works',
  title: 'From lead import to site visit in five simple steps.',
  steps: [
    { n: '01', title: 'Import Leads & Connect Sources', body: 'CSV upload, manual entry, Meta Ads, Google Ads, CRM, property portals, website forms, APIs and webhooks.' },
    { n: '02', title: 'Configure Your Campaign', body: 'Set up project details, pricing, inventory, qualifying questions, AI agent instructions and sales rules.' },
    { n: '03', title: 'Launch AI Conversations', body: 'AI agents contact eligible buyers, handle property-related questions and understand customer requirements.' },
    { n: '04', title: 'Qualify & Score Buyers', body: 'Capture budget, location, configuration, purchase timeline, intent, objections, callback preferences and site visit interest.' },
    { n: '05', title: 'Schedule Visits & Assign Leads', body: 'Schedule available site visits, send confirmations, update CRM records, notify sales teams and initiate configured follow-up actions.' },
  ],
};

export type Line = { speaker: 'ai' | 'buyer'; en: string; enTts: string; hi: string; hiTts: string };
export type Conversation = { id: string; tab: string; lines: Line[]; outcome: { en: string; hi: string } };

export const voice = {
  eyebrow: 'Voice AI',
  title: 'AI conversations built around real property buyers.',
  description: 'Create intelligent voice agents that understand property requirements, handle buyer objections and communicate using a configurable brand tone.',
  conversations: conversations as Conversation[],
};

export const omnichannel = {
  eyebrow: 'Omnichannel Automation',
  title: 'One conversation. Multiple channels. A connected sales journey.',
  description: 'Keep property buyers engaged through coordinated voice calls, WhatsApp, email, SMS, CRM updates and site visit reminders.',
  nodes: ['AI Voice Calling', 'WhatsApp', 'Email', 'SMS', 'CRM', 'Site Visit Calendar', 'Sales Team'],
  sequence: ['New Lead Received', 'AI Call', 'Buyer Qualified', 'Brochure Requested', 'WhatsApp Follow-up', 'Site Visit Scheduled', 'Sales Team Assigned'],
};

export const features = {
  eyebrow: 'Platform Features',
  title: 'Everything your real estate sales team needs to automate smarter.',
  items: [
    { title: 'Instant AI Calling', body: 'Automatically connect with new property enquiries.' },
    { title: 'Lead Qualification', body: 'Capture budget, preferences and purchase intent.' },
    { title: 'WhatsApp Automation', body: 'Share brochures, confirmations and follow-ups.' },
    { title: 'Multilingual AI', body: 'Hindi, English, Hinglish and configurable regional language support.' },
    { title: 'Site Visit Scheduling', body: 'Book appointments and notify sales teams.' },
    { title: 'Database Reactivation', body: 'Reconnect with eligible previously unworked leads.' },
    { title: '24/7 Automation', body: 'Handle incoming enquiries and schedule outreach according to configured calling hours and communication permissions.' },
    { title: 'CRM Integration', body: 'Synchronize leads, activities and outcomes.' },
    { title: 'Lead Scoring', body: 'Identify and prioritize high-intent buyers.' },
    { title: 'Call Intelligence', body: 'Access conversation summaries and call insights.' },
  ],
};

export const useCases = {
  eyebrow: 'Use Cases',
  title: 'Built for every side of real estate sales.',
  tabs: [
    { id: 'developers', label: 'Real Estate Developers', intro: 'Manage project launches and convert incoming property enquiries into site visits.',
      items: ['New project launches', 'Fresh lead qualification', 'Inventory promotion', 'Unsold unit campaigns', 'Site visit scheduling', 'Old database reactivation', 'Events and open-house drives', 'Post-visit follow-ups', 'Payment reminders', 'Channel partner engagement'] },
    { id: 'partners', label: 'Channel Partners & Brokerages', intro: 'Help property consultants prioritize genuine buyers.',
      items: ['Buyer qualification', 'Multiple project campaigns', 'Callback scheduling', 'Old lead reactivation', 'Site visit coordination'] },
    { id: 'agencies', label: 'Marketing Agencies', intro: 'Connect advertising campaigns with automated sales qualification.',
      items: ['Meta and Google lead integration', 'Client-wise campaigns', 'Lead quality tracking', 'Instant follow-up', 'Performance reporting'] },
    { id: 'callcentres', label: 'Call Centres', intro: 'Automate repetitive sales conversations and route interested buyers.',
      items: ['Bulk calling campaigns', 'Call outcome tracking', 'Multilingual outreach', 'Automated callbacks', 'Human agent handoff'] },
  ],
};

export const qualification = {
  eyebrow: 'Real Estate Intelligence',
  title: 'Understand what every property buyer needs.',
  description: 'Capture the information that matters most to real estate sales teams through intelligent, structured buyer conversations.',
  questions: [
    'Self-use or investment?', 'Preferred location?', 'Required configuration?', 'What is your budget?', 'Purchase timeline?',
    'Ready or under construction?', 'Visited other properties?', 'Interested in a site visit?', 'Other decision-makers?', 'Working with another broker?',
  ],
  profile: [
    { k: 'Configuration', v: '3 BHK' },
    { k: 'Budget', v: '₹2 Crore' },
    { k: 'Purpose', v: 'Self-use' },
    { k: 'Purchase Timeline', v: '6 Months' },
    { k: 'Site Visit', v: 'Interested' },
    { k: 'Lead Category', v: 'Qualified' },
  ],
};

export const integrationsCopy = {
  eyebrow: 'Integrations',
  title: 'Connect with the tools you already use.',
  description: 'Bring advertising platforms, property portals, communication channels and CRM systems into one connected sales workflow.',
};

export const mobile = {
  eyebrow: 'Mobile CRM',
  title: 'Your real estate sales pipeline, wherever you go.',
  description: 'Manage property enquiries, track buyer conversations, review lead qualification and coordinate site visits through a mobile-first experience.',
};

export const comparison = {
  eyebrow: 'Compare Solutions',
  title: 'See how AI fits into your real estate sales workflow.',
  description: 'Compare the planned AI automation capabilities with traditional manual calling and basic IVR systems.',
  columns: ['Our Planned AI Platform', 'Manual Sales Team', 'Basic IVR'],
  rows: [
    ['Instant Lead Response', 'Supported by design', 'Staff dependent', 'Limited'],
    ['Natural AI Conversation', 'Supported by design', 'Human conversations', 'Limited'],
    ['Multilingual Communication', 'Configurable', 'Staff dependent', 'Configurable'],
    ['Automated Follow-ups', 'Supported by design', 'Limited', 'Limited'],
    ['Lead Qualification', 'Supported by design', 'Manual', 'Limited'],
    ['Database Reactivation', 'Supported by design', 'Manual', 'Limited'],
    ['Site Visit Booking', 'Supported by design', 'Manual', 'Limited'],
    ['CRM Integration', 'Planned integrations', 'Possible', 'Possible'],
    ['Scalable Calling', 'Infrastructure dependent', 'Staff dependent', 'Possible'],
  ],
};

export const faq = {
  eyebrow: 'FAQs',
  title: 'Everything you need to know.',
  items: [
    { q: 'What is an AI voice agent for real estate?', a: 'An automated voice assistant that contacts property enquiries, understands buyer requirements and initiates sales actions.' },
    { q: 'How quickly can the AI contact new leads?', a: 'The system will be designed to initiate outreach automatically when a new lead arrives, subject to campaign settings and permitted calling hours.' },
    { q: 'Can AI qualify leads and book site visits?', a: 'The planned workflow captures buyer requirements and schedules visits using available calendar slots.' },
    { q: 'Does it integrate with my existing CRM?', a: 'CRM connections, APIs and webhook integrations are part of the planned product scope.' },
    { q: 'Can I use CRM features without AI calling?', a: 'CRM-only workflows can be supported as a separate configuration.' },
    { q: 'Can it contact old property leads?', a: 'Database reactivation will support eligible contacts, subject to consent and communication preferences.' },
    { q: 'Will AI replace my sales team?', a: 'AI handles repetitive outreach and qualification, while sales professionals focus on consultations, negotiations and closing.' },
  ],
};

export const finalCta = {
  eyebrow: 'Built for Real Estate Businesses',
  title: 'Transform your real estate sales workflow with AI.',
  description: 'Discover how intelligent calling, qualification and automated follow-ups can support your sales team.',
  primaryCta: 'Book a Demo',
  secondaryCta: 'Hear AI in Action',
};

export const footer = {
  columns: [
    { title: 'Solutions', links: [
      { label: 'AI Voice Agents', href: '#voice-agents' }, { label: 'Lead Qualification', href: '#qualification' },
      { label: 'Site Visit Booking', href: '#how-it-works' }, { label: 'Database Reactivation', href: '#features' }, { label: 'WhatsApp Automation', href: '#omnichannel' } ] },
    { title: 'For Teams', links: [
      { label: 'Developers', href: '#use-cases', tab: 'developers' }, { label: 'Channel Partners', href: '#use-cases', tab: 'partners' },
      { label: 'Marketing Agencies', href: '#use-cases', tab: 'agencies' }, { label: 'Call Centres', href: '#use-cases', tab: 'callcentres' } ] },
    { title: 'Company', links: [
      { label: 'About Us', href: '#top' }, { label: 'Contact', href: '#demo' }, { label: 'Book a Demo', href: '#demo' }, { label: 'Integrations', href: '#integrations' } ] },
    { title: 'Legal', links: [ { label: 'Privacy Policy', href: '#privacy' }, { label: 'Terms of Service', href: '#terms' } ] },
  ],
};
