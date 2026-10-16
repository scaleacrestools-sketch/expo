/**
 * Real media assets available to the site.
 *
 * SHOWREEL CLIPS — commissioned by ScaleAcres in Higgsfield (Kling v3.0 pro, 16 Oct 2026).
 * They are streamed from Higgsfield's CDN for the staging preview. Before production,
 * download them, run `npm run showreel -- ./clips` and switch `src` to the local
 * /videos/... exports (smaller files, no third-party dependency).
 */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3CQanTnpSTSldAcnyg2IWvXN786";

export type Clip = {
  id: string;
  title: string;
  /** What the clip shows, used as an accessible description. */
  description: string;
  landscape: string;
  portrait: string;
  jobs: { landscape: string; portrait: string };
};

export const showreel: Clip[] = [
  {
    id: "architecture",
    title: "Blue-hour tower",
    description: "Aerial approach to a contemporary residential tower at blue hour",
    landscape: `${CDN}/hf_20261016_064953_99e030e4-e115-40c0-b671-f1ed843d512b.mp4`,
    portrait: `${CDN}/hf_20261016_064953_336116a6-ddde-4b73-92c9-0b3782c1c96e.mp4`,
    jobs: { landscape: "99e030e4-e115-40c0-b671-f1ed843d512b", portrait: "336116a6-ddde-4b73-92c9-0b3782c1c96e" },
  },
  {
    id: "brand",
    title: "Identity systems",
    description: "Brand identity mockups on a dark studio table",
    landscape: `${CDN}/hf_20261016_064953_1be4e27b-378b-4c8a-a0b3-2c822a90772d.mp4`,
    portrait: `${CDN}/hf_20261016_064953_7c7bb683-e39f-4146-b1be-19c3814c9e1c.mp4`,
    jobs: { landscape: "1be4e27b-378b-4c8a-a0b3-2c822a90772d", portrait: "7c7bb683-e39f-4146-b1be-19c3814c9e1c" },
  },
  {
    id: "web",
    title: "Digital experiences",
    description: "Designer building a real estate website on a studio monitor",
    landscape: `${CDN}/hf_20261016_064953_403ad6ab-0286-4361-a2eb-8ed512fd75e9.mp4`,
    portrait: `${CDN}/hf_20261016_065002_54f1f3cc-ca9d-4918-9866-4ee47d53a22e.mp4`,
    jobs: { landscape: "403ad6ab-0286-4361-a2eb-8ed512fd75e9", portrait: "54f1f3cc-ca9d-4918-9866-4ee47d53a22e" },
  },
  {
    id: "performance",
    title: "Performance in motion",
    description: "Abstract campaign data visualisation reviewed in a dark meeting room",
    landscape: `${CDN}/hf_20261016_064953_64204512-6033-485c-a273-22d8f8e32df8.mp4`,
    portrait: `${CDN}/hf_20261016_064953_82ccf80e-99a1-4357-adb2-683d728a17ed.mp4`,
    jobs: { landscape: "64204512-6033-485c-a273-22d8f8e32df8", portrait: "82ccf80e-99a1-4357-adb2-683d728a17ed" },
  },
  {
    id: "production",
    title: "Studio production",
    description: "Cinema camera and editing suite at night",
    landscape: `${CDN}/hf_20261016_065002_153e12d6-e10d-4d75-86bc-cf17f283f9df.mp4`,
    portrait: `${CDN}/hf_20261016_064953_7cb91829-31d3-4b5b-bbb3-9cd3d8ad114e.mp4`,
    jobs: { landscape: "153e12d6-e10d-4d75-86bc-cf17f283f9df", portrait: "7cb91829-31d3-4b5b-bbb3-9cd3d8ad114e" },
  },
  {
    id: "finale",
    title: "Light sweep",
    description: "Electric-blue light sweeping across black architectural fins",
    landscape: `${CDN}/hf_20261016_064953_bed6c31b-1dc1-4c0b-be07-567c4eb9b64a.mp4`,
    portrait: `${CDN}/hf_20261016_064953_f6a39dbf-2916-4af1-8ccf-2bab7d33c713.mp4`,
    jobs: { landscape: "bed6c31b-1dc1-4c0b-be07-567c4eb9b64a", portrait: "f6a39dbf-2916-4af1-8ccf-2bab7d33c713" },
  },
];

export const clip = (id: string) => showreel.find((c) => c.id === id)!;

/** Which clip illustrates each service row (only where a genuinely related clip exists). */
export const serviceClip: Record<string, string | undefined> = {
  "website-design-development": "web",
  "performance-marketing": "performance",
  "branding-creative-design": "brand",
  "video-creative-production": "production",
  "social-media-marketing": undefined,
  "search-engine-optimization": undefined,
  "ecommerce-solutions": undefined,
  "custom-applications-software": undefined,
};
