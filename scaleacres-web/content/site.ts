/**
 * Verified company facts. Sources: ScaleAcres Brand Kit v1.0 (Sep 2026, compiled from
 * scaleacres.com) and the live site's contact / about pages.
 * Anything not verified is intentionally absent — do not add unsupported claims here.
 */
export const site = {
  name: "ScaleAcres",
  legalName: "ScaleAcres PromoTech",
  tagline: "Built to Stand Out. Designed to Scale.",
  category: "Independent Creative, Digital & Growth Agency",
  description:
    "ScaleAcres is an independent creative, digital and growth agency where powerful ideas meet thoughtful design, innovative technology and performance-driven marketing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://scaleacres.com",
  email: "scaleacres@gmail.com",
  phones: [
    { label: "Sales", number: "+91 70171 69215", href: "tel:+917017169215" },
    { label: "Sales", number: "+91 92660 23436", href: "tel:+919266023436" },
    { label: "Careers", number: "+91 97736 63033", href: "tel:+919773663033" },
  ],
  address: {
    lines: [
      "Plot 5, 2nd Floor, Kehar Singh Estate",
      "Westend Marg, Lane 2, Saidulajab",
      "New Delhi 110030, India",
    ],
    locality: "New Delhi",
    region: "Delhi",
    postalCode: "110030",
    country: "IN",
  },
  offices: ["Delhi", "Agra", "Bangalore"],
  markets: ["India", "UAE", "Saudi Arabia"],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/scaleacres/", handle: "@scaleacres" },
    { label: "Facebook", href: "https://www.facebook.com/scaleacrespromotech", handle: "/scaleacrespromotech" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/scaleacres", handle: "/company/scaleacres" },
  ],
} as const;
