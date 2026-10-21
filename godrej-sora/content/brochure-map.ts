/**
 * Maps manifest asset ids to brochure pages. Used by scripts/extract-brochure.mjs.
 * `page` is 1-based. `crop` is [x%, y%, w%, h%] of the rendered page (720×1440 pt portrait).
 * Feature pages carry the image in the top 70% with the icon caption below; crops trim the caption.
 */
export const brochureMap: Array<{ id: string; page: number; crop?: [number, number, number, number]; note?: string }> = [
  // brand
  { id: 'brand/cover-sun-koi', page: 1, crop: [8, 3.6, 84, 30] },
  { id: 'brand/red-sun-blossom', page: 8, crop: [0, 3.6, 100, 33] },
  { id: 'brand/godrej-sora-logo', page: 10, crop: [26, 36, 48, 33.5], note: 'Prefer the vector logo from assets-source/logo when supplied.' },
  { id: 'brand/eight-rays-sun', page: 12, crop: [8, 62, 92, 38] },
  { id: 'brand/red-sun-rays-infographic', page: 61, crop: [0, 4, 100, 92] },
  { id: 'brand/shibui-brush', page: 18, crop: [0, 51, 100, 49] },
  // architecture (artist's impressions)
  { id: 'architecture/torii-facade', page: 23, crop: [0, 3.6, 100, 66.4] },
  { id: 'architecture/facade-closeup', page: 54, crop: [0, 3.6, 100, 66.4] },
  { id: 'hero/tower-elevation', page: 55, crop: [0, 3.6, 100, 66.4] },
  { id: 'architecture/exterior-elevation-2', page: 56, crop: [0, 3.6, 100, 66.4] },
  { id: 'architecture/exterior-elevation-3', page: 57, crop: [0, 3.6, 100, 66.4] },
  { id: 'hero/aerial-render', page: 63, crop: [0, 3.6, 100, 96.4] },
  { id: 'clubhouse/shiki-elevation', page: 33, crop: [0, 3.6, 100, 66.4] },
  { id: 'landscape/sunken-seating', page: 25, crop: [0, 3.6, 100, 66.4] },
  // residences (stock)
  { id: 'residences/bedroom', page: 44, crop: [0, 47, 100, 53] },
  { id: 'balconies/fifty-foot-balcony', page: 45, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/lift-lobby', page: 46, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/interior-natural-light', page: 47, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/kitchen', page: 48, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/living-dining', page: 49, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/bathroom', page: 50, crop: [0, 3.6, 100, 66.4] },
  { id: 'residences/dual-views', page: 30, crop: [0, 3.6, 100, 66.4] },
  { id: 'architecture/triple-height-lobby', page: 29, crop: [0, 3.6, 100, 66.4] },
  { id: 'balconies/balcony-view', page: 53, crop: [0, 46, 100, 54] },
  // shibui / landscape (stock)
  { id: 'landscape/shibui-01', page: 21, crop: [0, 3.6, 100, 66.4] },
  { id: 'landscape/shibui-02', page: 22, crop: [0, 3.6, 100, 66.4] },
  { id: 'landscape/cherry-blossom-court', page: 24, crop: [0, 3.6, 100, 66.4] },
  { id: 'landscape/japanese-garden', page: 28, crop: [0, 3.6, 100, 66.4] },
  { id: 'gallery/lifestyle-01', page: 27, crop: [0, 44, 100, 56] },
  { id: 'gallery/lifestyle-02', page: 34, crop: [0, 3.6, 100, 66.4] },
  // clubhouse / amenities (stock)
  { id: 'clubhouse/onsen-pool', page: 35, crop: [0, 3.6, 100, 66.4] },
  { id: 'clubhouse/rooftop-pool', page: 36, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/gymnasium', page: 37, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/spa', page: 38, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/sculpted-staircase', page: 39, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/squash-court', page: 40, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/padel-court', page: 41, crop: [0, 3.6, 100, 66.4] },
  { id: 'amenities/multipurpose-hall', page: 42, crop: [0, 3.6, 100, 66.4] },
  // location
  { id: 'location/map', page: 16, crop: [0, 3.6, 100, 94] },
];
