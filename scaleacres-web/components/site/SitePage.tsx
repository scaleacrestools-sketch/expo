import type { CSSProperties, ReactNode } from "react";
import { pageKind, plain, type LegacyPage, type LegacySection } from "@/lib/legacy";
import { Band, Cards, Flow, FormPanel, Gallery, findCards, sectionStats, splitHead, Html } from "@/components/site/Blocks";
import { Btn, ClosingCta, Hero, Section, StatRow, type Ground } from "@/components/site/Kit";
import { prepare, hasFaq, hasForm, imageShare, accentFor, type Prepared } from "@/components/site/compose";
import { Accordion } from "@/components/site/Accordion";
import { Tag, ArrowUR } from "@/components/nd/ui";
import { asButton } from "@/components/legacy/LegacyBlocks";
import Link from "next/link";
import { AboutPage, TeamPage, ContactPage, ServicesPage, WorkPage, CaseStudiesPage, CareersPage } from "@/components/site/pages/Company";
import { ArchivePage, PostPage } from "@/components/site/pages/Blog";
import { WorkStrip, ServiceVisual } from "@/components/site/Showcase";
import { CASES, CaseDetailPage } from "@/components/site/pages/Case";

/**
 * Every migrated scaleacres.com page, redesigned in the homepage design language. Content and
 * structure come verbatim from the live capture; templates only decide presentation per page type.
 */
export function SitePage({ page }: { page: LegacyPage }) {
  const kind = pageKind(page);
  const p = prepare(page);
  let body: ReactNode;
  if (CASES.some((c) => c.path === page.path)) body = <CaseDetailPage page={page} />;
  else if (kind === "post") body = <PostPage page={page} />;
  else if (kind === "archive") body = <ArchivePage page={page} />;
  else if (page.path === "/about-us/") body = <AboutPage page={page} p={p} />;
  else if (page.path === "/our-team/") body = <TeamPage page={page} p={p} />;
  else if (page.path === "/contact-us/") body = <ContactPage page={page} p={p} />;
  else if (page.path === "/our-services/") body = <ServicesPage page={page} p={p} />;
  else if (page.path === "/our-work/") body = <WorkPage page={page} p={p} />;
  else if (page.path === "/case-studies/") body = <CaseStudiesPage page={page} p={p} />;
  else if (page.path === "/careers/") body = <CareersPage page={page} p={p} />;
  else if (kind === "legal") body = <LegalPage page={page} p={p} />;
  else body = <ComposedPage page={page} p={p} kind={kind} />;
  return (
    <article data-legacy-path={page.path} data-kind={kind} className="nd-int">
      {page.canonical ? <link rel="canonical" href={page.canonical} /> : null}
      {body}
      {page.jsonld.map((raw, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: raw.replace(/<\/script/gi, "<\\/script") }} />
      ))}
    </article>
  );
}

export const crumbsFor = (page: LegacyPage) =>
  (page.breadcrumbs ?? []).map((c) => ({ label: plain(c.name), href: c.url ?? undefined }));

const TAG: Record<string, string> = { location: "Real estate marketing", service: "Services", case: "Case study", company: "ScaleAcres", work: "Our work", contact: "Contact", services: "Services" };

/** Section-by-section composition with alternating grounds and pattern-aware layouts. */
export function Sections({ sections, start = "white", label, skip = () => false, after }: { sections: LegacySection[]; start?: Ground; label?: string; skip?: (s: LegacySection, i: number) => boolean; after?: Record<number, ReactNode> }) {
  const formUsed = { v: false };
  let t: Ground = start === "mist" ? "white" : "mist";
  const out: ReactNode[] = [];
  sections.forEach((s, i) => {
    if (skip(s, i) || isEmpty(s)) return;
    const stats = sectionStats(s);
    const cta = ctaOf(s);
    if (cta) {
      out.push(<CtaStrip key={i} {...cta} />);
    } else if (hasFaq(s)) {
      out.push(<FaqBand key={i} s={s} />);
    } else if (stats.length >= 3 && stats.length <= 6 && s.blocks.length <= stats.length * 2 + 4) {
      out.push(<StatsBand key={i} s={s} stats={stats} />);
    } else if (hasForm(s) && !formUsed.v) {
      formUsed.v = true;
      out.push(<FormBand key={i} s={s} />);
    } else {
      t = t === "white" ? "mist" : "white";
      out.push(
        <Section key={i} tone={t}>
          <Band s={s} label={label} formUsed={formUsed} />
        </Section>,
      );
    }
    if (after?.[i]) out.push(<div key={`a${i}`}>{after[i]}</div>);
  });
  return <>{out}</>;
}

/** A section with nothing to read (a lone heading, decorative shapes, slider controls). */
export const isEmpty = (s: LegacySection) =>
  s.blocks.every((b) => (b.type === "image" && /\.svg$/i.test(b.src) && !/logo/i.test(b.src)) || (b.type === "paragraph" && plain(b.html).replace(/[\s\u200b]/g, "").length === 0) || (b.type === "paragraph" && /^(previous|next)$/i.test(plain(b.html).trim()))) ||
  (s.blocks.length === 1 && s.blocks[0].type === "heading");

