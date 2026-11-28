/** Shared by the render page and the VTT caption generator. Times in seconds. */
export const SCENE_LEN = 3.75;
export const walkthroughScenes = [
  { title: 'Incoming Lead', caption: 'A buyer submits a property enquiry through a Meta Ads lead form.' },
  { title: 'AI Calling', caption: 'The lead enters the platform and the AI agent places a call automatically.' },
  { title: 'Buyer Conversation', caption: 'The AI discusses configuration, budget, location and purchase timeline.' },
  { title: 'Lead Qualification', caption: 'The conversation becomes structured CRM data with a lead score.' },
  { title: 'WhatsApp Follow-up', caption: 'A property brochure follow-up is prepared and sent on WhatsApp.' },
  { title: 'Site Visit Booking', caption: 'The buyer picks an available site visit slot.' },
  { title: 'Sales Team Handover', caption: 'The qualified buyer is assigned to a sales executive.' },
  { title: 'Performance Dashboard', caption: 'The completed workflow appears in the analytics dashboard.' },
];
export const WALKTHROUGH_LEN = walkthroughScenes.length * SCENE_LEN; // 30s
export const HERO_LEN = 14;
