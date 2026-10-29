import { media } from "@/lib/legacy";
import { img, ndAbout, ndBrands, ndHero, ndServiceCards, ndShowcase, ndSites, ndVideoTabs, ndWork, type Img } from "@/content/nd";
import { ArtDevice, ArtFeature, ArtMosaic, ArtReel, ArtStack, ArtVideo, type ArtImg } from "@/components/site/HeroArt";
import type { Clip } from "@/components/site/Media";
import { serviceSlugFor } from "@/components/site/Showcase";
import type { PostCard } from "@/components/site/pages/Blog";

/**
 * The hero composition for each internal page. Everything shown is genuine ScaleAcres material:
 * studio and team photographs, client project covers and creatives, website captures, the
 * ScaleAcres motion reel and the posters of ScaleAcres films.
 */

const art = (i: Img, alt: string, label?: string, sub?: string, href?: string, pos?: string): ArtImg => ({ src: i.src, srcSet: i.srcSet, w: i.w, h: i.h, alt, label, sub, href, pos });
const wp = (path: string, w: number, h: number, alt: string, label?: string, sub?: string, pos?: string): ArtImg => ({ src: media(`/wp-content/uploads/${path}`), w, h, alt, label, sub, pos });
const cover = (slug: string) => { const p = ndShowcase.find((s) => s.slug === slug)!; return art(p.cover, p.alt, p.client, p.category.split(" & ")[0], "/our-work/"); };
const svc = (slug: string, label?: string) => { const s = ndServiceCards.find((c) => c.slug === slug)!; return { src: s.image.src, srcSet: s.image.srcSet, w: 1800, h: 1200, alt: s.caption, label: label ?? s.title, href: s.href } as ArtImg; };
const workBy = (client: string) => ndWork.find((w) => w.client === client)!;

const STUDIO: ArtImg = { ...ndAbout.studio.team, label: "The ScaleAcres studio", sub: "New Delhi" };
const LEADERS: ArtImg = { ...ndAbout.studio.founders, label: "Leadership in the studio" };
const CELEBRATION = wp("2025/04/atovmv7cwmsfxh1srdfm.webp", 800, 654, "The ScaleAcres team celebrating together in the studio", "Celebrations & culture");
const OFFICE = wp("2025/09/01.webp", 800, 653, "The ScaleAcres team at work in the office", "Dynamic work environment");
const OFFICE2 = wp("2025/09/03.webp", 800, 654, "Team collaboration at ScaleAcres", "Team spirit");
const FOUNDERS = wp("2025/04/Rectangle-7060.webp", 619, 834, "Mohit and Prem, founders of ScaleAcres", "Mohit & Prem", "Founders", "50% 30%");

export const AboutArt = () => <ArtStack main={STUDIO} side={{ ...FOUNDERS, pos: "50% 25%" }} chip={cover("jbbr-group")} />;
export const TeamArt = () => <ArtMosaic ratio="aspect-[4/3]" items={[CELEBRATION, STUDIO, OFFICE, { ...FOUNDERS, pos: "50% 22%" }]} />;
export const CareersArt = () => <ArtStack mainRatio="aspect-[4/3]" main={{ ...CELEBRATION, label: "Life @ ScaleAcres" }} side={OFFICE2} chip={LEADERS} />;
export const WorkArt = () => <ArtMosaic ratio="aspect-[16/10]" items={["jbbr-group", "trg-the-mall", "sid-realtech", "intech-developers"].map(cover)} />;
export const ServicesArt = () => (
  <ArtVideo src={ndHero.reel.landscape} poster={ndHero.reel.poster.landscape} label="ScaleAcres reel · genuine client work" chips={ndHero.reel.chapters.slice(0, 5).map((c) => c.label)} />
);
export const CaseStudiesArt = () => (
  <ArtStack
    mainRatio="aspect-square"
    main={wp("2025/04/Scale-Acres-Case-Study-Cards-03.webp", 536, 536, "Yugen Infra case study results card", "Yugen Infra", "North Goa")}
    side={wp("2025/04/Group-2147223992-1997x2048.webp", 800, 820, "One Goa project render", "One Goa", "Bicholim, Goa")}
    chip={wp("2025/04/1742295015784.webp", 2232, 1189, "Live campaign dashboard from a ScaleAcres case study", "Campaign dashboard", undefined, "0% 0%")}
  />
);
export const ContactArt = () => <ArtStack mainRatio="aspect-[5/4]" main={{ ...STUDIO, label: "Studio · Saidulajab, New Delhi" }} side={{ src: "/media/ext/map.webp", w: 1600, h: 760, alt: "Map: the ScaleAcres studio in Saidulajab, New Delhi", label: "View on map", href: "#map", pos: "50% 45%" }} />;

