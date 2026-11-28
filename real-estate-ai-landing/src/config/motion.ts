/**
 * Motion design tokens (mirrors the CSS variables in globals.css).
 * V3 timing guide: hover 150–250 ms · card 200–350 ms · entrance 400–650 ms · product states 1.5–3 s ·
 * workflow stages 2–4 s · integration cycle 6–10 s · hero cycle 12–18 s · mobile demos 8–12 s.
 */
export const ease = [0.22, 1, 0.36, 1] as const;
export const motionTokens = {
  fast: 0.2,
  card: 0.3,
  enter: 0.56,
  stagger: 0.06,
  y: 16,
};
/** Product demo loop timings (ms per step). */
export const loops = {
  hero: 1900,           // 9 readable stages ≈ 17.1 s cycle (V4 guide: 15–20 s)
  howItWorksStep: 1300, // product state inside a workflow visual
  howItWorksAdvance: 10000, // each workflow stage gets ~10 s before the tour advances
  omnichannel: 2200,    // 6 workflow stages ≈ 13 s
  qualification: 1500,  // 10 questions ≈ 15 s + hold
  feature: 2000,
  integration: 1500,    // 6 pairs ≈ 9 s cycle
};
