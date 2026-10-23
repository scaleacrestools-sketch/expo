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

export type HeroScene = {
  /** Display line that changes with the visual. */
  line: string;
  /** Small label naming the work shown (always a real ScaleAcres project). */
  label: string;
  kind: "browser" | "card" | "fan" | "stack";
  items: { src: string; alt: string; w: number; h: number }[];
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
  /** Atmospheric backdrop: a monochrome frame from the ScaleAcres "Light sweep" concept film (not client work). */
  image: { landscape: "/images/home/hero-light.jpg", portrait: "/images/home/hero-light-portrait.jpg", w: 1920, h: 1080, pw: 900, ph: 1600 },
  /**
   * Work showcase: genuine ScaleAcres projects that open beside the headline, each paired with
   * its own display line. Live-site captures were taken from the client websites in Oct 2026.
   */
  scenes: [
    {
      line: "Websites that sell.",
      label: "Website design · SID Realtech",
      kind: "browser",
      items: [{ src: "/images/home/hero/sid-site.webp", alt: "SID Realtech website designed and developed by ScaleAcres", w: 1100, h: 688 }],
    },
    {
      line: "Brands people remember.",
      label: "Brand identity · SID Realtech",
      kind: "card",
      items: [{ src: "/images/home/hero/sid-brand.webp", alt: "SID Realtech brand style guideline by ScaleAcres", w: 924, h: 522 }],
    },
    {
      line: "Content that connects.",
      label: "Social media · JBBR Group, SID Realtech, TRG",
      kind: "fan",
      items: [
        { src: "/images/home/hero/social-jbbr.webp", alt: "JBBR Group social creative", w: 440, h: 550 },
        { src: "/images/home/hero/social-sid.webp", alt: "SID Realtech Ellington 86 launch creative", w: 440, h: 550 },
        { src: "/images/home/hero/social-trg.webp", alt: "TRG The Mall campaign creative", w: 440, h: 550 },
      ],
    },
    {
      line: "Campaigns that perform.",
      label: "Performance marketing · Meta and Google Ads results",
      kind: "stack",
      items: [
        { src: "/images/home/hero/results-google.webp", alt: "Google Ads results from a ScaleAcres campaign", w: 820, h: 470 },
        { src: "/images/home/hero/results-meta.webp", alt: "Meta Ads results from ScaleAcres real estate campaigns", w: 900, h: 515 },
      ],
    },
    {
      line: "Films that move buyers.",
      label: "Video production · ScaleAcres ad films",
      kind: "fan",
      items: [
        { src: "/images/home/hero/film-1.webp", alt: "ScaleAcres ad film cover", w: 360, h: 640 },
        { src: "/images/home/hero/film-2.webp", alt: "ScaleAcres ad film cover", w: 360, h: 640 },
        { src: "/images/home/hero/film-3.webp", alt: "ScaleAcres ad film cover", w: 360, h: 640 },
      ],
    },
  ] satisfies HeroScene[],
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
  /** A live website on desktop and phone (first-screen captures of the real site). */
  | { kind: "devices"; desktop: string; mobile: string; alt: string; caption: string }
  /** A campaign results screenshot beside a campaign creative. */
  | { kind: "pair"; wide: { src: string; alt: string }; tall: { src: string; alt: string }; caption: string }
  | { kind: "posters"; items: { src: string; alt: string; tag?: string }[]; caption: string };

const live = (name: string) => `/images/home/live/live-${name}.jpg`;

/**
 * Each service shows its own genuine work. Gaps (no authentic asset yet): CRM / dashboard
 * screens for Custom Applications, and ad-platform creative previews for Performance.
 */
const serviceMedia: Record<string, ServiceMedia> = {
  "website-design-development": { kind: "devices", desktop: live("subata"), mobile: live("subata-m"), alt: "Subata Realty website on desktop and mobile, designed and developed by ScaleAcres", caption: "Subata Realty · desktop and mobile website" },
  "search-engine-optimization": { kind: "image", src: work("result-seo"), alt: "Search rankings and traffic from ScaleAcres SEO campaigns", fit: "top", caption: "Search rankings from live ScaleAcres SEO campaigns" },
  "performance-marketing": {
    kind: "pair",
    wide: { src: work("result-meta"), alt: "Meta Ads results from ScaleAcres real estate campaigns" },
    tall: { src: work("creative-trg"), alt: "TRG The Mall lead-generation campaign creative" },
    caption: "Ad creative for TRG · Meta Ads results",
  },
  "branding-creative-design": { kind: "image", src: work("slide-2"), alt: "SID Realtech brand style guideline: logo, colours and applications", caption: "SID Realtech · brand identity system" },
  "social-media-marketing": {
    kind: "posters",
    caption: "Social creatives · JBBR Group, SID Realtech, Intech Developers",
    items: [
      { src: work("creative-jbbr"), alt: "JBBR Group social creative" },
      { src: work("creative-sid"), alt: "SID Realtech Ellington 86 launch creative" },
      { src: work("creative-intech"), alt: "Intech Developers social creative" },
    ],
  },
  "video-creative-production": {
    kind: "posters",
    caption: "Ad film · social video · AI video (labelled)",
    items: [
      { src: work("yt-vODoeG2QEKQ"), alt: "ScaleAcres real estate ad film", tag: "Ad" },
      { src: work("yt-MdluDjATzgA"), alt: "ScaleAcres social media video", tag: "Social" },
      { src: work("yt-FxO_2KVX4zA"), alt: "AI video by ScaleAcres", tag: "AI video" },
    ],
  },
  "ecommerce-solutions": { kind: "devices", desktop: live("mwb"), mobile: live("mwb-m"), alt: "MW&B online store on desktop and mobile, built by ScaleAcres", caption: "MW&B · ecommerce store, desktop and mobile" },
  "custom-applications-software": { kind: "devices", desktop: live("finsckool"), mobile: live("finsckool-m"), alt: "Finsckool learning platform on desktop and mobile, built by ScaleAcres", caption: "Finsckool · learning platform built by ScaleAcres" },
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

/**
 * Websites built by ScaleAcres. Previews are first-screen captures of the live client sites
 * (1440 × 900 viewport, taken Oct 2026). Platforms only where the live site states them.
 */
export const webProjects: WebProject[] = [
  { name: "SID Realtech", note: "Premium residential developer, Faridabad", meta: ["Real estate", "Next.js, Node.js"], screenshot: "/images/home/live/live-sid.jpg", w: 1600, h: 1000 },
  { name: "Subata Realty", note: "Phuket property for Indian and NRI investors", meta: ["Real estate"], screenshot: "/images/home/live/live-subata.jpg", w: 1600, h: 1000 },
  { name: "Imperial Sky Realty", note: "Dubai's premium property market", meta: ["Real estate"], screenshot: "/images/home/live/live-imperial.jpg", w: 1600, h: 1000 },
  { name: "Research Capital", note: "Real estate investment advisory, Gurugram", meta: ["Real estate"], screenshot: "/images/home/live/live-research.jpg", w: 1600, h: 1000 },
  { name: "Finsckool", note: "Finance education platform", meta: ["Education", "Web platform"], screenshot: "/images/home/live/live-finsckool.jpg", w: 1600, h: 1000 },
  { name: "Jina Cosmetics", note: "Private-label cosmetics manufacturer", meta: ["Manufacturing"], screenshot: "/images/home/live/live-jina.jpg", w: 1600, h: 1000 },
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
