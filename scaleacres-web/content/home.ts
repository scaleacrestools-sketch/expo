import { services, type Service } from "@/content/services";
import { studioShorts, type StudioShortTab } from "@/content/studio-shorts";

/**
 * Homepage (v2, "editorial cinematic" direction) — content and media.
 *
 * Media rules:
 * - Client work comes only from scaleacres.com and the ScaleAcres YouTube channel, bundled in
 *   /images/home/work so the page has no third-party image requests.
 * - ScaleAcres' AI concept footage is always labelled as such and never presented as client work.
 */
/** Genuine ScaleAcres work, bundled locally (sourced from scaleacres.com and the ScaleAcres YouTube channel). */
const work = (name: string) => `/images/home/work/${name}.jpg`;

/* ---------------------------------------------------------------- Hero */

const HERO_FILM = {
  dw: "/videos/hero-film-desktop.webm",
  dm: "/videos/hero-film-desktop.mp4",
  mw: "/videos/hero-film-mobile.webm",
  mm: "/videos/hero-film-mobile.mp4",
};

export const hero = {
  /** H1, set large. The last word carries the Sky accent. */
  statement: ["Built to stand out.", "Designed to scale."],
  accent: "scale.",
  support: "A real estate marketing and creative growth agency combining strategy, design, technology and performance.",
  /** Right-hand display line (Arpeggio's "The Creative Agency—" position), desktop only. */
  tagline: ["The Real Estate", "Growth Agency—"],
  /** Brand word at the foot of the hero. */
  word: "ScaleAcres",
  /**
   * Hero film v2: a 16.3 s loop edited from genuine ScaleAcres work (scaleacres.com) and two
   * ScaleAcres concept films. WebM (VP9) first, MP4 (H.264) fallback, both bundled locally.
   * Posters are the opening frame.
   */
  film: {
    landscape: { webm: HERO_FILM.dw, mp4: HERO_FILM.dm, poster: "/images/home/hero-film-poster.jpg" },
    portrait: { webm: HERO_FILM.mw, mp4: HERO_FILM.mm, poster: "/images/home/hero-film-poster-portrait.jpg" },
  },
  /** Scene chapters, synced to the film (seconds). Concept scenes are labelled as such. */
  chapters: [
    { at: 0, label: "Real estate", note: "ScaleAcres concept film" },
    { at: 2.67, label: "Branding · SID Realtech", note: "Ellington 86 brochure, guideline and hoarding" },
    { at: 5.33, label: "Website design", note: "SID Realtech, Subata Realty, Imperial Sky Realty" },
    { at: 8.17, label: "Social media", note: "JBBR Group, SID Realtech, Intech Developers, TRG" },
    { at: 10.63, label: "Performance marketing", note: "Live Meta, Google and SEO results" },
    { at: 13.29, label: "Video production", note: "ScaleAcres concept film" },
  ],
};

/* ---------------------------------------------------------------- Manifesto collage */

export type CollageItem = { src: string; alt: string; w: number; h: number };

/** Genuine ScaleAcres work from scaleacres.com, drifting around the manifesto statement. */
export const collage: CollageItem[] = [
  { src: work("slide-5"), alt: "ScaleAcres UI/UX and website portfolio", w: 924, h: 522 },
  { src: work("yt-1ZXNwVLM7T4"), alt: "AI video for JBBR Group's Kanvas project", w: 1080, h: 1920 },
  { src: work("slide-12"), alt: "Nirvana Grand website designed by ScaleAcres", w: 924, h: 522 },
  { src: work("yt-ZQa0XNGiN7Y"), alt: "Location video for a Gurugram project", w: 1080, h: 1920 },
  { src: work("result-google"), alt: "Google Ads results from a ScaleAcres campaign", w: 1192, h: 683 },
  { src: work("yt-MdluDjATzgA"), alt: "Social media video for a residential project", w: 1080, h: 1920 },
];

/* ---------------------------------------------------------------- Services */

export type ServiceMedia =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "top"; caption: string }
  | { kind: "video"; src: string; poster: string; caption: string }
  | { kind: "posters"; items: { src: string; alt: string }[]; caption: string }
  | { kind: "screens"; items: { src: string; alt: string }[]; caption: string };

