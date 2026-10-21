import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";
import type { Metadata } from "next";

/**
 * LEGACY CONTENT (scaleacres.com, captured read-only on 19 Oct 2026 by scripts/legacy-extract.mjs)
 * ------------------------------------------------------------------
 * Every live page is stored verbatim: title, meta description, robots, canonical, Open Graph,
 * Twitter, JSON-LD and the full main content as ordered blocks. The redesigned templates only
 * change presentation. Never edit text here; re-run the extractor instead.
 */
export type Block =
  | { type: "heading"; level: number; html: string; text: string }
  | { type: "paragraph"; html: string; loose?: boolean }
  | { type: "list"; ordered: boolean; items: string[]; variant?: string }
  | { type: "table"; rows: { h: boolean; html: string }[][] }
  | { type: "image"; src: string; alt: string; width: number | null; height: number | null; caption?: string }
  | { type: "button"; href: string; text: string }
  | { type: "faq"; items: { q: string; qTag: string | null; answer: Block[] }[] }
  | { type: "video"; embed?: string; src?: string; poster?: string | null; title?: string }
  | { type: "quote"; html: string }
  | { type: "stat"; value: string; label: string }
  | { type: "form"; fields: string[] }
  | { type: "rule" };

export type LegacySection = { bgImage: string | null; blocks: Block[] };

export type LegacyPage = {
  path: string;
  status: number;
  finalUrl: string;
  title: string;
  metaDescription: string | null;
  robots: string | null;
  canonical: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  articleMeta: Record<string, string>;
  jsonld: string[];
  breadcrumbs: { name: string; url: string | null }[] | null;
  article: { headline?: string; datePublished?: string; dateModified?: string; author?: string | null; section?: string[] | string | null } | null;
  template: string;
  bodyClass: string;
  headings: { h1: string[]; h2: string[]; h3: string[] } | null;
  coverage: { visibleWords: number; captured: number; ratio: number } | null;
  sections: LegacySection[];
};

export type PageKind =
  | "post" | "archive" | "location" | "service" | "services" | "company" | "case" | "work" | "contact" | "legal" | "fragment";

type Store = { capturedAt: string; source: string; pages: LegacyPage[] };
let cache: Store | null = null;
function load(): Store {
  if (!cache) {
    const data = JSON.parse(gunzipSync(readFileSync(join(process.cwd(), "content/legacy/content.json.gz"))).toString("utf8")) as Store;
    for (const p of data.pages) retargetPopups(p);
    cache = data;
  }
  return cache;
}

/**
 * Elementor popup triggers (href "…#elementor-action…") only work inside WordPress. They open an
 * enquiry form, so they now point to the page's own enquiry form (or the contact page).
 */
function retargetPopups(p: LegacyPage) {
  const hasForm = p.sections.some((s) => s.blocks.some((b) => b.type === "form"));
  const target = hasForm ? `${p.path}#enquiry` : "/contact-us/";
  const fix = (h: string) => h.replace(/href="[^"]*#elementor-action[^"]*"/g, `href="${target}"`);
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      if ("html" in b && typeof b.html === "string") (b as { html: string }).html = fix(b.html);
      if (b.type === "list") b.items = b.items.map(fix);
      if (b.type === "button" && b.href.includes("#elementor-action")) b.href = target;
      if (b.type === "faq") b.items.forEach((it) => walk(it.answer));
    }
  };
  p.sections.forEach((s) => walk(s.blocks));
}

export const legacyCapturedAt = () => load().capturedAt;

/** Live pages that answer 200. The homepage is the approved redesign and is excluded here. */
export function legacyPages() {
  return load().pages.filter((p) => p.status === 200 && p.path !== "/");
}

export function getLegacyPage(path: string) {
  const norm = path.endsWith("/") ? path : `${path}/`;
  return legacyPages().find((p) => p.path === norm);
}

export function pageKind(p: LegacyPage): PageKind {
  const { path, bodyClass } = p;
  if (/\bsingle-post\b/.test(bodyClass)) return "post";
  if (/^\/blog\/(category|tag|author)\//.test(path) || /^\/blog\/\d{4}\//.test(path) || path === "/blog/") return "archive";
  if (path.includes("elementskit-content")) return "fragment";
  if (path === "/privacy-policy/" || path === "/terms-conditions/") return "legal";
  if (path === "/contact-us/") return "contact";
  if (path === "/case-studies/" || path === "/yugen-case-study/" || path.startsWith("/blog/casestudy/")) return "case";
  if (path === "/our-work/") return "work";
  if (path === "/about-us/" || path === "/our-team/" || path === "/careers/") return "company";
  if (path === "/our-services/") return "services";
  if (/(ppc-service|facebook-ads-agency|social-media-marketing-agency|web-development|lead-generation-agency|branding-agency|seo-service)\/$/.test(path)) return "service";
  return "location";
}

/** Images and files keep their WordPress paths. Staging/static preview loads them from the live origin. */
export const MEDIA_ORIGIN = (process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? "https://scaleacres.com").replace(/\/$/, "");
export const media = (src: string | null | undefined) => {
  if (!src) return "";
  if (src.startsWith("/wp-content/") || src.startsWith("/wp-includes/")) return MEDIA_ORIGIN + src;
  return src;
};

/** Rewrites /wp-content/... references inside captured inline HTML to the media origin. */
export const mediaHtml = (html: string) => html.replace(/(href|src)="(\/wp-(?:content|includes)\/[^"]*)"/g, (_, a, u) => `${a}="${MEDIA_ORIGIN}${u}"`);

/** Metadata exactly as published on the live page. */
export function legacyMetadata(p: LegacyPage): Metadata {
  const og = p.og ?? {};
  const tw = p.twitter ?? {};
  const am = p.articleMeta ?? {};
  const ogImage = og["og:image"];
  return {
    title: { absolute: p.title },
    description: p.metaDescription ?? undefined,
    robots: p.robots ?? undefined,
    // Canonical is emitted verbatim by <LegacyPageView> (Next would normalise its trailing slash).
    openGraph: og["og:title"]
      ? {
          type: og["og:type"] === "article" ? "article" : "website",
          locale: og["og:locale"],
          title: og["og:title"],
          description: og["og:description"],
          url: og["og:url"],
          siteName: og["og:site_name"],
          ...(ogImage ? { images: [{ url: ogImage, width: og["og:image:width"] ? +og["og:image:width"] : undefined, height: og["og:image:height"] ? +og["og:image:height"] : undefined, type: og["og:image:type"] }] } : {}),
          ...(og["og:type"] === "article" ? { publishedTime: am["article:published_time"], modifiedTime: am["article:modified_time"], authors: am["article:author"] ? [am["article:author"]] : undefined } : {}),
        }
      : undefined,
    twitter: tw["twitter:card"]
      ? { card: tw["twitter:card"] as "summary_large_image", title: tw["twitter:title"], description: tw["twitter:description"], images: tw["twitter:image"] ? [tw["twitter:image"]] : undefined }
      : undefined,
  };
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const strip = (h: string) =>
  h
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e: string) =>
      e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENTITIES[e.toLowerCase()] ?? m),
    )
    .replace(/\s+/g, " ")
    .trim();
export const plain = strip;
