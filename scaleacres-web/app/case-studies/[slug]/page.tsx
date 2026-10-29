import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegacyPage, legacyMetadata } from "@/lib/legacy";
import { CASES, CaseDetailPage } from "@/components/site/pages/Case";

type Params = { params: Promise<{ slug: string }> };

// Short case-study URLs show the full live case study; the canonical stays on the live address.
// (Prominent Realty and Hometrust Realty had no case-study content or visuals, so they are not built.)
export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

const pageFor = (slug: string) => { const c = CASES.find((x) => x.slug === slug); return c ? getLegacyPage(c.path) : undefined; };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = pageFor((await params).slug);
  return page ? legacyMetadata(page) : {};
}

export default async function Page({ params }: Params) {
  const page = pageFor((await params).slug);
  if (!page) notFound();
  return <div className="nd-int"><CaseDetailPage page={page} /></div>;
}
