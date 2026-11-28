import timings from './scene-timings.json';
/** Scene list and timings come from scripts/render-video/narration.mjs so video, captions and voice-over stay in sync. */
export const walkthrough = timings as { total: number; scenes: { title: string; caption: string; start: number; len: number }[] };
export const HERO_STEP = 1.25;   // seconds per hero phase
export const HERO_LEN = 9 * HERO_STEP + 0.5;