const serviceMedia: Record<string, ServiceMedia> = {
  "website-design-development": { kind: "image", src: work("slide-8"), alt: "Ellington 86 website designed by ScaleAcres", caption: "Ellington 86 · website for SID Realtech" },
  "search-engine-optimization": { kind: "image", src: work("result-seo"), alt: "Search results and rankings from ScaleAcres SEO campaigns", caption: "Search rankings from live ScaleAcres campaigns" },
  "performance-marketing": { kind: "image", src: work("result-meta"), alt: "Meta Ads campaign results from ScaleAcres real estate campaigns", caption: "Meta Ads results · live ScaleAcres campaigns" },
  "branding-creative-design": { kind: "image", src: work("slide-2"), alt: "SID Realtech brand style guideline", caption: "SID Realtech · brand identity system" },
  "social-media-marketing": {
    kind: "posters",
    caption: "Launch creatives · JBBR Group, SID Realtech, TRG",
    items: [
      { src: work("creative-jbbr"), alt: "JBBR Group social creative" },
      { src: work("creative-sid"), alt: "SID Realtech Ellington 86 creative" },
      { src: work("creative-trg"), alt: "TRG The Mall social creative" },
    ],
  },
  "video-creative-production": {
    kind: "posters",
    caption: "Ad films produced by ScaleAcres · published on YouTube",
    items: [
      { src: work("yt-vODoeG2QEKQ"), alt: "ScaleAcres ad film cover" },
      { src: work("yt-nRFeRCMZG3E"), alt: "ScaleAcres ad film cover" },
      { src: work("yt-9GUSJ8zlvRA"), alt: "ScaleAcres ad film cover" },
    ],
  },
  "ecommerce-solutions": {
    kind: "screens",
    caption: "Jina Cosmetics · MW&B store",
    items: [
      { src: work("site-jina"), alt: "Jina Cosmetics ecommerce website" },
      { src: work("site-mwb"), alt: "MW&B online store" },
    ],
  },
  "custom-applications-software": { kind: "image", src: work("slide-6"), alt: "Finsckool learning platform designed and built by ScaleAcres", caption: "Finsckool · education platform built by ScaleAcres" },
};

export const homeServices: (Service & { media: ServiceMedia })[] = services.map((s) => ({ ...s, media: serviceMedia[s.slug] }));

/* ---------------------------------------------------------------- Market leaders (branding) */

export type BrandWork = { src: string; title: string; client: string; w: number; h: number };

export const brandWork: BrandWork[] = [
  { src: work("slide-2"), title: "Brand identity system", client: "SID Realtech", w: 924, h: 522 },
  { src: work("slide-1"), title: "Ellington 86 brochure", client: "SID Realtech", w: 924, h: 522 },
  { src: work("slide-3"), title: "Ellington 86 hoarding", client: "SID Realtech", w: 924, h: 522 },
  { src: work("slide-15"), title: "Project brochure spreads", client: "Ellington 86", w: 924, h: 522 },
  { src: work("slide-4"), title: "Event and site branding", client: "TRG", w: 924, h: 522 },
  { src: work("slide-14"), title: "Township brochure", client: "Nirvana County", w: 924, h: 522 },
  { src: work("slide-13"), title: "Brochure layouts", client: "Nirvana County", w: 924, h: 522 },
];

export const leadersCopy =
  "The strongest real estate projects win <strong>long before the first sales call.</strong> Through <strong>strategic branding, premium design</strong>, and <strong>compelling storytelling, we position your development</strong> to <strong>attract the right buyers, command higher perceived value</strong>, and become the <strong>benchmark in its market.</strong>";

/* ---------------------------------------------------------------- Featured work */

export type Featured = { client: string; project: string; work: string[]; src: string; alt: string; w: number; h: number };

