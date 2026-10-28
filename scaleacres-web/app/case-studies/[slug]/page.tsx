import type { Metadata } from "next";
import { caseStudyProjects, getProject } from "@/content/projects";
import { CaseStudyDetail } from "@/components/site/pages/Own";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} — ${p.category}`, description: p.summary, alternates: { canonical: `/case-studies/${p.slug}` } };
}

export default async function ProjectPage({ params }: Params) {
  return <CaseStudyDetail slug={(await params).slug} />;
}
