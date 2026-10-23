import { clip } from "@/content/media";
import { services, type Service } from "@/content/services";
import { studioShorts, type StudioShortTab } from "@/content/studio-shorts";

/**
 * Homepage (v2, "editorial cinematic" direction) — content and media.
 *
 * Media rules:
 * - Client work comes only from scaleacres.com (wp-content), named after what the image shows.
 * - Higgsfield clips are ScaleAcres' own concept films. They are always captioned as such and
 *   never presented as delivered client campaigns.
 * - Poster frames in /images/home were taken from those clips with ffmpeg (1.0 s).
 */
/** Same origin rule as lib/legacy `media()` (that module is server-only). */
const MEDIA_ORIGIN = (process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? "https://scaleacres.com").replace(/\/$/, "");
const wp = (path: string) => `${MEDIA_ORIGIN}/wp-content/uploads/${path}`;

export const posters = {
  architecture: "/images/home/poster-architecture.jpg",
  architecturePortrait: "/images/home/poster-architecture-portrait.jpg",
  brand: "/images/home/poster-brand.jpg",
  web: "/images/home/poster-web.jpg",
  performance: "/images/home/poster-performance.jpg",
  production: "/images/home/poster-production.jpg",
  finale: "/images/home/poster-finale.jpg",
} as const;

/* ---------------------------------------------------------------- Hero */

export const hero = {
  lines: [["Built", "to"], ["Stand", "Out."], ["Designed"], ["to", "Scale."]] as string[][],
  accentWord: "Scale.",
  support: "A real estate marketing and creative growth agency combining strategy, design, technology and performance.",
  /** Clips that play in the hero, in order. */
  reel: ["architecture", "brand", "web", "production", "finale"].map((id) => {
    const c = clip(id);
    return { id, title: c.title, landscape: c.landscape, portrait: c.portrait };
  }),
};

/* ---------------------------------------------------------------- Manifesto collage */

export type CollageItem = { src: string; alt: string; w: number; h: number };

/** Genuine ScaleAcres work from scaleacres.com, drifting around the manifesto statement. */
export const collage: CollageItem[] = [
  { src: wp("2026/08/slide-1.webp"), alt: "Ellington 86 brochure for SID Realtech", w: 924, h: 522 },
  { src: wp("2026/08/sidrealtech.jpeg"), alt: "Ellington 86 launch creative for SID Realtech", w: 1350, h: 1688 },
  { src: wp("2026/08/slide-3.webp"), alt: "Ellington 86 outdoor hoarding", w: 924, h: 522 },
  { src: wp("2026/08/jbbrgroup.jpeg"), alt: "JBBR Group social creative", w: 1350, h: 1688 },
  { src: wp("2026/08/slide-14.webp"), alt: "Nirvana County brochure", w: 924, h: 522 },
  { src: wp("2026/08/intech_developers.jpeg"), alt: "Intech Developers social creative", w: 1350, h: 1688 },
];

/* ---------------------------------------------------------------- Services */

export type ServiceMedia =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "top"; caption: string }
  | { kind: "video"; src: string; poster: string; caption: string }
  | { kind: "posters"; items: { src: string; alt: string }[]; caption: string }
  | { kind: "screens"; items: { src: string; alt: string }[]; caption: string };

const serviceMedia: Record<string, ServiceMedia> = {
  "website-design-development": { kind: "image", src: wp("2026/08/slide-8.webp"), alt: "Ellington 86 website designed by ScaleAcres", caption: "Ellington 86 · website for SID Realtech" },
  "search-engine-optimization": { kind: "image", src: wp("2026/06/seo-result.webp"), alt: "Search results and rankings from ScaleAcres SEO campaigns", caption: "Search rankings from live ScaleAcres campaigns" },
  "performance-marketing": { kind: "video", src: clip("performance").landscape, poster: posters.performance, caption: "ScaleAcres concept film · AI-generated" },
  "branding-creative-design": { kind: "image", src: wp("2026/08/slide-2.webp"), alt: "SID Realtech brand style guideline", caption: "SID Realtech · brand identity system" },
  "social-media-marketing": {
    kind: "posters",
    caption: "Launch creatives · JBBR Group, SID Realtech, TRG",
    items: [
      { src: wp("2026/08/jbbrgroup.jpeg"), alt: "JBBR Group social creative" },
      { src: wp("2026/08/sidrealtech.jpeg"), alt: "SID Realtech Ellington 86 creative" },
      { src: wp("2026/08/jaaspalsduttaa.jpeg"), alt: "TRG The Mall social creative" },
    ],
  },
  "video-creative-production": { kind: "video", src: clip("production").landscape, poster: posters.production, caption: "ScaleAcres concept film · AI-generated" },
  "ecommerce-solutions": {
    kind: "screens",
    caption: "Jina Cosmetics · MW&B store",
    items: [
      { src: wp("2025/04/jina-cosmetics-scaled.webp"), alt: "Jina Cosmetics ecommerce website" },
      { src: wp("2025/04/screencapture-mwbstore-2025-04-10-13_14_08-scaled.webp"), alt: "MW&B online store" },
    ],
  },
  "custom-applications-software": { kind: "video", src: clip("web").landscape, poster: posters.web, caption: "ScaleAcres concept film · AI-generated" },
};

