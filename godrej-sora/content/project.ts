/**
 * Single source of truth for Godrej Sora project facts.
 *
 * Every figure carries a `source` so the marketing team can audit it:
 *  - 'official-site'  : read from godrejproperties.com/gurugram/residential/godrej-sora
 *  - 'brochure'       : from the 64-page Godrej Sora brochure (page number noted)
 *  - 'third-party'    : aggregator / listing data — approximate, shown with caveats only
 *  - 'config'         : operator-configurable, must be set before go-live
 *
 * Update this file (not the section components) when price, configurations,
 * availability or contact details change.
 */

export type Source = 'official-site' | 'brochure' | 'third-party' | 'config';

export interface Fact<T = string> {
  value: T;
  source: Source;
  /** brochure page or URL */
  ref?: string;
  /** false = must be re-verified before go-live */
  verified: boolean;
  note?: string;
}

export const project = {
  name: 'Godrej Sora',
  tagline: 'Your Place in the Sun.',
  descriptor: 'Japanese-Inspired Ultra-Luxury Residences',
  address: 'Sector 53, Gurugram',
  locality: 'Just Steps Away From Golf Course Road',
  developer: 'Godrej Properties Limited',
  officialUrl: 'https://www.godrejproperties.com/gurugram/residential/godrej-sora',

  rera: {
    number: 'RC/REP/HARERA/GGM/976/708/2025/79',
    date: '25 August 2025',
    authority: 'Haryana Real Estate Regulatory Authority, Gurugram',
    portal: 'https://haryanarera.gov.in',
    source: 'brochure' as Source,
    verified: true,
  },

  headline: {
    totalResidences: { value: 244, source: 'official-site', verified: true } as Fact<number>,
    configurations: {
      value: '3 & 4 BHK',
      source: 'official-site',
      verified: true,
      note: 'Official project page lists 3 & 4 BHK. A separate Godrej landing page has referred to 3.5 & 4.5 BHK; reconfirm current nomenclature before go-live.',
    } as Fact,
    startingPrice: {
      value: '₹8.31 Cr*',
      source: 'official-site',
      verified: false,
      note: 'Read from the official page at audit time; prices change. Set PRICE below from the latest cost sheet before go-live.',
    } as Fact,
    possession: {
      value: 'September 2032',
      source: 'official-site',
      verified: false,
      note: 'As stated on official page at audit time. Listings also cite Sept 2031–Aug 2032 and, as an outlier, 2029–30. Subject to RERA-registered timelines.',
    } as Fact,
    towers: {
      value: '4 towers',
      source: 'third-party',
      verified: false,
      note: 'Listings agree on four towers but give G+30 or G+31 floors. Not displayed until confirmed from the brochure master plan.',
    } as Fact,
  },

  /** Verification log — conflicts found between sources, kept here so the sales team can resolve them. */
  conflicts: [
    'Configurations: official page says "3 & 4 BHK"; a Godrej landing page has said "3.5 & 4.5 BHK"; aggregators add "4 BHK L / XL / Grande".',
    'Starting price: official page ₹8.31 Cr at audit time; aggregators range ₹7.99–11.40 Cr; some quote ₹10.55 Cr (4 BHK L) and ₹11.51 Cr (4 BHK XL).',
    'Areas: 1,552–2,483 sq ft vs 2,771–3,971 sq ft vs 3,050–4,270 sq ft across listings (carpet vs built-up vs super). Not displayed.',
    'Possession: September 2032 (most common) vs Sept 2031–Aug 2032 vs 2029–30.',
    'Floors: G+30 vs G+31. Land: 3.6 vs 3.7 acres. Not displayed.',
    'Eight Rays of Sora: the eight names come from the brief (brochure p.11). No public source repeats them; verify wording and order against the brochure.',
    'Floor-to-floor: 3.4 m (brief + one listing) vs "11.5 ft floor-to-ceiling" (another listing). 3.4 m shown as brochure-sourced.',
  ],

  /** Section 05 — residence features (brochure p.44–49, per brief). */
  residenceFeatures: [
    { title: '244 limited-edition residences', detail: 'The complete Sora collection, across the project.', source: 'official-site', verified: true },
    { title: 'Only 2 residences per core, per tower', detail: 'Each floor core serves just two homes, so your lobby is nearly your own.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: 'Approximately 50-ft balconies', detail: 'A continuous outdoor room, long enough to hold a dining table, a garden and a quiet corner.', source: 'official-site', verified: true },
    { title: 'Private lift lobbies', detail: 'Genkan-inspired: arrive directly into your own threshold.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: '3.4 m floor-to-floor height', detail: 'Ceilings that let light travel further into every room.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: '380–600 sq. ft. living and dining', detail: 'Generous central spaces, sized for both solitude and gatherings.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: 'Premium floor finishes', detail: 'Natural materials selected for quiet, enduring beauty.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: 'Double-glazed windows by Schüco or equivalent', detail: 'Acoustic and thermal calm, with uninterrupted views.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: 'Premium CP fittings by Villeroy & Boch or equivalent', detail: 'Bathrooms considered down to the touch.', source: 'brochure', ref: 'p.44–49', verified: false },
    { title: 'Five high-speed lifts per tower', detail: 'Unhurried arrivals, every time.', source: 'brochure', ref: 'p.44–49', verified: false },
  ] as Array<{ title: string; detail: string; source: Source; ref?: string; verified: boolean }>,

  /** Section 03 — the Eight Rays of Sora. Names per brochure p.11 (as supplied in the brief; verify order/wording against the PDF).
   *  The `copy` lines are marketing copy composed from verified facts, not brochure text. */
  eightRaysSource: { source: 'brochure' as Source, ref: 'p.11', verified: false },
  eightRays: [
    { name: 'Accessibility', copy: 'Moments from Golf Course Road and the Rapid Metro, Sora keeps the city within reach while keeping it at a respectful distance.' },
    { name: 'Inspiration', copy: 'A Torii-inspired façade, Zen gardens and still water: an architecture written to inspire the everyday.' },
    { name: 'Influence', copy: 'An address in Gurugram\'s most established luxury corridor, shaped by Hafeez Contractor and Oracles.' },
    { name: 'Mindfulness', copy: 'Sunken seating, contemplative courts and quiet walks designed for attention rather than distraction.' },
    { name: 'Wellness', copy: 'The Shiki Clubhouse, with its indoor onsen-inspired pool, spa and rooftop pool, makes wellbeing a daily ritual.' },
    { name: 'Luxury', copy: 'Approximately 50-ft balconies, triple-height lobbies and finishes chosen for how they feel, not only how they look.' },
    { name: 'Exclusiveness', copy: 'A collection of 244 residences, with only two homes per core on every floor.' },
    { name: 'Partnership', copy: 'Backed by the Godrej name: more than a century of trust, delivered through Godrej Properties.' },
  ],

  /** Section 09 — Shiki Clubhouse amenities (brochure p.33–36, per brief). */
  amenities: [
    { name: 'Indoor Onsen Pool', copy: 'An onsen-inspired indoor pool: warm, enclosed, meditative.', image: 'clubhouse/onsen-pool', ref: 'p.35', verified: true },
    { name: 'Outdoor Rooftop Pool', copy: 'Open sky above, the city softened below.', image: 'clubhouse/rooftop-pool', ref: 'p.36', verified: true },
    { name: 'Gymnasium', copy: 'Strength and movement in natural light.', image: 'amenities/gymnasium', ref: 'p.33–36', verified: false },
    { name: 'Spa', copy: 'Treatment rooms designed around stillness.', image: 'amenities/spa', ref: 'p.33–36', verified: false },
    { name: 'Sculpted Staircase', copy: 'A clubhouse centrepiece carved as much as built.', image: 'amenities/sculpted-staircase', ref: 'p.33', verified: false },
    { name: 'Squash Court', copy: 'Competition-grade play, steps from home.', image: 'amenities/squash-court', ref: 'p.33–36', verified: false },
    { name: 'Padel Court', copy: 'The world\'s fastest-growing racquet sport, at Sora.', image: 'amenities/padel-court', ref: 'p.33–36', verified: false },
    { name: 'Badminton / Multipurpose Hall', copy: 'A hall that flexes from sport to celebration.', image: 'amenities/multipurpose-hall', ref: 'p.33–36', verified: false },
  ],

  /** Section 11 — location (brochure map, p.? to be inserted). Times are approximate, third-party at audit time. */
  location: {
    anchor: 'Sector 53, Gurugram — just steps from Golf Course Road',
    caveat:
      'Distances and travel times are approximate, measured from the project site via mapping tools and third-party sources at the time of writing. They are indicative only and are not guaranteed; traffic, routes and infrastructure may change.',
    groups: [
      {
        category: 'Transport',
        items: [
          { name: 'Golf Course Road', value: 'Steps away', source: 'official-site', verified: true },
          { name: 'Rapid Metro — Sector 53/54 station', value: '~2–5 min', source: 'third-party', verified: false },
          { name: 'Indira Gandhi International Airport', value: '~20–25 min', source: 'third-party', verified: false },
        ],
      },
      {
        category: 'Corporate',
        items: [
          { name: 'DLF Cyber City', value: '~15 min', source: 'third-party', verified: false },
          { name: 'Golf Course Road business district', value: 'Minutes away', source: 'third-party', verified: false },
        ],
      },
      {
        category: 'Healthcare',
        items: [
          { name: 'Artemis Hospital', value: '~7 min', source: 'third-party', verified: false },
          { name: 'Max Hospital', value: '~15 min', source: 'third-party', verified: false },
        ],
      },
      {
        category: 'Leisure & Shopping',
        items: [
          { name: 'DLF Golf & Country Club', value: '~7 min', source: 'third-party', verified: false },
          { name: 'Wazirabad Lake', value: '~700 m', source: 'third-party', verified: false },
        ],
      },
      {
        category: 'Education',
        items: [
          { name: 'Leading schools along Golf Course Road', value: 'See location guide', source: 'third-party', verified: false },
        ],
      },
    ],
  },

  /** Section 12 — configurations currently confirmed on the official project page. */
  configurations: [
    {
      id: '3bhk',
      label: '3 BHK',
      headline: 'The 3 BHK Residence',
      area: { value: 'On request', source: 'config', verified: false, note: 'Carpet/super area to be taken from the official cost sheet; aggregators conflict.' } as Fact,
      price: { value: 'On request', source: 'config', verified: false } as Fact,
      floorPlan: 'floor-plans/3bhk-typical',
      highlights: ['Approx. 50-ft balcony', 'Private lift lobby', '3.4 m floor-to-floor', 'Two homes per core'],
    },
    {
      id: '4bhk',
      label: '4 BHK',
      headline: 'The 4 BHK Residence',
      area: { value: 'On request', source: 'config', verified: false } as Fact,
      price: { value: 'On request', source: 'config', verified: false } as Fact,
      floorPlan: 'floor-plans/4bhk-typical',
      highlights: ['Approx. 50-ft balcony', 'Private lift lobby', '380–600 sq. ft. living/dining', 'Two homes per core'],
    },
  ],

  partners: [
    {
      name: 'Architect Hafeez Contractor',
      role: 'Principal Architect',
      copy: 'One of India\'s most prolific architectural practices, responsible for Sora\'s Torii-inspired façade, its tower massing and the rhythm of its approximately 50-ft balconies.',
      source: 'official-site',
      verified: true,
    },
    {
      name: 'Oracles Landscape Architecture',
      role: 'Landscape Architect',
      copy: 'Authors of Sora\'s Japanese-inspired grounds: Zen gardens, still water, cherry-blossom-inspired native planting and sunken courts for contemplation.',
      source: 'official-site',
      verified: true,
    },
  ],

  legacy: {
    heading: 'A Legacy of Trust.',
    paragraphs: [
      'The Godrej name has been part of Indian life since 1897, built across generations on a reputation for integrity, quality and quiet innovation.',
      'Godrej Properties brings that philosophy to real estate, developing residential and commercial projects across India\'s major cities with an emphasis on design, sustainability and on-time delivery.',
    ],
    note: 'Add developer credentials (projects delivered, awards, sustainability ratings) only from Godrej Properties\' current approved corporate fact sheet.',
  },

  walkthrough: {
    /** Set to the official Godrej Sora walkthrough (YouTube/Vimeo ID or self-hosted URL) once embed permission is confirmed. */
    provider: 'youtube' as 'youtube' | 'vimeo' | 'file' | 'none',
    id: '',
    poster: 'hero/tower-elevation',
    verified: false,
  },

  disclaimers: {
    imagery:
      'Images are artist\'s impressions and conceptual representations, unless otherwise stated. Some lifestyle images are illustrative stock photographs. Elevations, finishes, landscaping and amenities are indicative and subject to change as per approvals.',
    pricing:
      '*Prices are indicative, subject to change without notice and exclusive of statutory charges, taxes and other applicable costs. Please request the current cost sheet.',
    general:
      'This is not an offer or invitation to sell. All information, specifications, plans and renders are subject to change as per the approvals of the competent authorities and the terms of the Agreement for Sale. Nothing here constitutes a legal offering or a promise of any kind.',
  },
};

export type ProjectContent = typeof project;
