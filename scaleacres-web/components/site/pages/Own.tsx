import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { legacyPages, media, pageKind } from "@/lib/legacy";
import { services, getService, serviceHref } from "@/content/services";
import { ndServiceCards } from "@/content/nd";
import { caseStudyProjects, getProject } from "@/content/projects";
import { caseStudies } from "@/content/caseStudies";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Btn, ClosingCta, Head, Hero, Section } from "@/components/site/Kit";
import { ServiceVisual, WorkStrip } from "@/components/site/Showcase";
import { StudioLibrary } from "@/components/site/Studio";
import { PostTile, type PostCard } from "@/components/site/pages/Blog";
import { ArrowUR, Rules, Tag } from "@/components/nd/ui";
import { NdServices } from "@/components/nd/NdServices";
import { NdTestimonials } from "@/components/nd/NdTestimonials";

/** Pages with their own routes (not from the WordPress capture), in the homepage design language. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

/* ------------------------------------------------------------------ creative studio */

export function CreativeStudioPage() {
  return (
    <>
      <Hero
        tag="The creative lab"
        title="Made to be seen."
        accent={["seen."]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Creative Studio" }]}
        lead={<p>Ideas don&apos;t have to stay on paper. We turn concepts into compelling visual stories through creative production, AI-powered content and videos that get noticed.</p>}
        actions={<><Btn href="#ad-videos" variant="white">Ad videos</Btn><Btn href="#social-media-videos" variant="white">Social videos</Btn><Btn href="#ai-videos" variant="white">AI videos</Btn></>}
      />
      <StudioLibrary />
      <WorkStrip title="Creative that sells projects." />
      <ClosingCta />
    </>
  );
}

/* ------------------------------------------------------------------ insights */

export function InsightsPage({ posts }: { posts: PostCard[] }) {
  return (
    <>
      <Hero
        tag="Thinking out loud"
        title="Ideas worth exploring."
        accent={["exploring."]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        lead={<p>Our latest articles live on the ScaleAcres blog, which continues at its existing address so nothing you&apos;ve bookmarked or found in search goes missing.</p>}
        actions={<Btn href="/blog/" variant="white">Read the blog</Btn>}
      />
      <Section tone="white" label="Latest articles">
        <Head tag="Latest" title="From the blog." accent={["blog."]} />
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-14 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((c, i) => <PostTile key={c.path} c={c} i={i} />)}
        </div>
        <div className="nd-cell mt-12 flex justify-center" data-nd="up"><Btn href="/blog/" variant="ink">All articles</Btn></div>
      </Section>
      <ClosingCta />
    </>
  );
}

/* ------------------------------------------------------------------ service (new /services/<slug>/ URLs) */

export function ServiceDetail({ slug }: { slug: string }) {
  const s = getService(slug);
  if (!s) notFound();
  const card = ndServiceCards.find((c) => c.slug === s.slug);
  const next = services[(services.indexOf(s) + 1) % services.length];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Services", path: "/our-services/" }, { name: s.title, path: serviceHref(s) }])) }} />
      <Hero
        tag={`${s.number} · ${s.title}`}
        title={s.headline}
        accent={[s.headline.split(" ").slice(-1)[0]]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/our-services/" }, { label: s.title }]}
        lead={<p>{s.description}</p>}
        actions={<><Btn href="/contact-us/">{s.ctaLabel.replace(/^Explore/, "Talk about")}</Btn><Btn href="#included" variant="white">What&apos;s included</Btn></>}
        media={<ServiceVisual slug={s.slug} />}
      />
      <Section tone="white" id="included" label="What's included">
        <Head tag="What's included" title="Built around your goals." accent={["goals."]} intro={card ? <p>{card.description}</p> : undefined} />
        <ol role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid border-t border-[color:var(--line-l)] sm:grid-cols-2 lg:grid-cols-4">
          {s.included.map((item, i) => (
            <li key={item} data-nd="up" style={d(i * 80)} className="border-b border-[color:var(--line-l)] px-[clamp(0.75rem,1.2vw,1.25rem)] py-8 sm:border-r">
              <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-6 text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em]">{item}</p>
            </li>
          ))}
        </ol>
        {s.focus ? <p className="nd-cell nd-lead mt-10 max-w-[40rem]" data-nd="up">{s.focus}</p> : null}
        {card?.note ? <p className="nd-cell nd-label nd-muted mt-6">{card.note}</p> : null}
      </Section>
      <NdServices />
      <WorkStrip />
      <NdTestimonials />
      <NextRow label="Next service" href={serviceHref(next)} num={next.number} title={next.title} />
      <ClosingCta />
    </>
  );
}

/* ------------------------------------------------------------------ case study (/case-studies/<slug>/) */

