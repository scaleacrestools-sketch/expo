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
    totalResidences: { value: 244, source: 'brochure', ref: 'p.53, p.55', verified: true } as Fact<number>,
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
    { title: 'Just 2 units per core, per tower', detail: 'Each floor core serves just two homes, so your lobby is nearly your own.', source: 'brochure', ref: 'p.56', verified: true },
    { title: 'Residences with ~50 ft balconies', detail: 'A continuous outdoor room, long enough to hold a dining table, a garden and a quiet corner.', source: 'brochure', ref: 'p.45', verified: true },
    { title: 'Private lift lobbies', detail: 'As exclusive as it gets: arrive directly into your own threshold.', source: 'brochure', ref: 'p.46', verified: true },
    { title: 'Large-volume residences with 3.4 m floor-to-floor height', detail: 'Ceilings that let light travel further into every room.', source: 'brochure', ref: 'p.48', verified: true },
    { title: 'Large 380–600 sq. ft. living/dining area', detail: 'Your space, made spacious: sized for both solitude and gatherings.', source: 'brochure', ref: 'p.49', verified: true },
    { title: 'Luxury floor finish', detail: 'Natural materials selected for quiet, enduring beauty.', source: 'brochure', ref: 'p.47', verified: true },
    { title: 'Double-glazed windows by Schüco or equivalent', detail: 'Acoustic and thermal calm, with uninterrupted views.', source: 'brochure', ref: 'p.51', verified: true },
    { title: 'State-of-the-art CP fittings from Villeroy & Boch or equivalent', detail: 'Bathrooms considered down to the touch.', source: 'brochure', ref: 'p.50', verified: true },
    { title: '5 serving high-speed lifts per tower', detail: 'Never wait to get home.', source: 'brochure', ref: 'p.58', verified: true },
    { title: 'Dual sunrise and sunset views', detail: 'Watch the sun revolve around you: every residence enjoys both horizons.', source: 'brochure', ref: 'p.30', verified: true },
    { title: 'Triple-height lobby', detail: 'In seamless harmony with the landscaped courtyards.', source: 'brochure', ref: 'p.29', verified: true },
  ] as Array<{ title: string; detail: string; source: Source; ref?: string; verified: boolean }>,

  /** Section 03 — the Eight Rays of Sora. Names per brochure p.11 (as supplied in the brief; verify order/wording against the PDF).
   *  The `copy` lines are marketing copy composed from verified facts, not brochure text. */
  eightRaysSource: { source: 'brochure' as Source, ref: 'p.11', verified: true },
  eightRaysIntro: 'Sora is Japanese for sky. And just like the sky, which brings us the light from the sun, Godrej Sora reflects the radiance emanating from the Land of the Rising Sun. The path to your new home is illuminated by the 8 Rays of Sora.',
  eightRays: [
    { name: 'Accessibility', sub: 'Prime location: Sector 53', copy: 'Moments from Golf Course Road and the Rapid Metro, Sora keeps the city within reach while keeping it at a respectful distance.' },
    { name: 'Inspiration', sub: 'The Shibui philosophy', copy: 'A Torii-inspired façade, Zen gardens and still water: an architecture written to inspire the everyday.' },
    { name: 'Influence', sub: 'Japanese-themed design', copy: 'An address in Gurugram\'s most established luxury corridor, shaped by Hafeez Contractor and Oracles.' },
    { name: 'Mindfulness', sub: 'Your mind space to soar', copy: 'Sunken seating, contemplative courts and quiet walks designed for attention rather than distraction.' },
    { name: 'Wellness', sub: 'The Shiki Clubhouse', copy: 'The Shiki Clubhouse, with its indoor onsen-inspired pool, spa and rooftop pool, makes wellbeing a daily ritual.' },
    { name: 'Luxury', sub: 'The sheer bliss of space', copy: 'Approximately 50-ft balconies, triple-height lobbies and finishes chosen for how they feel, not only how they look.' },
    { name: 'Exclusiveness', sub: 'Limited-edition landmark', copy: 'A collection of 244 residences, with only two homes per core on every floor.' },
    { name: 'Partnership', sub: 'Leading design partners', copy: 'Backed by the Godrej name: more than a century of trust, delivered through Godrej Properties.' },
  ],

  /** Section 09 — Shiki Clubhouse amenities (brochure p.33–36, per brief). */
  amenities: [
    { name: 'Indoor Onsen Pool', copy: 'An onsen-inspired indoor pool: warm, enclosed, meditative.', image: 'clubhouse/onsen-pool', ref: 'p.35', verified: true },
    { name: 'Outdoor Rooftop Pool', copy: 'Open sky above, the city softened below.', image: 'clubhouse/rooftop-pool', ref: 'p.36', verified: true },
    { name: 'Gymnasium', copy: 'Hit all your goals: strength and movement in natural light.', image: 'amenities/gymnasium', ref: 'p.37', verified: true },
    { name: 'Spa', copy: 'Refresh every sense: treatment rooms designed around stillness.', image: 'amenities/spa', ref: 'p.38', verified: true },
    { name: 'Sculpted Staircase', copy: 'Your stairway to calm: a centrepiece carved as much as built.', image: 'amenities/sculpted-staircase', ref: 'p.39', verified: true },
    { name: 'Squash Court', copy: 'Keep fit the fun way, steps from home.', image: 'amenities/squash-court', ref: 'p.40', verified: true },
    { name: 'Padel Court', copy: 'Get the fun going with the world\'s fastest-growing racquet sport.', image: 'amenities/padel-court', ref: 'p.41', verified: true },
    { name: 'Badminton / Multi-purpose Hall', copy: 'For a smashing good time with friends.', image: 'amenities/multipurpose-hall', ref: 'p.42', verified: true },
  ],

  /** Section 11 — location (brochure map, p.? to be inserted). Times are approximate, third-party at audit time. */
  location: {
    anchor: 'Sector 53, Gurugram — just steps from Golf Course Road',
    caveat:
      'Distances and times as per Google Maps, from the brochure (p.14–15); actuals may differ. Commuting time may vary depending on traffic conditions. Indicative only and not guaranteed.',
    source: 'brochure' as Source,
    ref: 'p.14–16',
    verified: true,
    groups: [
      { category: 'Educational institutions', items: [
        { name: 'Heritage Xperiential School', km: 2.6, min: 7 }, { name: 'Shalom Hills International School', km: 3.6, min: 9 }, { name: 'Shiv Nadar School', km: 4.4, min: 8 },
        { name: 'The Sri Ram School', km: 5.1, min: 12 }, { name: 'Kunskapsskolan School', km: 5.7, min: 11 }, { name: 'Scottish High International School', km: 7.2, min: 17 } ] },
      { category: 'Healthcare facilities', items: [
        { name: 'Paras Hospital', km: 3.5, min: 9 }, { name: 'Cloudnine Hospital', km: 5, min: 10 }, { name: 'Fortis Hospital', km: 5.6, min: 16 }, { name: 'Marengo Asia Hospital', km: 6.5, min: 20 },
        { name: 'Artemis Hospital', km: 6.7, min: 19 }, { name: 'Max Hospital', km: 6.9, min: 15 }, { name: 'Medanta The Medicity', km: 9.8, min: 28 } ] },
      { category: 'Business centres', items: [
        { name: 'Horizon Centre', km: 2.3, min: 5 }, { name: 'Masterpiece', km: 2.6, min: 6 }, { name: 'Godrej Commercial', km: 3.9, min: 7 }, { name: 'Business Park', km: 5.5, min: 9 },
        { name: 'HQ 27 Headquarters', km: 6.3, min: 14 }, { name: 'Business Club', km: 6.6, min: 20 }, { name: 'Cybercity', km: 8.5, min: 14 }, { name: 'Worldmark', km: 11, min: 30 } ] },
      { category: 'Malls', items: [
        { name: 'Central Plaza Mall', km: 2.4, min: 10 }, { name: 'South Point Mall', km: 2.8, min: 8 }, { name: 'Global Foyer', km: 4.6, min: 13 }, { name: 'Ardee Mall', km: 5, min: 14 }, { name: 'Mega Mall', km: 6.4, min: 14 } ] },
      { category: 'Transport', items: [
        { name: 'Sector 53-54 Rapid Metro Station', km: null, min: null, note: 'Shown on brochure map (p.16)' }, { name: 'Indira Gandhi International Airport', km: null, min: null, note: 'Shown on brochure map (p.16)' } ] },
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
      copy: 'One of India\'s largest and most awarded architectural design consultancies, delivering projects across 100 cities and 5 countries for private developers, corporations, government entities and institutions, across residential, commercial, hospitality, infrastructure and redevelopment work.',
      source: 'brochure',
      ref: 'p.60 (source: hafeezcontractor.com)',
      verified: true,
    },
    {
      name: 'Oracles Landscape Architecture',
      role: 'Landscape Architect',
      copy: 'A premier Delhi-based architecture and landscape design studio renowned for distinctive, context-driven environments that integrate nature, culture and functionality, across residential, hospitality, commercial, cultural, transportation and public-realm projects.',
      source: 'brochure',
      ref: 'p.60 (source: oracleslandscape.in)',
      verified: true,
    },
  ],

  legacy: {
    heading: 'A Legacy of Trust.',
    paragraphs: [
      'Since its inception in the midst of India\'s Swadeshi movement in 1897, the Godrej Group has stood as a timeless symbol of innovation and integrity. For more than 128 years it has extended its reach globally, enhancing the lives of over 1.1 billion individuals through ventures spanning luxury real estate, consumer goods and multiple other sectors.',
      'With 116 projects, ongoing and upcoming, Godrej Properties\' portfolio reflects a steadfast commitment to building an enduring legacy, driven by a dedication to quality and a clear vision of a sustainable future.',
    ],
    credentials: ['Active participant of UNGC since FY23', 'Near-term emission targets approved by the SBTi', 'Recognised in the 2025 Dow Jones Best-in-Class Indices', 'Listed in the FTSE India 30/18 Capped index', '5 Star rating in 2024 GRESB assessment', 'ISO 14001:2015 certified across all operations'],
    source: 'brochure' as Source, ref: 'p.2, p.4 (source: godrejproperties.com)', verified: true,
  },

  walkthrough: {
    /** Set to the official Godrej Sora walkthrough (YouTube/Vimeo ID or self-hosted URL) once embed permission is confirmed. */
    provider: 'youtube' as 'youtube' | 'vimeo' | 'file' | 'none',
    id: '',
    poster: 'hero/tower-elevation',
    verified: false,
  },

  legal: {
    plot: 'Plot no. GH-21, admeasuring 14,569.20 sq. m., Village Wazirabad, Tehsil Wazirabad, Sector 53, Urban Area Gurugram II, Haryana',
    landTitle: 'Acquired from Haryana Shehri Vikas Pradhikaran vide conveyance deed dated June 26, 2025 (document no. 6686, Sub-Registrar, Wazirabad)',
    japanNote: 'The use of the term Japan is a mere representation of the essence of a Japanese lifestyle.',
    source: 'brochure' as Source, ref: 'p.64', verified: true,
  },

  disclaimers: {
    imagery:
      'Tower, façade, clubhouse, sunken-seating and aerial visuals are artist\'s impressions, not actual site images. Interiors, amenities, landscape and lifestyle photographs are stock images for representation purpose only; the lift-lobby visual is an AI-generated image. The use of the term Japan is a mere representation of the essence of a Japanese lifestyle. Elevations, finishes, landscaping and amenities are indicative and subject to change as per approvals.',
    pricing:
      '*Prices are indicative, subject to change without notice and exclusive of statutory charges, taxes and other applicable costs. Please request the current cost sheet.',
    general:
      'This creative is purely conceptual, illustrative and used for indicative purposes only and not a legal offering. The official website of the Developer is www.godrejproperties.com; please do not rely on any other website. This is not an offer or invitation to sell. All information, specifications, plans and renders are subject to change as per the approvals of the competent authorities and the terms of the Agreement for Sale. Nothing here constitutes a legal offering or a promise of any kind.',
  },
};

export type ProjectContent = typeof project;