const posterClip = (tab: number, i = 0, label: string): Clip => {
  const v = ndVideoTabs[tab].videos[i];
  return { host: "youtube", id: v.id, poster: v.poster.src, title: `${label} by ScaleAcres`, ratio: "9/16" };
};
export const StudioArt = () => (
  <ArtReel clips={[posterClip(0, 0, "Ad video"), posterClip(1, 0, "Social media video"), posterClip(2, 0, "AI video")]} labels={["Ad video", "Social", "AI video"]} />
);

export function BlogArt({ posts }: { posts: PostCard[] }) {
  const withImg = posts.filter((p) => p.img);
  if (!withImg.length) return null;
  const toArt = (p: PostCard) => ({ src: media(p.img!.src), w: p.img!.width ?? 1439, h: p.img!.height ?? 760, alt: p.img!.alt || p.title, label: p.title, href: p.path, meta: [p.category, p.date].filter(Boolean).join(" · ") });
  return <ArtFeature lead={toArt(withImg[0])} more={withImg.slice(1, 3).map(toArt)} />;
}

/** Service pages (legacy URLs and /services/<slug>/): the service's own work, each composed differently. */
export function ServiceArt({ path, slug }: { path?: string; slug?: string }) {
  const key = slug ?? (path ? serviceSlugFor(path) : null);
  if (!key) return null;
  const main = { ...svc(key), href: undefined };
  switch (key) {
    case "website-design-development":
      return <ArtDevice video="/videos/nd/web-sid-scroll" poster={ndSites[0].image.src} domain="sidrealtech.com" phone={art(img("m-subata"), "Subata Realty mobile website by ScaleAcres")} />;
    case "search-engine-optimization":
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={art(img("seo"), "First-page Google rankings achieved by ScaleAcres", "First-page rankings", undefined, undefined, "0% 0%")} chip={art(img("google"), "Google search results for ScaleAcres clients", "Google search", undefined, undefined, "0% 0%")} />;
    case "performance-marketing": {
      const fb = path === "/facebook-ads-agency/";
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={fb ? art(img("meta"), "Meta Ads results from ScaleAcres campaigns", "Meta Ads", undefined, undefined, "0% 0%") : art(img("google"), "Google search ads run by ScaleAcres", "Google Ads", undefined, undefined, "0% 0%")} chip={art(workBy("TRG").image, workBy("TRG").alt, "TRG The Mall", "Campaign", undefined, "50% 30%")} />;
    }
    case "branding-creative-design": {
      const h = ndBrands.find((b) => b.client === "SID Realtech")!;
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={art(h.image, h.title, h.client, h.kind)} chip={cover("jbbr-group")} />;
    }
    case "social-media-marketing":
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={art(workBy("JBBR Group").image, workBy("JBBR Group").alt, "JBBR Group", "Social campaign", undefined, "50% 20%")} chip={art(workBy("Intech Developers").image, workBy("Intech Developers").alt, "Intech Developers", undefined, undefined, "50% 30%")} />;
    case "video-creative-production":
      return <ArtReel clips={[posterClip(0, 1, "Ad video"), posterClip(1, 1, "Social media video"), posterClip(2, 1, "AI video")]} labels={["Ad film", "Social", "AI film"]} />;
    case "ecommerce-solutions":
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={art(img("m-mwb"), "MW&B online store on mobile, built by ScaleAcres", "MW&B store", "Shopify", undefined, "50% 0%")} />;
    case "custom-applications-software":
      return <ArtStack mainRatio="aspect-[3/2]" main={main} side={art(img("m-finsckool"), "Finsckool platform on mobile, built by ScaleAcres", "Finsckool", "Web platform", undefined, "50% 0%")} />;
    default:
      return <ArtStack mainRatio="aspect-[3/2]" main={main} />;
  }
}

/** City and country pages: the four services those pages sell, as a montage. */
export const LocationArt = () => (
  <ArtMosaic ratio="aspect-[3/2]" items={[svc("website-design-development", "Websites"), svc("performance-marketing", "Performance marketing"), svc("branding-creative-design", "Branding"), svc("social-media-marketing", "Social media")]} />
);