const LIVE: Record<string, { href: string; card: string }> = {
  "yugen-goa": { href: "/yugen-case-study/", card: "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-03.webp" },
  "one-goa": { href: "/blog/casestudy/our-case-one-goa/", card: "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-02.webp" },
};

export function CaseStudyDetail({ slug }: { slug: string }) {
  const p = getProject(slug);
  if (!p) notFound();
  const cs = caseStudies.find((c) => c.slug === p.slug);
  const used = services.filter((s) => p.services.includes(s.slug));
  const next = caseStudyProjects[(caseStudyProjects.indexOf(p) + 1) % caseStudyProjects.length];
  const live = LIVE[p.slug];
  const liveExists = live && legacyPages().some((x) => x.path === live.href && pageKind(x) !== "fragment");
  const cover = p.image ?? (live ? media(live.card) : null);
  return (
    <>
      <Hero
        tag={p.category}
        title={p.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Case studies", href: "/case-studies/" }, { label: p.title }]}
        lead={<p>{p.summary}</p>}
        actions={<>{liveExists ? <Btn href={live.href}>Read the full case study</Btn> : null}<Btn href="/contact-us/" variant="white">Start a project</Btn></>}
      />
      <Section tone="white" label="Project">
        <div className="nd-grid gap-y-12">
          <aside className="nd-cell">
            <dl className="grid gap-8">
              <div data-nd="up"><dt className="nd-label nd-muted">Client</dt><dd className="mt-2 text-[1.375rem] font-semibold tracking-[-0.02em]">{p.client}</dd></div>
              {p.location ? <div data-nd="up" style={d(60)}><dt className="nd-label nd-muted">Location</dt><dd className="mt-2 text-[1.125rem]">{p.location}</dd></div> : null}
              {cs ? <div data-nd="up" style={d(120)}><dt className="nd-label nd-muted">Industry</dt><dd className="mt-2 text-[1.125rem]">{cs.industry}</dd></div> : null}
              {used.length ? (
                <div data-nd="up" style={d(180)}>
                  <dt className="nd-label nd-muted">Services</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">{used.map((s) => <Link key={s.slug} href={serviceHref(s)} className="rounded-full border border-[color:var(--line-l)] px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]">{s.title}</Link>)}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
          <div className="nd-cell lg:col-span-2">
            {cover ? (
              <div data-nd="clip" className="nd-zoom relative mb-12 aspect-square max-w-[34rem] overflow-hidden rounded-[14px] bg-[color:var(--mist)] shadow-[var(--sh-2)]">
                <div className="nd-settle absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt={`${p.title} case study`} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
            ) : null}
            <div className="nd-article max-w-[44rem]">
              <h2>{cs ? "Overview" : "About the project"}</h2>
              <p>{cs ? `${cs.overview} ${cs.approach}` : p.summary}</p>
            </div>
          </div>
        </div>
      </Section>
      {cs ? (
        <Section tone="dark" label="Outcomes">
          <Head dark tag="Outcomes, as published" title="What changed." accent={["changed."]} />
          <ol role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid border-t border-white/12 md:grid-cols-3">
            {cs.outcomes.map((o, i) => (
              <li key={o} data-nd="up" style={d(i * 80)} className="border-b border-white/12 px-[clamp(0.75rem,1.2vw,1.25rem)] py-8 md:border-r">
                <span className="nd-label tabular-nums text-[color:var(--sky)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold leading-tight tracking-[-0.035em]">{o}</p>
              </li>
            ))}
          </ol>
          <p className="nd-cell nd-label mt-8 text-white/50">Source: {cs.source}</p>
        </Section>
      ) : null}
      <WorkStrip dark={!cs} />
      <NextRow label="Next project" href={`/case-studies/${next.slug}/`} title={next.title} />
      <ClosingCta />
    </>
  );
}

function NextRow({ label, href, title, num }: { label: string; href: string; title: string; num?: string }) {
  return (
    <section className="nd-white relative" aria-label={label}>
      <Rules />
      <div className="nd-wrap relative">
        <Link href={href} className="group nd-cell flex flex-col gap-4 border-t border-[color:var(--line-l)] py-[clamp(2.5rem,5vw,4rem)] sm:flex-row sm:items-center sm:justify-between">
          <span><Tag>{label}</Tag></span>
          <span className="inline-flex items-center gap-5 text-[clamp(1.6rem,3.6vw,3.25rem)] font-semibold tracking-[-0.045em] transition-colors duration-500 group-hover:text-[color:var(--royal)]">
            {num ? <span className="nd-label text-[color:var(--royal)]">{num}</span> : null}
            {title}
            <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--line-l)] transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white"><ArrowUR className="h-4 w-4" /></span>
          </span>
        </Link>
      </div>
    </section>
  );
}