/** Genuine projects published on scaleacres.com; disciplines are only those the published work shows. */
export const featuredWork: Featured[] = [
  { client: "SID Realtech", project: "Ellington 86", work: ["Branding", "Launch creatives", "Website"], src: work("creative-sid"), alt: "Ellington 86 coming-soon launch creative for SID Realtech", w: 1350, h: 1688 },
  { client: "Subata Realty", project: "Phuket property platform", work: ["Website design", "Development"], src: work("slide-9"), alt: "Subata Realty website shown on desktop and page layouts", w: 924, h: 522 },
  { client: "JBBR Group", project: "Luxury residences", work: ["Social creatives", "Website"], src: work("creative-jbbr"), alt: "JBBR Group luxury lifestyle social creative", w: 1350, h: 1688 },
  { client: "Intech Developers", project: "Residential and plotted projects", work: ["Website", "Social creatives"], src: work("slide-10"), alt: "Intech Developers website shown on desktop and page layouts", w: 924, h: 522 },
  { client: "TRG", project: "TRG The Mall", work: ["Campaign creatives", "Event branding"], src: work("creative-trg"), alt: "TRG The Mall investment campaign creative", w: 1297, h: 1621 },
  { client: "Finsckool", project: "Learning platform", work: ["Brand", "Web platform"], src: work("slide-6"), alt: "Finsckool learning platform shown on desktop and page layouts", w: 924, h: 522 },
];

/* ---------------------------------------------------------------- Website design */

export type WebProject = { name: string; note: string; meta: string[]; screenshot: string; w: number; h: number };

/** Websites published in the "Website Design" section of scaleacres.com. Platforms only where the live site states them. */
export const webProjects: WebProject[] = [
  { name: "SID Realtech", note: "Premium residential developer", meta: ["Real estate", "Next.js, Node.js"], screenshot: work("site-sid"), w: 698, h: 2560 },
  { name: "Subata Realty", note: "Phuket property for Indian and NRI investors", meta: ["Real estate"], screenshot: work("site-subata"), w: 710, h: 2560 },
  { name: "Imperial Sky Realty", note: "Dubai's premium property market", meta: ["Real estate"], screenshot: work("site-imperial"), w: 621, h: 2560 },
  { name: "JBBR Group", note: "Luxury real estate group", meta: ["Real estate"], screenshot: work("site-jbbr"), w: 762, h: 2560 },
  { name: "Research Capital", note: "Real estate investment advisory", meta: ["Real estate"], screenshot: work("site-research"), w: 724, h: 2560 },
  { name: "Let's Movin", note: "Real estate consultancy", meta: ["Real estate", "WordPress"], screenshot: work("site-letsmovin"), w: 634, h: 2560 },
];

/* ---------------------------------------------------------------- Video */

/** No usable cover at all; left out of the homepage rail. */
const NO_COVER = new Set(["XfgdunDbBzE"]);

export type Short = { id: string; poster: string };
export type VideoTab = { id: StudioShortTab["id"]; label: string; description: string; shorts: Short[] };

const cover = (id: string) => work(`yt-${id}`);
/** Covers bundled with the site; a short without one is left out of the rail. */
const BUNDLED = new Set(["1ZXNwVLM7T4","O1FJdO2yZOY","z37JFVVNIYk","5Pm2Z6WszRc","FxO_2KVX4zA","ZQa0XNGiN7Y","TyFCnkRBg_I","hU-pHCMCKqo","tdXNax-PUNQ","gRVdTT7lOPk","MdluDjATzgA","8_U_WnEdVjA","Mqaa4zG7KoM","3QHjnPGdrWc","yILr4FpP2bc","vgsUylyADPY","fRnzr1dSYMg","0NmdVrMelSQ","Z1ez2sINaao","vODoeG2QEKQ","QkCSgbRHJ0g","HXVFHKSOmVE","Hh6lSEZ0WyY","nRFeRCMZG3E","9GUSJ8zlvRA"]);

export const videoTabs: VideoTab[] = studioShorts.map((t) => ({
  id: t.id,
  label: t.label,
  description: t.description,
  shorts: t.youtubeIds.filter((id) => !NO_COVER.has(id) && BUNDLED.has(id)).slice(0, 8).map((id) => ({ id, poster: cover(id) })),
}));
