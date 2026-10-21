/**
 * Asset manifest — every image the landing page expects, where it comes from,
 * what it is (photograph / artist's impression / stock / AI) and whether it is
 * approved for republication.
 *
 * Files live under /public/images/godrej-sora/<id>.(avif|webp|jpg|png|svg).
 * Run `npm run assets:check` to see which are still missing.
 * Until a file is supplied, the page renders a branded placeholder, never a
 * substitute image of an unrelated project.
 */
export type AssetKind = 'artist-impression' | 'photograph' | 'stock' | 'ai-generated' | 'brand' | 'plan' | 'map';
export type Approval = 'approved' | 'pending' | 'not-supplied';

export interface AssetMeta {
  id: string;
  title: string;
  kind: AssetKind;
  /** brochure page or source URL */
  source: string;
  approval: Approval;
  section: string;
  /** optional focal point for object-position, e.g. '50% 30%' */
  focal?: string;
  alt: string;
}

const A = (a: AssetMeta) => a;

export const assets: Record<string, AssetMeta> = Object.fromEntries(
  [
    // brand
    A({ id: 'brand/godrej-sora-logo', title: 'Godrej Sora logo (original artwork)', kind: 'brand', source: 'Brochure p.10 / p.64', approval: 'pending', section: 'Nav, Footer', alt: 'Godrej Sora' }),
    A({ id: 'brand/eight-rays-sun', title: 'Eight Rays of Sora origami sun', kind: 'stock', source: 'Brochure p.11–12 (origami sun, stock image)', approval: 'pending', section: '03 Eight Rays', alt: 'The Eight Rays of Sora sun emblem' }),
    A({ id: 'brand/red-sun-blossom', title: 'Red sun and cherry blossom illustration', kind: 'brand', source: 'Brochure p.8', approval: 'pending', section: '02 Meaning of Sora', alt: 'Red sun with cherry blossom illustration' }),
    A({ id: 'brand/godrej-properties-logo', title: 'Godrej Properties logo', kind: 'brand', source: 'Brochure p.1 / p.64', approval: 'pending', section: 'Footer, 17 Legacy', alt: 'Godrej Properties' }),
    // hero
    A({ id: 'hero/tower-elevation', title: 'Full project tower elevation', kind: 'artist-impression', source: 'Brochure p.55', approval: 'pending', section: '01 Hero, 15 Walkthrough poster', focal: '50% 40%', alt: 'Godrej Sora towers rising against the sky, representation image' }),
    A({ id: 'hero/aerial-render', title: 'Architectural aerial render', kind: 'artist-impression', source: 'Brochure p.63', approval: 'pending', section: '10 Exclusivity, 19 Final', alt: 'Aerial view of Godrej Sora, representation image' }),
    // architecture
    A({ id: 'architecture/torii-facade', title: 'Torii-inspired building façade', kind: 'artist-impression', source: 'Brochure p.23', approval: 'pending', section: '04 Architecture', alt: 'Torii gate-inspired façade of Godrej Sora' }),
    A({ id: 'architecture/facade-closeup', title: 'Building façade close-up', kind: 'artist-impression', source: 'Brochure p.54', approval: 'pending', section: '04 Architecture', alt: 'Façade detail, representation image' }),
    A({ id: 'architecture/exterior-elevation-2', title: 'Exterior elevation', kind: 'artist-impression', source: 'Brochure p.56', approval: 'pending', section: '04 Architecture, 14 Gallery', alt: 'Exterior elevation, representation image' }),
    A({ id: 'architecture/exterior-elevation-3', title: 'Exterior elevation at dusk', kind: 'artist-impression', source: 'Brochure p.57', approval: 'pending', section: '14 Gallery', alt: 'Exterior elevation at dusk, representation image' }),
    A({ id: 'architecture/triple-height-lobby', title: 'Triple-height lobby', kind: 'stock', source: 'Brochure p.29', approval: 'pending', section: '10 Exclusivity, 14 Gallery', alt: 'Triple-height entrance lobby, representation image' }),
    // residences
    A({ id: 'residences/living-dining', title: 'Living and dining space', kind: 'stock', source: 'Brochure p.49', approval: 'pending', section: '05 Residences', alt: 'Living and dining area of a Sora residence, representation image' }),
    A({ id: 'residences/interior-natural-light', title: 'Premium interiors / natural living', kind: 'stock', source: 'Brochure p.47', approval: 'pending', section: '05 Residences, 07 Shibui', alt: 'Interior bathed in natural light, representation image' }),
    A({ id: 'residences/bedroom', title: 'Master bedroom', kind: 'stock', source: 'Brochure p.44', approval: 'pending', section: '05 Residences, 14 Gallery', alt: 'Master bedroom, representation image' }),
    A({ id: 'residences/kitchen', title: 'Kitchen', kind: 'stock', source: 'Brochure p.48', approval: 'pending', section: '14 Gallery', alt: 'Kitchen, representation image' }),
    A({ id: 'residences/bathroom', title: 'Bathroom', kind: 'stock', source: 'Brochure p.50', approval: 'pending', section: '14 Gallery', alt: 'Bathroom, representation image' }),
    // balconies
    A({ id: 'balconies/fifty-foot-balcony', title: 'Approximately 50-ft balcony concept', kind: 'stock', source: 'Brochure p.45', approval: 'pending', section: '06 Balcony', focal: '50% 50%', alt: 'The approximately 50-foot balcony, representation image' }),
    A({ id: 'balconies/balcony-view', title: 'Balcony view', kind: 'stock', source: 'Brochure p.53', approval: 'pending', section: '14 Gallery', alt: 'View from a Sora balcony, representation image' }),
    // clubhouse
    A({ id: 'clubhouse/shiki-elevation', title: 'Shiki Clubhouse elevation', kind: 'artist-impression', source: 'Brochure p.33', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Shiki Clubhouse with Japanese tiered roof, representation image' }),
    A({ id: 'clubhouse/onsen-pool', title: 'Indoor Onsen pool', kind: 'stock', source: 'Brochure p.35', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Indoor onsen-inspired pool, representation image' }),
    A({ id: 'clubhouse/rooftop-pool', title: 'Rooftop swimming pool', kind: 'stock', source: 'Brochure p.36', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Rooftop swimming pool, representation image' }),
    // amenities
    A({ id: 'amenities/gymnasium', title: 'Gymnasium', kind: 'stock', source: 'Brochure p.37', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Gymnasium, representation image' }),
    A({ id: 'amenities/spa', title: 'Spa', kind: 'stock', source: 'Brochure p.38', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Spa, representation image' }),
    A({ id: 'amenities/sculpted-staircase', title: 'Sculpted staircase', kind: 'stock', source: 'Brochure p.39', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Sculpted staircase, representation image' }),
    A({ id: 'amenities/squash-court', title: 'Squash court', kind: 'stock', source: 'Brochure p.40', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Squash court, representation image' }),
    A({ id: 'amenities/padel-court', title: 'Padel court', kind: 'stock', source: 'Brochure p.41', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Padel court, representation image' }),
    A({ id: 'amenities/multipurpose-hall', title: 'Badminton / multipurpose hall', kind: 'stock', source: 'Brochure p.42', approval: 'pending', section: '09 Shiki Clubhouse', alt: 'Multipurpose hall, representation image' }),
    // landscape
    A({ id: 'landscape/japanese-garden', title: 'Japanese-inspired landscaping', kind: 'stock', source: 'Brochure p.28', approval: 'pending', section: '08 Landscaping', alt: 'Japanese-inspired landscaped grounds, representation image' }),
    A({ id: 'landscape/cherry-blossom-court', title: 'Cherry blossom concept', kind: 'stock', source: 'Brochure p.24', approval: 'pending', section: '08 Landscaping, 02 Meaning', alt: 'Cherry-blossom-inspired court, representation image' }),
    A({ id: 'landscape/sunken-seating', title: 'Sunken seating', kind: 'artist-impression', source: 'Brochure p.25', approval: 'pending', section: '08 Landscaping', alt: 'Sunken seating court, representation image' }),
    A({ id: 'landscape/shibui-01', title: 'Shibui philosophy visual', kind: 'stock', source: 'Brochure p.21', approval: 'pending', section: '07 Shibui', alt: 'Shibui: natural materials and restraint, representation image' }),
    A({ id: 'landscape/shibui-02', title: 'Shibui philosophy visual II', kind: 'stock', source: 'Brochure p.22', approval: 'pending', section: '07 Shibui', alt: 'Shibui: balance and light, representation image' }),
    A({ id: 'residences/lift-lobby', title: 'Private lift lobby', kind: 'ai-generated', source: 'Brochure p.46 / p.58 (*AI generated image)', approval: 'pending', section: '05 Residences', alt: 'Private lift lobby, AI-generated representation' }),
    A({ id: 'residences/dual-views', title: 'Dual sunrise and sunset views', kind: 'stock', source: 'Brochure p.30', approval: 'pending', section: '05 Residences, 14 Gallery', alt: 'Sunrise over a Japanese garden, stock image' }),
    A({ id: 'brand/red-sun-rays-infographic', title: 'Red sun rays infographic', kind: 'brand', source: 'Brochure p.61', approval: 'pending', section: '19 Final', alt: 'Godrej Sora red sun with feature rays' }),
    A({ id: 'brand/shibui-brush', title: 'Shibui ink brush', kind: 'stock', source: 'Brochure p.18', approval: 'pending', section: '07 Shibui', alt: 'Ink brush stroke, stock image' }),
    A({ id: 'brand/cover-sun-koi', title: 'Red sun with koi (cover artwork)', kind: 'brand', source: 'Brochure p.1', approval: 'pending', section: '02 Meaning', alt: 'Red sun with koi illustration from the Godrej Sora brochure cover' }),
    // location
    A({ id: 'location/map', title: 'Project location map', kind: 'map', source: 'Brochure p.16', approval: 'pending', section: '11 Location', alt: 'Map of Godrej Sora in Sector 53, Gurugram' }),
    // plans
    A({ id: 'floor-plans/master-plan', title: 'Master plan', kind: 'plan', source: 'Official website / brochure', approval: 'pending', section: '13 Master Plan', alt: 'Godrej Sora master plan' }),
    A({ id: 'floor-plans/3bhk-typical', title: '3 BHK typical floor plan', kind: 'plan', source: 'Official website', approval: 'pending', section: '12 Collection, 13 Plans', alt: '3 BHK floor plan' }),
    A({ id: 'floor-plans/4bhk-typical', title: '4 BHK typical floor plan', kind: 'plan', source: 'Official website', approval: 'pending', section: '12 Collection, 13 Plans', alt: '4 BHK floor plan' }),
    // lifestyle (stock — must be disclosed)
    A({ id: 'gallery/lifestyle-01', title: 'Lifestyle image I', kind: 'stock', source: 'Brochure p.27', approval: 'pending', section: '14 Gallery', alt: 'Lifestyle image, illustrative stock photograph' }),
    A({ id: 'gallery/lifestyle-02', title: 'Lifestyle image II', kind: 'stock', source: 'Brochure p.34', approval: 'pending', section: '14 Gallery', alt: 'Lifestyle image, illustrative stock photograph' }),
  ].map((a) => [a.id, a]),
);

export const kindLabel: Record<AssetKind, string> = {
  'artist-impression': "Artist's impression",
  photograph: 'Photograph',
  stock: 'Illustrative stock photograph',
  'ai-generated': 'AI-generated representation',
  brand: 'Brand artwork',
  plan: 'Indicative plan',
  map: 'Indicative map, not to scale',
};
