/**
 * Maps manifest asset ids to brochure pages. Used by scripts/extract-brochure.mjs.
 * `page` is 1-based. `crop` (optional) is [x%, y%, w%, h%] of the rendered page to trim brochure headings/margins.
 * Adjust crops after a first extraction run by viewing _masters/<id>.jpg.
 */
export const brochureMap: Array<{ id: string; page: number; crop?: [number, number, number, number]; note?: string }> = [
  { id: 'brand/godrej-sora-logo', page: 10, note: 'Prefer the vector logo from assets-source/logo; page render is a fallback only.' },
  { id: 'brand/eight-rays-sun', page: 11 },
  { id: 'brand/red-sun-blossom', page: 10 },
  { id: 'landscape/shibui-01', page: 18 },
  { id: 'landscape/shibui-02', page: 20 },
  { id: 'residences/interior-natural-light', page: 21 },
  { id: 'architecture/torii-facade', page: 23 },
  { id: 'landscape/cherry-blossom-court', page: 24 },
  { id: 'landscape/sunken-seating', page: 25 },
  { id: 'landscape/japanese-garden', page: 28 },
  { id: 'clubhouse/shiki-elevation', page: 33 },
  { id: 'clubhouse/onsen-pool', page: 35 },
  { id: 'clubhouse/rooftop-pool', page: 36 },
  { id: 'residences/living-dining', page: 44 },
  { id: 'balconies/fifty-foot-balcony', page: 45 },
  { id: 'residences/bedroom', page: 46 },
  { id: 'residences/kitchen', page: 48 },
  { id: 'residences/bathroom', page: 49 },
  { id: 'architecture/facade-closeup', page: 54 },
  { id: 'hero/tower-elevation', page: 55 },
  { id: 'architecture/exterior-elevation-2', page: 56 },
  { id: 'architecture/exterior-elevation-3', page: 57 },
  { id: 'hero/aerial-render', page: 63 },
];
