import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegacyPage, legacyMetadata, legacyPages, pageKind } from "@/lib/legacy";
import { LegacyPageView } from "@/components/legacy/LegacyPage";
import { SitePage } from "@/components/site/SitePage";

/**
 * Every existing scaleacres.com URL (except the approved homepage and the new pages that have
 * their own routes) is generated here at its exact live path, with its live metadata and content.
 */
const OWN_ROUTES = new Set(["/case-studies/"]);

export const dynamicParams = false;

export function generateStaticParams() {
  return legacyPages()
    .filter((p) => !OWN_ROUTES.has(p.path))
    .map((p) => ({ slug: p.path.replace(/^\/|\/$/g, "").split("/") }));
}

const pathOf = (slug: string[]) => `/${slug.map(decodeURIComponent).join("/")}/`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const page = getLegacyPage(pathOf((await params).slug));
  return page ? legacyMetadata(page) : {};
}

export default async function LegacyRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const page = getLegacyPage(pathOf((await params).slug));
  if (!page) notFound();
  // Megamenu fragments are WordPress internals, kept at their URLs with the plain renderer.
  return pageKind(page) === "fragment" ? <LegacyPageView page={page} /> : <SitePage page={page} />;
}
