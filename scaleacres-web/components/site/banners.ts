import type { Banner } from "@/components/site/Stage";

/**
 * Banner art for each internal page (files in /images/heroes, rendered from genuine ScaleAcres work:
 * client creatives, website captures, brand pieces, film posters, studio and team photos; no text baked in).
 */
export const BANNER = {
  about: { name: "about", alt: "The ScaleAcres studio in Delhi, its founders and client work: SID Realtech, JBBR Group and Intech Developers" },
  team: { name: "team", alt: "Portraits of the ScaleAcres team" },
  work: { name: "work", alt: "ScaleAcres portfolio: brand identities, websites and campaign creatives for real estate developers" },
  cases: { name: "cases", alt: "Yugen Infra ad films and the One Goa project render with its campaign film" },
  contact: { name: "contact", alt: "Map of the ScaleAcres studio location in New Delhi" },
  web: { name: "web", alt: "Websites designed by ScaleAcres: SID Realtech, Subata Realty, Imperial and more, with the Subata Realty mobile site" },
  seo: { name: "seo", alt: "ScaleAcres SEO work: analytics dashboards and first-page Google rankings for client projects" },
  ppc: { name: "ppc", alt: "Google Ads campaigns run by ScaleAcres with TRG, JBBR, SID Realtech and Intech campaign creatives" },
  leadgen: { name: "leadgen", alt: "A ScaleAcres lead-generation campaign dashboard with client campaign creatives" },
  facebook: { name: "facebook", alt: "Meta Ads results from ScaleAcres campaigns with the client creatives that ran" },
  branding: { name: "branding", alt: "Brand identities by ScaleAcres: TRG, Ottimo, Karyan, JBBR Group, Intech Developers and the SID Realtech hoarding" },
  social: { name: "social", alt: "ScaleAcres social media work: short films and campaign posts for real estate clients" },
  video: { name: "video", alt: "Posters of ScaleAcres ad films, social videos and AI films" },
  ecommerce: { name: "ecommerce", alt: "The MW&B online store by ScaleAcres on desktop and mobile" },
  apps: { name: "apps", alt: "The Finsckool platform by ScaleAcres on desktop and mobile" },
  location: { name: "location", alt: "ScaleAcres work across websites, performance marketing, branding, social media, SEO and video" },
  yugen: { name: "yugen", alt: "Yugen Infra ad films by ScaleAcres" },
  onegoa: { name: "onegoa", alt: "One Goa project render and campaign film by ScaleAcres" },
} satisfies Record<string, Banner>;

const BY_SERVICE: Record<string, Banner> = {
  "website-design-development": BANNER.web,
  "search-engine-optimization": BANNER.seo,
  "performance-marketing": BANNER.ppc,
  "branding-creative-design": BANNER.branding,
  "social-media-marketing": BANNER.social,
  "video-creative-production": BANNER.video,
  "ecommerce-solutions": BANNER.ecommerce,
  "custom-applications-software": BANNER.apps,
};

/** The banner for a service page; the three performance pages each get their own. */
export function serviceBanner(slug: string, path?: string): Banner {
  if (path === "/facebook-ads-agency/") return BANNER.facebook;
  if (path === "/real-estate-lead-generation-agency/") return BANNER.leadgen;
  return BY_SERVICE[slug] ?? BANNER.location;
}