export const homeServices: (Service & { media: ServiceMedia })[] = services.map((s) => ({ ...s, media: serviceMedia[s.slug] }));

/* ---------------------------------------------------------------- Market leaders (branding) */

export type BrandWork = { src: string; title: string; client: string; w: number; h: number };

export const brandWork: BrandWork[] = [
  { src: wp("2026/08/slide-1.webp"), title: "Ellington 86 brochure", client: "SID Realtech", w: 924, h: 522 },
  { src: wp("2026/08/slide-2.webp"), title: "Brand style guideline", client: "SID Realtech", w: 924, h: 522 },
  { src: wp("2026/08/sidrealtech.jpeg"), title: "Coming soon launch creative", client: "SID Realtech", w: 1350, h: 1688 },
  { src: wp("2026/08/slide-3.webp"), title: "Ellington 86 hoarding", client: "SID Realtech", w: 924, h: 522 },
  { src: wp("2026/08/slide-4.webp"), title: "Event & site branding", client: "TRG", w: 924, h: 522 },
  { src: wp("2026/08/jbbrgroup.jpeg"), title: "Luxury lifestyle creative", client: "JBBR Group", w: 1350, h: 1688 },
  { src: wp("2026/08/slide-14.webp"), title: "Township brochure", client: "Nirvana County", w: 924, h: 522 },
  { src: wp("2026/08/slide-15.webp"), title: "Brochure spreads", client: "Ellington 86", w: 924, h: 522 },
];

export const leadersCopy =
  "The strongest real estate projects win <strong>long before the first sales call.</strong> Through <strong>strategic branding, premium design</strong>, and <strong>compelling storytelling, we position your development</strong> to <strong>attract the right buyers, command higher perceived value</strong>, and become the <strong>benchmark in its market.</strong>";

/* ---------------------------------------------------------------- Website design */

export type WebProject = { name: string; note: string; meta: string[]; screenshot: string; w: number; h: number };

/** Websites published in the "Website Design" section of scaleacres.com. Platforms only where the live site states them. */
export const webProjects: WebProject[] = [
  { name: "SID Realtech", note: "Premium residential developer", meta: ["Real estate", "Next.js, Node.js"], screenshot: wp("2026/05/sidrealtech-scaled.png"), w: 698, h: 2560 },
  { name: "Subata Realty", note: "Phuket property for Indian and NRI investors", meta: ["Real estate"], screenshot: wp("2026/05/screencapture-subata-x-web-vercel-app-2026-05-26-11_31_30-1-scaled.png"), w: 710, h: 2560 },
  { name: "Imperial Sky Realty", note: "Dubai's premium property market", meta: ["Real estate"], screenshot: wp("2026/01/imperial-sky-realty-scaled.png"), w: 621, h: 2560 },
  { name: "JBBR Group", note: "Luxury real estate group", meta: ["Real estate"], screenshot: wp("2026/05/jbbr-homee-page-1-scaled.png"), w: 762, h: 2560 },
  { name: "Research Capital", note: "Real estate investment advisory", meta: ["Real estate"], screenshot: wp("2026/05/researchcapital-scaled.png"), w: 724, h: 2560 },
  { name: "Let's Movin", note: "Real estate consultancy", meta: ["Real estate", "WordPress"], screenshot: wp("2025/04/lets-movin-scaled.webp"), w: 634, h: 2560 },
];

/* ---------------------------------------------------------------- Video */

/** Shorts without a portrait cover on YouTube use the 720p frame, centre-cropped to 9:16. */
const NO_PORTRAIT_COVER = new Set(["hU-pHCMCKqo", "tdXNax-PUNQ", "gRVdTT7lOPk", "8_U_WnEdVjA", "Mqaa4zG7KoM", "3QHjnPGdrWc", "yILr4FpP2bc", "qEaDnpK8Eko", "csgbYpTlQMI"]);
/** No usable cover at all; left out of the homepage rail. */
const NO_COVER = new Set(["XfgdunDbBzE"]);

export type Short = { id: string; poster: string };
export type VideoTab = { id: StudioShortTab["id"]; label: string; description: string; shorts: Short[] };

const cover = (id: string) => `https://i.ytimg.com/vi/${id}/${NO_PORTRAIT_COVER.has(id) ? "hq720" : "oardefault"}.jpg`;

export const videoTabs: VideoTab[] = studioShorts.map((t) => ({
  id: t.id,
  label: t.label,
  description: t.description,
  shorts: t.youtubeIds.filter((id) => !NO_COVER.has(id)).slice(0, 8).map((id) => ({ id, poster: cover(id) })),
}));

export const studioReel = {
  src: clip("architecture").landscape,
  poster: posters.architecture,
  title: "ScaleAcres studio reel",
  caption: "Concept film created by ScaleAcres with AI · not client work",
};
