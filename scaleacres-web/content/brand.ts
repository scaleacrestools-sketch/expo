/**
 * Official brand assets.
 *
 * The logo artwork is the source of truth. Drop the original files into /public/brand/
 * with these exact names, then set `logoFilesPresent: true`. Until then the header shows
 * a clearly flagged text fallback, never a recreated symbol.
 *
 * Colours sampled from the supplied logo file (16 Oct 2026): brand black #0B0D0D, brand blue #1CA6DC.
 * The white variant only recolours the black artwork to white; shapes, proportions and blue are untouched.
 */
export const brand = {
  logoFilesPresent: true,
  logo: {
    /** Full-colour lockup for white / off-white grounds. */
    primary: "/brand/scaleacres-logo.webp",
    /** Reversed lockup (white wordmark, blue symbol) for black grounds. */
    reversed: "/brand/scaleacres-logo-white.webp",
    /** Intrinsic size of the supplied files, used to keep proportions exact. */
    width: 884,
    height: 277,
  },
  descriptor: "Scaling with System and Automation",
  colors: {
    black: "#0B0D0D",
    blue: "#1CA6DC",
  },
} as const;
