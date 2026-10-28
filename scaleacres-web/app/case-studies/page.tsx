import type { Metadata } from "next";
import { getLegacyPage, legacyMetadata } from "@/lib/legacy";
import { SitePage } from "@/components/site/SitePage";

// Live /case-studies/ page, redesigned with its original content (the folder also holds new
// /case-studies/<slug>/ pages, so this path keeps its own route file).
const page = getLegacyPage("/case-studies/")!;

export const metadata: Metadata = legacyMetadata(page);

export default function CaseStudiesPage() {
  return <SitePage page={page} />;
}
