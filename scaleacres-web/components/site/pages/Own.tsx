import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { services, getService, serviceHref } from "@/content/services";
import { ndServiceCards } from "@/content/nd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Btn, ClosingCta, Head, Hero, Section } from "@/components/site/Kit";
import { WorkStrip } from "@/components/site/Showcase";
import { StudioLibrary } from "@/components/site/Studio";
import { ServiceArt, StudioArt, BlogArt } from "@/components/site/heroes";
import { PostTile, type PostCard } from "@/components/site/pages/Blog";
import { ArrowUR, Rules, Tag } from "@/components/nd/ui";
import { NdServices } from "@/components/nd/NdServices";
import { NdTestimonials } from "@/components/nd/NdTestimonials";

/** Pages with their own routes (not from the WordPress capture), in the homepage design language. */

const d = (ms: number) => ({ "--d": ms }) as CSSProperties;

/* ------------------------------------------------------------------ creative studio */

export function CreativeStudioPage() {
  return (
    <div className="nd-int">
      <Hero
        tag="The creative lab"
        title="Made to be seen."
        accent={["seen."]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Creative Studio" }]}
        lead={<p>Ideas don&apos;t have to stay on paper. We turn concepts into compelling visual stories through creative production, AI-powered content and videos that get noticed.</p>}
        actions={<><Btn href="#ad-videos" variant="white">Ad videos</Btn><Btn href="#social-media-videos" variant="white">Social videos</Btn><Btn href="#ai-videos" variant="white">AI videos</Btn></>}
        art={<StudioArt />}
      />
      <StudioLibrary />
      <WorkStrip title="Creative that sells projects." />
      <ClosingCta />
    </div>
  );
}

/* ------------------------------------------------------------------ insights */

export function InsightsPage({ posts }: { posts: PostCard[] }) {
  return (
    <div className="nd-int">
      <Hero
        tag="Thinking out loud"
        title="Ideas worth exploring."
        accent={["exploring."]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        lead={<p>Our latest articles live on the ScaleAcres blog, which continues at its existing address so nothing you&apos;ve bookmarked or found in search goes missing.</p>}
        actions={<Btn href="/blog/" variant="white">Read the blog</Btn>}
        art={<BlogArt posts={posts} />}
      />
      <Section tone="white" label="Latest articles">
        <Head tag="Latest" title="From the blog." accent={["blog."]} />
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-14 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((c, i) => <PostTile key={c.path} c={c} i={i} />)}
        </div>
        <div className="nd-cell mt-12 flex justify-center" data-nd="up"><Btn href="/blog/" variant="ink">All articles</Btn></div>
      </Section>
      <ClosingCta />
    </div>
  );
}

/* ------------------------------------------------------------------ service (new /services/<slug>/ URLs) */

export function ServiceDetail({ slug }: { slug: string }) {
  const s = getService(slug);
  if (!s) notFound();
  const card = ndServiceCards.find((c) => c.slug === s.slug);
  const next = services[(services.indexOf(s) + 1) % services.length];
  return (
    <div className="nd-int">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Services", path: "/our-services/" }, { name: s.title, path: serviceHref(s) }])) }} />
      <Hero
        tag={`${s.number} · ${s.title}`}
        title={s.headline}
        accent={[s.headline.split(" ").slice(-1)[0]]}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/our-services/" }, { label: s.title }]}
        lead={<p>{s.description}</p>}
        actions={<><Btn href="/contact-us/">{s.ctaLabel.replace(/^Explore/, "Talk about")}</Btn><Btn href="#included" variant="white">What&apos;s included</Btn></>}
        art={<ServiceArt slug={s.slug} />}
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
    </div>
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
