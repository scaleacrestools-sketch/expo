import type { ReactNode } from "react";
import { media, plain, type Block, type LegacyPage } from "@/lib/legacy";
import { site } from "@/content/site";
import { liveFooterFacts } from "@/content/legacy-nav";
import { Reveal } from "@/components/ui/Reveal";
import { Rail } from "@/components/legacy/Rail";
import { Testimonials } from "@/components/Testimonials";
import { Buttons, Faq, FormSlot, Html, Img, ListEl, Para, asButton, type FormCounter } from "@/components/legacy/LegacyBlocks";
import { parseProjects, ProjectMeta, type Project } from "@/components/legacy/Composer";
import { DelhiHero } from "@/components/delhi/DelhiHero";
import { POSTER } from "@/components/delhi/media";
import { CapabilityPanels, CountUp, FilmMoment, FunnelProgress, ImageReveal, ScrollWords, ServiceMarquee, TrackingTitle, type Capability } from "@/components/delhi/motion";
import { showreel, posterForSrc } from "@/content/media";

/**
 * REAL ESTATE MARKETING DELHI — proposed master city page (awaiting approval).
 * Every block of the live page is rendered exactly once, in its original heading tag and wording;
 * only the composition is new. Design labels added here are plain text, never headings.
 */

type H = Extract<Block, { type: "heading" }>;
type I = Extract<Block, { type: "image" }>;
type P = Extract<Block, { type: "paragraph" }>;
const isH = (b: Block): b is H => b.type === "heading";
const isImg = (b: Block): b is I => b.type === "image";
const isPara = (b: Block): b is P => b.type === "paragraph" && !asButton(b);
const btns = (bs: Block[]) => bs.map(asButton).filter(Boolean) as { href: string; text: string }[];

/** Original heading (tag and inline HTML untouched), styled by role. */
function Hd({ b, className = "", split = false }: { b: H; className?: string; split?: boolean }) {
  return <Html as={`h${b.level}`} html={b.html} className={`legacy-h text-balance ${className}`} {...(split ? { "data-split-reveal": "" } : {})} />;
}
const DISPLAY = "text-[clamp(2.5rem,1rem+4.6vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]";
const TITLE = "text-[clamp(2rem,1rem+3vw,4.25rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]";
const KICKER = "text-[0.8125rem] font-semibold uppercase tracking-[0.22em]";

function Label({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? "text-sky" : "text-blue"}`} data-reveal>{children}</p>;
}

function Copy({ blocks, dark = false, lead = false }: { blocks: Block[]; dark?: boolean; lead?: boolean }) {
  return (
    <div className="max-w-[62ch] space-y-5" data-reveal>
      {blocks.map((b, i) => (isPara(b) ? <Para key={i} html={b.html} tone={dark ? "dark" : "light"} lead={lead && i === 0} /> : b.type === "list" ? <ListEl key={i} b={b} tone={dark ? "dark" : "light"} /> : null))}
    </div>
  );
}

/** A captured image inside a masked-reveal frame. */
function Shot({ img, ratio, className = "", parallax = 0, fit = "cover" }: { img: I; ratio?: string; className?: string; parallax?: number; fit?: "cover" | "contain" }) {
  return (
    <ImageReveal className={`${ratio ?? ""} ${className}`} parallax={parallax}>
      <div data-media className="h-full w-full">
        <Img img={img} className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`} />
      </div>
    </ImageReveal>
  );
}

/** Website capture in a browser frame; hovering scrolls the full page from top to bottom. */
function BrowserShot({ p, tall = false }: { p: Project; tall?: boolean }) {
  if (!p.shot) return null;
  return (
    <div className="overflow-hidden rounded-[14px] border border-white/10 bg-white shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-offwhite px-4 py-2.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-ink/15" /><span className="h-2 w-2 rounded-full bg-ink/15" /><span className="h-2 w-2 rounded-full bg-ink/15" />
      </div>
      <div className={`relative overflow-hidden ${tall ? "aspect-[4/5] lg:aspect-[16/12]" : "aspect-[4/5]"}`}>
        <Img img={p.shot} className="absolute inset-0 h-full w-full object-cover object-top transition-[object-position] duration-[5000ms] ease-in-out group-hover:object-bottom" />
      </div>
    </div>
  );
}

