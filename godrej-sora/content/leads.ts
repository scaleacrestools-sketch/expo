/** Lead magnets and the forms they open. Each CTA passes its `id` so the lead stores its origin. */
export const leadMagnets = {
  brochure: { id: 'brochure', title: 'Download the Godrej Sora Brochure', cta: 'Request Private Brochure', intro: 'The complete 64-page brochure: architecture, residences, the Shiki Clubhouse and the Eight Rays of Sora.', fields: ['name', 'phone', 'email', 'consent'] },
  floorPlans: { id: 'floor-plans', title: 'Request Complete Floor Plans', cta: 'Request Complete Floor Plans', intro: 'Receive every confirmed layout, with dimensions and orientation.', fields: ['name', 'phone', 'email', 'configuration', 'consent'] },
  priceSheet: { id: 'price-sheet', title: 'Request the Latest Price & Cost Sheet', cta: 'Request Detailed Cost Sheet', intro: 'Current pricing, payment plan and applicable charges, straight from the sales desk.', fields: ['name', 'phone', 'email', 'configuration', 'budget', 'timeline', 'consent'] },
  availability: { id: 'availability', title: 'Check Current Residence Availability', cta: 'Check Availability', intro: 'We will confirm which residences and floors are currently open.', fields: ['name', 'phone', 'configuration', 'timeline', 'consent'] },
  locationGuide: { id: 'location-guide', title: 'Request the Location Guide', cta: 'Request Location Guide', intro: 'Schools, hospitals, business districts and connectivity, mapped from Sector 53.', fields: ['name', 'phone', 'email', 'consent'] },
  siteVisit: { id: 'site-visit', title: 'Book a Private Site Visit', cta: 'Schedule My Private Visit', intro: 'An unhurried, private walkthrough of the Sora experience centre.', fields: ['name', 'phone', 'visitDate', 'visitSlot', 'message', 'consent'] },
  presentation: { id: 'presentation', title: 'Request a Private Presentation', cta: 'Request Private Presentation', intro: 'A one-to-one presentation, at the experience centre or online.', fields: ['name', 'phone', 'email', 'configuration', 'timeline', 'consent'] },
  enquiry: { id: 'enquiry', title: 'Enquire About Godrej Sora', cta: 'Enquire Now', intro: 'Tell us what you would like to know.', fields: ['name', 'phone', 'message', 'consent'] },
} as const;

export type LeadMagnetId = keyof typeof leadMagnets;
export type FieldKey = (typeof leadMagnets)[LeadMagnetId]['fields'][number];

export const timelines = ['Within 3 months', '3–6 months', '6–12 months', 'Exploring'] as const;
export const budgets = ['₹8–10 Cr', '₹10–12 Cr', '₹12 Cr +', 'Prefer not to say'] as const;
export const visitSlots = ['Morning (10am–12pm)', 'Afternoon (12pm–3pm)', 'Evening (3pm–6pm)'] as const;
