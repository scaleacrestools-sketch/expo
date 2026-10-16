/**
 * Official brand assets.
 *
 * The logo artwork is the source of truth. Drop the original files into /public/brand/
 * with these exact names, then set `logoFilesPresent: true`. Until then the header shows
 * a clearly flagged text fallback, never a recreated symbol.
 *
 * Colour values come from the ScaleAcres Brand Kit v1.0, which sampled them from the logo
 * pixels: Ink #0B0D0D (wordmark) and Sky #1CA6DC (symbol). Re-sample from the master file
 * when it is supplied and update app/globals.css if they differ.
 */
export const brand = {
  logoFilesPresent: false,
  logo: {
    /** Full-colour lockup for white / off-white grounds. */
    primary: "/brand/scaleacres-logo.png",
    /** Reversed lockup (white wordmark, blue symbol) for black grounds. */
    reversed: "/brand/scaleacres-logo-white.png",
    /** Intrinsic size of the supplied files, used to keep proportions exact. */
    width: 1024,
    height: 333,
  },
  descriptor: "Scaling with System and Automation",
  colors: {
    black: "#0B0D0D",
    blue: "#1CA6DC",
  },
} as const;