/** Logo sized by area, not width, so wide and square marks read at the same optical weight. */
function OpticalLogo({ img }: { img: I }) {
  const ar = Math.max(0.6, (img.width ?? 1) / (img.height ?? 1));
  return (
    <div style={{ height: `${Math.round(Math.min(58, Math.sqrt(3400 / ar)))}px` }} className="flex w-full items-center justify-center">
      <Img img={img} className="h-full w-auto max-w-full object-contain opacity-75 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0" />
    </div>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <Reveal as="section" id={id} className={`relative isolate overflow-hidden ${className}`}>
      <div className="container-x mx-auto max-w-[120rem]">{children}</div>
    </Reveal>
  );
}

export function DelhiPage({ page, form }: { page: LegacyPage; form: FormCounter }) {
  const S = page.sections.map((s) => s.blocks);

  /* 00 · hero + logo wall + form (live section 0) */
  const s0 = S[0];
  const h1 = s0.find((b) => isH(b) && b.level === 1) as H;
  const sub = s0[s0.indexOf(h1) + 1] as H;
  const heroCta = btns(s0)[0] ?? null;
  const trust = s0.find((b) => isImg(b) && (b.width ?? 0) < 400 && /team/i.test(b.alt ?? "")) as I | undefined;
  const logoTitle = s0.find((b) => isH(b) && /brands globally/i.test(b.text)) as H;
  const formTitle = s0.find((b) => isH(b) && /enquire/i.test(b.text)) as H;
  const formBlock = s0.find((b) => b.type === "form")!;
  const logos = s0.filter((b) => isImg(b) && b !== trust) as I[];

  /* live sections by content */
  const [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18] = S.slice(1);
  const work = parseProjects(s10);
  const shots = work.projects.filter((p) => p.shot);
  const marks = work.projects.filter((p) => !p.shot);
  const branding = s3.filter(isImg);
  const creatives = s17.filter(isImg);
  const results = s9.filter(isImg);

  // Capability index: the eight capabilities the page's own content covers, each pointing to where it is shown.
  const imgBy = (re: RegExp, from: Block[]) => (from.find((b) => isImg(b) && re.test(b.src)) as I | undefined) ?? (from.find(isImg) as I);
  const cap = (title: string, href: string, img: I, note: string): Capability => ({ title, href, note, img: { src: media(img.src), alt: "" } });
  // Each note quotes this page's own copy for that capability.
  const capabilities: Capability[] = [
    cap("Real Estate Lead Generation", "#delhi-funnel", imgBy(/meta-ads/i, results), "Verified, high-intent leads using Google Ads, Facebook campaigns, WhatsApp automation, and CRM-integrated workflows."),
    cap("Performance Marketing", "#delhi-results", imgBy(/2026\/06\/Google/i, results), "Strategies that turn clicks into site visits, boost ROI, and convert interest into confirmed bookings."),
    cap("Google & Meta Ads", "#delhi-results", imgBy(/2026\/08\/Google/i, results), "High-Intent Meta & Google Campaigns."),
    cap("SEO & Organic Visibility", "#delhi-seo", imgBy(/seo-result/i, results), "Hyperlocal SEO for Market Domination."),
    cap("Developer Branding", "#delhi-work", branding[1] ?? branding[0], "Strategic branding, premium design, and compelling storytelling."),
    cap("Property Launch Campaigns", "#delhi-work", branding[0], "Creative Ads That Drive Closures."),
    cap("Website & Landing Page Development", "#delhi-websites", (shots[0]?.shot ?? branding[2]) as I, "High-Converting Landing Pages & Microsites."),
    cap("Video & Social Media Creative", "#delhi-creative", creatives[0] ?? branding[3], "Engaging visuals and campaigns that inspire, influence, and drive results across digital platforms."),
  ];

  const ticker = (s6.find((b) => b.type === "list") as Extract<Block, { type: "list" }> | undefined)?.items.map(plain) ?? [];
  const stat = s2.find((b) => b.type === "stat") as Extract<Block, { type: "stat" }> | undefined;

  return (
    <>
      {/* 01 · CINEMATIC HERO — no form */}
      <DelhiHero
        h1={h1.text}
        sub={{ level: sub.level, text: sub.text }}
        cta={heroCta}
        trust={trust ? { src: media(trust.src), alt: trust.alt ?? "", width: trust.width, height: trust.height } : undefined}
        crumbs={(page.breadcrumbs ?? []).map((c) => ({ name: plain(c.name), url: c.url ?? undefined }))}
        ticker={ticker.length ? ticker : ["Real Estate Marketing", "Lead Generation", "Branding", "Performance Ads"]}
      />

      {/* 02 · EDITORIAL INTRODUCTION (live section 2) */}
      <Section id="delhi-intro" className="bg-offwhite py-[clamp(6rem,12vw,11rem)] text-ink">
        <div className="mx-auto max-w-[80rem]">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            {s2.filter(isH).slice(0, 1).map((h, i) => <Hd key={i} b={h} className={`${KICKER} text-blue`} />)}
            <p className="label text-steel" data-reveal>Delhi NCR · Builders &amp; developers</p>
          </div>
          {s2.filter(isH).slice(1).map((h, i) => <Hd key={i} b={h} split className={`mt-8 max-w-[18ch] ${DISPLAY}`} />)}
          {s2.filter(isPara).map((b, i) => (
            <ScrollWords key={i} html={b.html} className="mt-[clamp(2.5rem,5vw,4.5rem)] text-[clamp(1.5rem,0.9rem+2vw,2.875rem)] leading-[1.28] tracking-[-0.015em]" />
          ))}
          <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 border-t border-line pt-10 md:grid-cols-12 md:items-end">
            {stat ? (
              <div className="md:col-span-7">
                <CountUp value={stat.value} className="text-[clamp(4.5rem,2rem+8vw,10rem)] font-black leading-[0.85] tracking-[-0.06em] text-blue" />
                <p className="mt-4 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-steel">{stat.label}</p>
              </div>
            ) : null}
            <div className="md:col-span-5 md:justify-self-end" data-reveal><Buttons buttons={btns(s2)} tone="light" /></div>
          </div>
        </div>
      </Section>

      {/* 02b · FILM MOMENT — the homepage showreel opens to full bleed through the city line */}
      <FilmMoment src={showreel[0].landscape} poster={posterForSrc(showreel[0].landscape) ?? POSTER.landscape} line="Delhi NCR" caption={`ScaleAcres showreel · ${showreel[0].title}`} />

      {/* 03 · WHAT WE DELIVER — expanding capability panels */}
      <Section className="bg-white py-[clamp(6rem,11vw,10rem)] text-ink">
        <TrackingTitle className="text-[min(9.2vw,10rem)] text-ink/[0.08]">What we deliver</TrackingTitle>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Label>Capabilities in Delhi NCR</Label>
          </div>
          <p className="max-w-[44ch] text-[length:var(--fs-body)] leading-[1.7] text-steel lg:col-span-6 lg:justify-self-end" data-reveal>
            Eight disciplines under one roof. Open a capability to see real work, then jump straight to it on this page.
          </p>
        </div>
        <div className="mt-12" data-reveal><CapabilityPanels items={capabilities} /></div>
      </Section>

      {/* 04 · CLIENT BRANDS (logo wall from live section 0) */}
      <Section className="bg-offwhite py-[clamp(5rem,9vw,8rem)] text-ink">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>Client brands</Label>
            <Hd b={logoTitle} split className={`mt-6 ${TITLE}`} />
          </div>
        </div>
        <ul role="list" className="mt-12 grid grid-cols-3 border-l border-t border-line bg-white sm:grid-cols-4 lg:grid-cols-6" data-reveal>
          {logos.map((im, i) => (
            <li key={i} className="group grid aspect-[3/2] place-items-center border-b border-r border-line p-4 sm:p-6">
              <OpticalLogo img={im} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 05 · OUR REAL ESTATE WORK (live sections 3, 10, 17) */}
      <section id="delhi-work" className="on-dark relative isolate overflow-hidden bg-ink py-[clamp(6rem,11vw,10rem)] text-white">
        <div className="container-x mx-auto max-w-[120rem]">
          <Reveal>
            <TrackingTitle className="text-[min(9.2vw,10rem)] text-white/[0.08]">Our work</TrackingTitle>
            <div className="mt-[-0.3em] grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Label dark>Branding &amp; campaigns</Label>
                {s3.filter(isH).map((h, i) => <Hd key={i} b={h} split className={`mt-6 ${TITLE}`} />)}
              </div>
              <div className="lg:col-span-5"><Copy blocks={s3} dark lead /></div>
            </div>
          </Reveal>

          {/* Featured campaign, then an alternating two-column editorial gallery */}
          {branding[0] ? <Shot img={branding[0]} className="mt-14 aspect-[16/9]" parallax={6} /> : null}
          {/* Desktop: alternating 7/5 rows. Phones: two-up with every third image full width. */}
          <ul role="list" className="mt-3 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-12 md:gap-5">
            {branding.slice(1).map((im, i) => {
              const row = Math.floor(i / 2);
              const wideFirst = row % 2 === 0;
              const wide = (i % 2 === 0) === wideFirst;
              const last = i === branding.length - 2 && i % 2 === 0;
              return (
                <li key={i} className={`${i % 3 === 0 ? "col-span-2" : ""} ${last ? "md:col-span-12" : wide ? "md:col-span-7" : "md:col-span-5"}`}>
                  <Shot img={im} className={`${i % 3 === 0 ? "h-[52vw]" : "h-[40vw]"} md:h-[clamp(14rem,32vw,30rem)]`} />
                </li>
              );
            })}
          </ul>

          {/* Website development */}
          <Reveal id="delhi-websites" className="mt-[clamp(6rem,10vw,9rem)] scroll-mt-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Label dark>Website development</Label>
                {work.head.filter(isH).map((h, i) => <Hd key={i} b={h} split className={`mt-6 ${TITLE}`} />)}
              </div>
              <div className="lg:col-span-5"><Copy blocks={work.head} dark lead /></div>
            </div>
          </Reveal>
          <Reveal>
            <ul role="list" className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-12">
              {shots.slice(0, 6).map((p, i) => (
                <li key={i} className={`group ${i < 2 ? "col-span-2 lg:col-span-6" : "lg:col-span-3"}`} data-reveal>
                  <BrowserShot p={p} tall={i < 2} />
                  <ProjectMeta p={p} />
                </li>
              ))}
            </ul>
          </Reveal>
          {shots.length > 6 ? (
            <div className="mt-20">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-white/60">More websites · {shots.length - 6}</p>
              <div className="mt-2">
                <Rail label="more websites" tone="dark">
                  {shots.slice(6).map((p, i) => (
                    <li key={i} className="group w-[64vw] max-w-[17rem] shrink-0 snap-start">
                      <BrowserShot p={p} />
                      <ProjectMeta p={p} />
                    </li>
                  ))}
                </Rail>
              </div>
            </div>
          ) : null}
          {marks.length ? (
            <ul role="list" className="mt-10 flex flex-wrap items-center gap-3">
              {marks.map((p, i) => (
                <li key={i} className="flex items-center gap-4 rounded-[12px] border border-white/10 px-4 py-3">
                  {p.logo ? <span className="grid h-10 place-items-center rounded-[8px] bg-white px-2"><Img img={p.logo} className="max-h-7 w-auto max-w-[6rem] object-contain" /></span> : null}
                  {p.meta.map((m, j) => <Hd key={j} b={m} className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] opacity-70" />)}
                </li>
              ))}
            </ul>
          ) : null}
          {btns([...work.head, ...work.tail]).length ? <div className="mt-12"><Buttons buttons={btns([...work.head, ...work.tail])} tone="dark" /></div> : null}

          {/* Creative magic */}
          <Reveal id="delhi-creative" className="mt-[clamp(6rem,10vw,9rem)] scroll-mt-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Label dark>Social &amp; campaign creative</Label>
                {s17.filter(isH).map((h, i) => <Hd key={i} b={h} split className={`mt-6 ${TITLE}`} />)}
              </div>
              <div className="lg:col-span-5"><Copy blocks={s17} dark lead /></div>
            </div>
          </Reveal>
          <ul role="list" className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {creatives.map((im, i) => {
              const landscape = (im.width ?? 0) > (im.height ?? 0) * 1.2;
              return (
                <li key={i} className={i % 2 ? "lg:translate-y-14" : ""}>
                  <ImageReveal className="aspect-[4/5] bg-white/5" parallax={i % 2 ? 4 : 0}>
                    <div data-media className="h-full w-full">
                      <Img img={im} className={`h-full w-full ${landscape ? "object-contain" : "object-cover"}`} />
                    </div>
                  </ImageReveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 06 · MARKETING FUNNEL (live sections 5–8) */}
      <section id="delhi-funnel" className="on-dark relative isolate overflow-hidden bg-navy py-[clamp(6rem,11vw,10rem)] text-white">
        <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.16),transparent)]" />
        <div className="container-x mx-auto max-w-[120rem]">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="space-y-6 lg:col-span-8">
              {s5.filter(isH).slice(0, 1).map((h, i) => <Hd key={i} b={h} className={`${KICKER} text-sky`} />)}
              {s5.filter(isH).slice(1).map((h, i) => <Hd key={i} b={h} split className={TITLE} />)}
            </div>
            <div className="lg:col-span-4"><Copy blocks={s5} dark lead /></div>
          </Reveal>
          <FunnelProgress>
            <span aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-0 hidden w-px bg-white/10 md:block" />
            <span aria-hidden="true" data-progress className="absolute bottom-0 left-[1.15rem] top-0 hidden w-px origin-top bg-sky md:block" />
            <ol className="mt-16 space-y-[clamp(4rem,8vw,7rem)] lg:mt-24">
              {[s6, s7].map((st, i) => {
                const imgs = st.filter(isImg);
                const text = st.filter((x) => !isImg(x));
                return (
                  <li key={i} className="grid gap-10 md:grid-cols-[3rem_1fr] md:gap-12">
                    <span aria-hidden="true" className="relative z-[1] hidden h-9 w-9 place-items-center rounded-full border border-sky bg-navy text-[0.75rem] font-bold text-sky md:grid">{String(i + 1).padStart(2, "0")}</span>
                    <Reveal className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                      <div className={`space-y-6 lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                        <p aria-hidden="true" className="text-[clamp(3.5rem,2rem+4vw,6rem)] font-black leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgba(56,189,248,0.7)]">{String(i + 1).padStart(2, "0")}</p>
                        {text.filter(isH).map((h, j) => <Hd key={j} b={h} split className="text-[clamp(1.75rem,1rem+2vw,3rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]" />)}
                        <Copy blocks={text} dark />
                      </div>
                      <div className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                        {imgs.map((im, j) => <Shot key={j} img={im} className="bg-white/5" fit="contain" />)}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </FunnelProgress>
          <div className="mt-16"><Buttons buttons={btns(s8)} tone="dark" /></div>
        </div>
      </section>

      {/* 07 · PROVEN WORK & CASE STUDIES (live sections 9 and 4) */}
      <Section id="delhi-results" className="scroll-mt-20 bg-white py-[clamp(6rem,11vw,10rem)] text-ink">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Label>Proven work</Label>
            {s9.filter(isH).map((h, i) => <Hd key={i} b={h} split className={`mt-6 ${TITLE}`} />)}
          </div>
          <div className="lg:col-span-6"><Copy blocks={s9} lead /></div>
        </div>
        <ul role="list" className="mt-14 grid gap-6 md:grid-cols-2">
          {results.map((im, i) => (
            <li key={i} className="rounded-[18px] border border-line bg-offwhite p-3 shadow-[0_30px_80px_-50px_rgba(11,22,64,0.45)]">
              <div className="mb-3 flex gap-1.5 px-1" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-ink/15" /><span className="h-2 w-2 rounded-full bg-ink/15" /><span className="h-2 w-2 rounded-full bg-ink/15" /></div>
              <Shot img={im} className="rounded-[12px]" fit="contain" />
            </li>
          ))}
        </ul>

        {/* Live campaign snapshots (headings kept exactly as published; see the location note in the report) */}
        <div className="mt-[clamp(5rem,9vw,8rem)] grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-6">
            {s4.filter(isH).filter((h) => h.level <= 5).map((h, i) => (
              <Hd key={i} b={h} className={h.level === 5 ? `${KICKER} text-blue` : i === 0 ? "text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-bold leading-tight" : TITLE} />
            ))}
            <div className="flex gap-3" data-reveal>{s4.filter((b) => isImg(b) && (b.width ?? 0) < 300 && !/Mask|Rectangle/i.test(b.alt ?? "")).map((im, i) => <Img key={i} img={im as I} className="h-10 w-10" />)}</div>
            <Copy blocks={s4.slice(0, s4.findIndex((b) => isH(b) && b.level === 6))} lead />
            <div data-reveal><Buttons buttons={btns(s4)} tone="light" /></div>
          </div>
          <div className="lg:col-span-6">
            <div className="on-dark rounded-[22px] bg-ink p-6 text-white md:p-8" data-reveal>
              <p className="eyebrow text-sky">Campaign status</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {(() => {
                  const start = s4.findIndex((b) => isH(b) && b.level === 6);
                  const rest = s4.slice(start - 1).filter((b) => !(isImg(b) && (b.width ?? 0) < 300 && !/Mask|Rectangle/i.test(b.alt ?? "")));
                  const cards: Block[][] = [];
                  rest.forEach((b) => (isImg(b) || !cards.length ? cards.push([b]) : cards[cards.length - 1].push(b)));
                  return cards.map((c, i) => (
                    <div key={i} className="overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.03]">
                      {c.filter(isImg).map((im, j) => <Img key={j} img={im} className="aspect-[16/10] w-full object-cover" />)}
                      <div className="space-y-2 p-5">
                        {c.filter(isH).map((h, j) => <Hd key={j} b={h} className={j === 0 ? "text-[1rem] font-bold" : "text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white/60"} />)}
                        {c.filter((b) => b.type === "list").map((l, j) => <ListEl key={j} b={l as Extract<Block, { type: "list" }>} tone="dark" />)}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 08 · OUR APPROACH (live section 15) */}
      <section className="on-dark relative isolate overflow-hidden bg-ink py-[clamp(6rem,11vw,10rem)] text-white">
        <div className="container-x mx-auto max-w-[120rem]">
          <Reveal>
            <TrackingTitle className="text-[min(9.2vw,10rem)] text-white/[0.08]">Our approach</TrackingTitle>
          </Reveal>
          <div className="mt-[-0.2em] grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Label dark>How we work in Delhi</Label>
                {s15.filter((h) => isH(h) && h.level <= 3).map((h, i) => <Hd key={i} b={h as H} split className={`mt-6 ${TITLE}`} />)}
              </div>
            </Reveal>
            <ol className="lg:col-span-7">
              {(() => {
                const rows: { h: H; body: Block[] }[] = [];
                s15.filter((b) => !(isH(b) && b.level <= 3)).forEach((b) => (isH(b) ? rows.push({ h: b, body: [] }) : rows[rows.length - 1]?.body.push(b)));
                return rows.map((r, i) => (
                  <li key={i} className="group border-t border-white/12 py-[clamp(2.5rem,5vw,4rem)]">
                    <Reveal className="grid gap-6 md:grid-cols-[6rem_1fr] md:gap-10">
                      <p aria-hidden="true" className="text-[clamp(3rem,1.5rem+3vw,5rem)] font-black leading-none tracking-[-0.05em] text-transparent transition-colors duration-700 [-webkit-text-stroke:1.5px_rgba(56,189,248,0.6)] group-hover:text-sky">{String(i + 1).padStart(2, "0")}</p>
                      <div className="space-y-5">
                        <Hd b={r.h} split className="text-[clamp(1.75rem,1rem+2vw,3.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]" />
                        <Copy blocks={r.body} dark lead />
                      </div>
                    </Reveal>
                  </li>
                ));
              })()}
            </ol>
          </div>
        </div>
      </section>

      {/* 09 · CLIENT EXPERIENCES (live section 1 + the four published client video testimonials) */}
      <Section className="bg-offwhite pt-[clamp(6rem,11vw,10rem)] text-ink">
        <Label>Client experiences</Label>
        <p className={`mt-6 max-w-[18ch] ${TITLE}`} data-reveal>The founders we grow with.</p>
        <div className="mt-10">
          <Rail label="client founders" tone="light">
            {(() => {
              const cards: { photo?: I; name: H; logo?: I }[] = [];
              let pending: I | undefined;
              s1.forEach((b) => {
                if (isImg(b)) {
                  const last = cards[cards.length - 1];
                  const logo = (b.width ?? 0) > (b.height ?? 1) * 1.15 && (b.height ?? 0) < 300;
                  if (last && !last.logo && logo) last.logo = b;
                  else pending = b;
                } else if (isH(b)) { cards.push({ photo: pending, name: b }); pending = undefined; }
              });
              return cards.map((c, i) => (
                <li key={i} className="w-[72vw] max-w-[19rem] shrink-0 snap-start">
                  <article className="group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_-40px_rgba(11,13,13,0.35)]">
                    {c.photo ? <div className="aspect-[4/3] overflow-hidden"><Img img={c.photo} className="h-full w-full object-cover transition-[scale] duration-[1400ms] ease-out-expo group-hover:scale-[1.04]" /></div> : null}
                    <div className="flex flex-1 items-end justify-between gap-4 p-6">
                      <Html as={`h${c.name.level}`} html={c.name.html} className="legacy-h legacy-person text-[0.9375rem] leading-snug" />
                      {c.logo ? <Img img={c.logo} className="h-8 w-auto max-w-[7rem] object-contain opacity-80" /> : null}
                    </div>
                  </article>
                </li>
              ));
            })()}
          </Rail>
        </div>
      </Section>
      <Testimonials titleAs="p" />

      {/* 10 · AWARDS, TEAM & BRAND TRUST (live sections 12, 13, 11) */}
      <Section className="bg-white py-[clamp(6rem,11vw,10rem)] text-ink">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">{s12.filter(isImg).map((im, i) => <Shot key={i} img={im} className="aspect-[16/10]" parallax={5} />)}</div>
          <div className="space-y-6 lg:col-span-5">
            {s12.filter(isH).map((h, i) => <Hd key={i} b={h} className={i === 0 ? `${KICKER} text-blue` : TITLE} split={i > 0} />)}
            <Copy blocks={s12} lead />
            <div data-reveal><Buttons buttons={btns(s12)} tone="light" /></div>
          </div>
        </div>
        <div className="mt-[clamp(5rem,9vw,8rem)] grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-32">
              {s13.filter(isH).map((h, i) => <Hd key={i} b={h} split className={TITLE} />)}
              <Copy blocks={s13} />
              <div data-reveal><Buttons buttons={btns(s13)} tone="light" /></div>
            </div>
          </div>
          <ul role="list" className="columns-2 gap-3 space-y-3 md:gap-4 md:space-y-4 lg:col-span-8">
            {s13.filter(isImg).map((im, i) => (
              <li key={i} className="break-inside-avoid"><Shot img={im} /></li>
            ))}
          </ul>
        </div>
        <div className="mt-[clamp(5rem,9vw,8rem)]">
          {s11.filter(isH).map((h, i) => <Hd key={i} b={h} className={i === 0 ? `${KICKER} text-blue` : `mt-5 ${TITLE}`} split={i > 0} />)}
          {(() => {
            const imgs = s11.filter(isImg);
            const wide = imgs.find((x) => (x.width ?? 0) >= (x.height ?? 0));
            const tall = imgs.find((x) => x !== wide);
            return (
              <div className="mt-12">
                {wide ? <div className={tall ? "hidden md:block" : ""}><Img img={wide} className="h-auto w-full rounded-[18px]" /></div> : null}
                {tall ? <div className={wide ? "md:hidden" : ""}><Img img={tall} className="h-auto w-full rounded-[18px]" /></div> : null}
              </div>
            );
          })()}
        </div>
      </Section>

      {/* 11 · DELHI NCR — the city-specific editorial content (live sections 14 and 16) */}
      <Section id="delhi-seo" className="scroll-mt-20 bg-offwhite py-[clamp(6rem,11vw,10rem)] text-ink">
        {[s14, s16].map((sec, i) => {
          const img = sec.find(isImg);
          return (
            <div key={i} className={`grid items-center gap-12 lg:grid-cols-12 lg:gap-20 ${i ? "mt-[clamp(5rem,9vw,8rem)]" : ""}`}>
              <div className={`space-y-7 lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                <Label>Delhi NCR</Label>
                {sec.filter(isH).map((h, j) => <Hd key={j} b={h} split className={TITLE} />)}
                <Copy blocks={sec} lead />
                <div data-reveal><Buttons buttons={btns(sec)} tone="light" /></div>
              </div>
              <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>{img ? <Shot img={img} className="aspect-[4/3]" parallax={5} /> : null}</div>
            </div>
          );
        })}
      </Section>

      {/* Section transition: the page's own service lines as an alternating marquee */}
      <ServiceMarquee
        rows={[s6, s7].map((sec) => ((sec.find((b) => b.type === "list") as Extract<Block, { type: "list" }> | undefined)?.items ?? []).map(plain))}
        image={(() => { const im = s14.find(isImg); return im ? media(im.src) : undefined; })()}
      />

      {/* 12 · ENQUIRY — the live form, moved out of the hero */}
      <section id="enquiry-section" className="on-dark relative isolate overflow-hidden bg-ink text-white">
        <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,78,216,0.45),transparent)]" />
        <div className="container-x mx-auto grid max-w-[120rem] gap-14 py-[clamp(6rem,11vw,10rem)] lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <Label dark>Start your Delhi campaign</Label>
            <Hd b={formTitle} split className={`mt-6 ${DISPLAY}`} />
            <dl className="mt-12 space-y-6 border-t border-white/15 pt-8 text-[0.9375rem]" data-reveal>
              <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">Email</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="hover:text-sky">{site.email}</a></dd></div>
              <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">Sales / client enquiries</dt><dd className="mt-1 flex flex-wrap gap-x-5">{site.phones.filter((p) => p.label === "Sales").map((p) => <a key={p.href} href={p.href} className="hover:text-sky">{p.number}</a>)}</dd></div>
              <div><dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">Office</dt><dd className="mt-1 max-w-[36ch] text-white/75">{liveFooterFacts.address}</dd></div>
            </dl>
          </Reveal>
          <div className="lg:col-span-7">
            <div id="enquiry" className="scroll-mt-28 rounded-[22px] border border-white/12 bg-white/[0.05] p-6 shadow-[0_40px_120px_-40px_rgba(29,78,216,0.55)] backdrop-blur-md md:p-10">
              <FormSlot first={formBlock === form.first} tone="light" bare />
            </div>
          </div>
        </div>
      </section>

      {/* 13 · FAQ (live section 18) */}
      <Section className="bg-white py-[clamp(6rem,11vw,10rem)] text-ink">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-32">
              <Label>Frequently asked questions</Label>
              {s18.filter(isH).map((h, i) => <Hd key={i} b={h} split className="text-[clamp(1.75rem,1rem+2.2vw,3.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]" />)}
              <Copy blocks={s18} />
              <div data-reveal><Buttons buttons={[{ href: "#enquiry", text: "Ask us more" }]} tone="light" /></div>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            {s18.filter((b) => b.type === "faq").map((f, i) => <Faq key={i} b={f as Extract<Block, { type: "faq" }>} tone="light" />)}
          </div>
        </div>
      </Section>
    </>
  );
}
