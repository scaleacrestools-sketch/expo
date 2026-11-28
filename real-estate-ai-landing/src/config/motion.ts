/**
 * Motion design tokens (mirrors the CSS variables in globals.css).
 * Hover/press 120–200 ms · card 200–300 ms · entrance 350–550 ms · stagger 40–80 ms · demo loops 6–12 s.
 */
export const ease = [0.22, 1, 0.36, 1] as const;
export const motionTokens = {
  fast: 0.16,
  card: 0.26,
  enter: 0.48,
  stagger: 0.06,
  y: 16,
};
/** Product demo loop timings (ms per step). Loops land between 6 and 12 s. */
export const loops = {
  hero: 1150,          // 9 steps ≈ 10.4 s
  howItWorksStep: 900, // per micro-step inside a workflow visual
  howItWorksAdvance: 8000,
  omnichannel: 1500,   // 6 stages ≈ 9 s
  qualification: 1100, // 10 questions ≈ 11 s + hold
  feature: 1400,
};