/** A short call-to-action section (one line of copy and a button) from the live page. */
export function ctaOf(s: LegacySection) {
  if (s.blocks.length > 4) return null;
  const btn = s.blocks.map(asButton).find(Boolean);
  const heads = s.blocks.filter((b) => b.type === "heading").map((b) => plain((b as { html: string }).html).trim());
  const others = s.blocks.filter((b) => b.type !== "heading" && !asButton(b));
  if (!btn || !heads.length || others.length) return null;
  // the live page sometimes repeats the same line twice (desktop and mobile copies)
  const norm = (t: string) => t.replace(/\s+/g, " ").toLowerCase();
  const uniq = heads.filter((h, i) => heads.findIndex((x) => norm(x) === norm(h)) === i);
  return { text: uniq[0], href: btn.href.replace(/^#elementor.*/, "/contact-us/"), label: btn.text };
}

export function CtaStrip({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <section className="nd-white relative border-y border-[color:var(--line-l)]" aria-label={label}>
      <div className="nd-wrap relative">
        <Link href={href} className="group nd-cell flex flex-col gap-5 py-[clamp(2rem,4vw,3rem)] md:flex-row md:items-center md:justify-between">
          <span data-nd="up" className="max-w-[46rem] text-[clamp(1.5rem,2.6vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.035em] transition-colors duration-500 group-hover:text-[color:var(--royal)]">{text}</span>
          <span data-nd="up" className="nd-btn nd-btn--royal shrink-0">{label} <ArrowUR /></span>
        </Link>
      </div>
    </section>
  );
}

/** FAQ: heading and intro on the left, the homepage accordion on the right (white). */
export function FaqBand({ s, dark = false }: { s: LegacySection; dark?: boolean }) {
  const { kicker, title, rest } = splitHead(s.blocks);
  const faq = rest.find((b) => b.type === "faq");
  const intro = rest.filter((b) => b.type === "paragraph");
  return (
    <Section tone={dark ? "dark" : "white"} label="FAQ">
      <div className="nd-grid gap-y-10">
        <div className="nd-cell lg:sticky lg:top-28 lg:self-start">
          <div data-nd="up"><Tag>{kicker ? plain(kicker.html) : "FAQ"}</Tag></div>
          {title ? <Html as="h2" html={title.html} className="mt-7 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]" /> : null}
          {intro.length ? <div className="mt-6 max-w-[26rem]"><Flow blocks={intro} dark={dark} /></div> : null}
        </div>
        <div className="nd-cell lg:col-span-2">
          {faq && faq.type === "faq" ? <Accordion dark={dark} items={faq.items.map((f) => ({ q: plain(f.q), a: <Flow blocks={f.answer} dark={dark} /> }))} /> : null}
        </div>
      </div>
    </Section>
  );
}

function StatsBand({ s, stats }: { s: LegacySection; stats: { value: string; label: string }[] }) {
  const rest = s.blocks.filter((b, i) => !(b.type === "stat") && !(b.type === "heading" && stats.some((x) => x.value === plain(b.html))) && !(b.type === "paragraph" && i > 0 && s.blocks[i - 1].type === "heading" && stats.some((x) => x.value === plain((s.blocks[i - 1] as { html: string }).html))));
  return (
    <Section tone="dark" label="In numbers">
      {rest.length ? <Band s={{ ...s, blocks: rest }} dark /> : null}
      <div className="nd-cell mt-12"><StatRow dark stats={stats} /></div>
    </Section>
  );
}

function FormBand({ s }: { s: LegacySection }) {
  const { kicker, title, rest } = splitHead(s.blocks);
  const text = rest.filter((b) => b.type !== "form" && b.type !== "image");
  const imgs = rest.filter((b) => b.type === "image");
  return (
    <Section tone="paper" id="enquiry-band" label="Enquiry">
      <div className="nd-grid gap-y-10">
        <div className="nd-cell">
          <div data-nd="up"><Tag>{kicker ? plain(kicker.html) : "Enquire now"}</Tag></div>
          {title ? <Html as="h2" html={title.html} className="mt-7 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]" /> : null}
          {text.length ? <div className="mt-6"><Flow blocks={text} /></div> : null}
          {imgs.length >= 4 ? <div className="mt-10"><Gallery images={imgs as never} /></div> : null}
        </div>
        <div className="nd-cell lg:col-span-2" data-nd="up"><FormPanel /></div>
      </div>
    </Section>
  );
}

/** Service, location and other content pages. */
function ComposedPage({ page, p, kind }: { page: LegacyPage; p: Prepared; kind: string }) {
  const tag = TAG[kind] ?? "ScaleAcres";
  return (
    <>
      <Hero
        tag={tag}
        title={p.h1}
        accent={accentFor(p.h1)}
        crumbs={crumbsFor(page)}
        lead={p.leadHtml ? <Html as="p" html={p.leadHtml} /> : undefined}
        actions={<>{p.actions.map((a, i) => <Btn key={i} href={a.href.replace(/^#elementor.*/, "/contact-us/")} variant={i ? "white" : "royal"}>{a.text}</Btn>)}{p.actions.length ? null : <Btn href="/contact-us/">Book a call</Btn>}</>}
        media={kind === "service" ? <ServiceVisual path={page.path} /> : undefined}
      />
      <Sections sections={p.sections} label={tag} />
      <WorkStrip />
      <ClosingCta />
    </>
  );
}

function LegalPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const blocks = p.sections.flatMap((s) => s.blocks);
  return (
    <>
      <Hero tag="Legal" title={p.h1} crumbs={crumbsFor(page)} tone="white" />
      <Section tone="white" pad="tight">
        <div className="nd-grid"><div className="nd-cell lg:col-span-2 lg:col-start-2"><div className="nd-article"><Flow blocks={blocks} /></div></div></div>
      </Section>
    </>
  );
}

export { Cards, findCards, imageShare };
export const style = (d: number) => ({ "--d": d }) as CSSProperties;
