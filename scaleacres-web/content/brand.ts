/**
 * Official ScaleAcres brand assets — Royal Gradient identity.
 * Source of truth: ScaleAcres Brand Guidelines v1.0 (October 2026), chapters 02–07.
 * Files come from the ScaleAcres Logo Kit; never redraw, recolour or rearrange them.
 */
export const brand = {
  logo: {
    /** Primary: black wordmark + royal gradient symbol and strapline. Light grounds. */
    primary: "/brand/scaleacres-logo-primary.svg",
    primaryNoStrapline: "/brand/scaleacres-logo-primary-no-strapline.svg",
    /** Reversed: white wordmark, royal → sky symbol, sky strapline. Black and navy grounds. */
    reversed: "/brand/scaleacres-logo-reversed.svg",
    reversedNoStrapline: "/brand/scaleacres-logo-reversed-no-strapline.svg",
    /** White: on royal, the gradient, photography and video. */
    white: "/brand/scaleacres-logo-white.svg",
    /** Raster primary for structured data and social cards. */
    primaryPng: "/brand/scaleacres-logo-primary.png",
    /** Intrinsic proportions of the full lockup (viewBox 1444 × 450). */
    width: 1444,
    height: 450,
    noStraplineWidth: 1428,
  },
  strapline: "Scaling with System and Automation",
  colors: {
    royal: "#1D4ED8",
    royalDeep: "#142E8C",
    sky: "#38BDF8",
    black: "#0B0D0D",
    navy: "#0B1640",
    white: "#FFFFFF",
  },
  gradient: "linear-gradient(60deg, #142E8C 0%, #1D4ED8 50%, #38BDF8 100%)",
} as const;
