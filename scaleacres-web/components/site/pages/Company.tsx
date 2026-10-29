import Link from "next/link";
import type { CSSProperties } from "react";
import { getLegacyPage, media, plain, type Block, type LegacyPage, type LegacySection } from "@/lib/legacy";
import { ndAbout } from "@/content/nd";
import { site } from "@/content/site";
import { liveCountries, liveFooter } from "@/content/legacy-nav";
import { Band, Cards, Flow, FormPanel, Gallery, Html, Pict, findCards, sectionStats, splitHead, blockText } from "@/components/site/Blocks";
import { Btn, ClosingCta, Head, Hero, Section, StatRow } from "@/components/site/Kit";
import { hasFaq, type Prepared } from "@/components/site/compose";
import { Sections, FaqBand, crumbsFor } from "@/components/site/SitePage";
import { ServiceIndex } from "@/components/site/Indexes";
import { WorkStrip } from "@/components/site/Showcase";
import { FoundersBand, StoryBand, ExpertiseBand, PhotoGrid } from "@/components/site/pages/Parts";
import { VideoTiles, MapEmbed } from "@/components/site/Media";
import { CASES } from "@/components/site/pages/Case";
import { NdShowcase } from "@/components/nd/NdShowcase";
import { NdServices } from "@/components/nd/NdServices";
import { NdBrands } from "@/components/nd/NdBrands";
import { NdTestimonials } from "@/components/nd/NdTestimonials";
import { NdWork } from "@/components/nd/NdWork";
import { ArrowUR, Pic, Tag, Words } from "@/components/nd/ui";

type I = Extract<Block, { type: "image" }>;
const d = (n: number) => ({ "--d": n }) as CSSProperties;
const H1 = ({ text }: { text: string }) => <h1 className="sr-only">{text}</h1>;

/** Studio photograph with the founders inset (genuine ScaleAcres photos). */
function StudioMedia() {
  return (
    <div className="nd-grid">
      <div className="nd-cell lg:col-span-3">
        <div className="relative">
          <div data-nd="clip" className="nd-zoom relative aspect-[16/9] overflow-hidden rounded-[10px] md:aspect-[21/9]">
            <div className="nd-settle absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ndAbout.studio.team.src} srcSet={ndAbout.studio.team.srcSet} sizes="94vw" alt={ndAbout.studio.team.alt} width={ndAbout.studio.team.w} height={ndAbout.studio.team.h} className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />
            </div>
          </div>
          <div data-nd="clip" style={d(220)} className="absolute -bottom-8 right-[4%] w-[30%] max-w-[22rem] overflow-hidden rounded-[8px] border-4 border-[color:var(--ink)] shadow-[var(--sh-3)] max-sm:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ndAbout.studio.founders.src} srcSet={ndAbout.studio.founders.srcSet} sizes="22rem" alt={ndAbout.studio.founders.alt} width={ndAbout.studio.founders.w} height={ndAbout.studio.founders.h} className="block aspect-[15/16] w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== About */

// the founders' story (its "founders" heading is lifted into the page lead by prepare())
const isFounders = (s: LegacySection) => s.blocks.some((b) => b.type === "paragraph" && /two young visionaries/i.test(plain(b.html)));
const sectionWith = (p: Prepared, re: RegExp) => p.sections.find((s) => s.blocks.some((b) => b.type === "heading" && re.test(blockText(b))));

export function AboutPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const why = sectionWith(p, /why scale/i);
  const whyText = why?.blocks.find((b) => b.type === "paragraph");
  const stats = why ? sectionStats(why) : [];
  const founders = p.sections.find(isFounders);
  const journey = sectionWith(p, /our journey/i);
  const expertise = sectionWith(p, /our expertise/i);
  const used = new Set([why, founders, journey, expertise]);
  const rest = p.sections.filter((s) => !used.has(s));
  return (
    <>
      <H1 text={p.h1} />
      <Hero
        as="p"
        tag="About us"
        title="We build real estate brands people remember."
        accent={["remember."]}
        crumbs={crumbsFor(page)}
        lead={whyText && "html" in whyText ? <Html as="p" html={whyText.html} /> : undefined}
        actions={<><Btn href="/our-team/" variant="white">Meet the team</Btn><Btn href="/contact-us/">Make an enquiry</Btn></>}
        media={<StudioMedia />}
        maxChars={20}
      />
      {stats.length ? (
        <Section tone="dark" pad="tight" label="Why ScaleAcres">
          <div className="nd-grid items-end gap-y-6">
            <div className="nd-cell lg:col-span-2"><div data-nd="up"><Tag>In numbers</Tag></div>{why ? <Words as="h2" lines={[blockText(why.blocks[0])]} className="mt-6 text-[clamp(2.2rem,4.4vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.045em]" /> : null}</div>
          </div>
          <div className="nd-cell mt-10"><StatRow dark stats={stats} /></div>
        </Section>
      ) : null}
      {founders ? <FoundersBand s={founders} /> : null}
      {journey ? <StoryBand s={journey} tag="Our journey" /> : null}
      {expertise ? <ExpertiseBand s={expertise} /> : null}
      <Sections sections={rest} label="About us" />
      <Section tone="white" label="What we do">
        <Head tag="What we do" title="One team for brand, digital and growth." accent={["growth."]} intro="Eight connected services, planned together and measured against the same goal: qualified enquiries and site visits." />
        <div className="mt-[clamp(2.5rem,5vw,4rem)]"><ServiceIndex /></div>
      </Section>
      <NdShowcase />
      <ClosingCta />
    </>
  );
}

/* ================================================================== Team */

export function TeamPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const at = p.sections.findIndex((s) => s.blocks.some((b) => b.type === "heading" && /meet our team/i.test(blockText(b))));
  const intro = at >= 0 ? p.sections.slice(0, at) : p.sections;
  const people = at >= 0 ? p.sections.slice(at).flatMap((s) => s.blocks) : [];
  const head = people.length ? splitHead(people) : null;
  const rest = head ? head.rest : [];
  const lead = rest[0]?.type === "paragraph" ? rest[0] : null;
  const grid = findCards(lead ? rest.slice(1) : rest);
  const we = intro.find((s) => s.blocks.some((b) => b.type === "heading" && /we are scaleacres/i.test(blockText(b))));
  const life = intro.find((s) => s.blocks.some((b) => b.type === "heading" && /life @/i.test(blockText(b))));
  const founders = intro.find(isFounders);
  const culture = intro.find((s) => s.blocks.some((b) => b.type === "heading" && /vibrant work culture/i.test(blockText(b))));
  const lifeCards = life ? findCards(life.blocks.slice(1).filter((b, i) => !(i === 0 && b.type === "paragraph"))) : null;
  const lifeImgs = life ? life.blocks.filter((b): b is I => b.type === "image") : [];
  const cultureImgs = culture ? culture.blocks.filter((b): b is I => b.type === "image" && (b.width ?? 0) >= 800) : [];
  const cultureText = culture?.blocks.filter((b) => b.type === "paragraph" && plain(b.html).length > 40) ?? [];
  const weText = we?.blocks.filter((b) => b.type === "paragraph") ?? [];
  const weStats = we ? sectionStats(we) : [];
  const weImg = we?.blocks.find((b): b is I => b.type === "image");
  const lifeIntro = life?.blocks.find((b) => b.type === "paragraph");
  const named = grid ? grid.cards.filter((c) => c.img && plain(c.title.html).trim()) : [];
  return (
    <>
      <H1 text={p.h1} />
      <Hero
        as="p"
        tag="Our team"
        title="The people behind ScaleAcres."
        accent={["ScaleAcres."]}
        crumbs={crumbsFor(page)}
        lead="Strategists, designers, developers, performance marketers, video editors and writers, working as one team for real estate."
        actions={<><Btn href="#team" variant="white">Meet the team</Btn><Btn href="/careers/">Join the team</Btn></>}
        media={lifeImgs.length >= 3 ? <PhotoGrid images={[lifeImgs[1], lifeImgs[0], lifeImgs[2]]} cols="grid-cols-3" ratio="aspect-[4/3]" sizes="31vw" /> : <StudioMedia />}
      />
      {we ? (
        <Section tone="white" label="We are ScaleAcres">
          <div className="nd-grid gap-y-10">
            <div className="nd-cell lg:col-span-2">
              <div data-nd="up"><Tag>Who we are</Tag></div>
              <Words as="h2" lines={[blockText(we.blocks[0])]} className="mt-6 text-[clamp(2.2rem,4.8vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.045em]" />
              <div className="mt-8 max-w-[44rem]" data-nd="up"><Flow blocks={weText} /></div>
              {weStats.length ? <div className="mt-10 max-w-[30rem]"><StatRow stats={weStats} /></div> : null}
            </div>
            {weImg ? <div className="nd-cell"><div data-nd="clip" className="nd-zoom overflow-hidden rounded-[12px] shadow-[var(--sh-2)]"><div className="nd-settle"><Pict img={weImg} sizes="(min-width: 1024px) 30vw, 92vw" className="block h-auto w-full" /></div></div></div> : null}
          </div>
        </Section>
      ) : null}
      {lifeCards ? (
        <Section tone="mist" label="Life at ScaleAcres">
          <Head tag="Life @ ScaleAcres" title={life ? blockText(life.blocks[0]) : "Life @ ScaleAcres"} intro={lifeIntro && "html" in lifeIntro ? <Html as="span" html={lifeIntro.html} /> : undefined} />
          <LifeGrid cards={lifeCards.cards} />
        </Section>
      ) : null}
      {founders ? <FoundersBand s={founders} /> : null}
      {cultureImgs.length ? (
        <Section tone="mist" label="Work culture">
          <Head tag="Work culture" title="Vibrant Work Culture" intro={cultureText[0] && "html" in cultureText[0] ? <Html as="span" html={cultureText[0].html} /> : undefined} />
          <div className="mt-[clamp(2.5rem,5vw,4rem)] px-[clamp(0.75rem,1.2vw,1.25rem)]"><PhotoGrid images={cultureImgs.slice(0, 8)} /></div>
        </Section>
      ) : null}
      {named.length ? (
        <Section tone="white" id="team" label="Meet our team">
          <Head tag="Meet our team" title={head?.title ? blockText(head.title) : "Meet our team"} intro={lead && "html" in lead ? <Html as="span" html={lead.html} /> : undefined} />
          <p className="nd-label nd-muted nd-cell mt-6">{named.length} people · names and roles as published by ScaleAcres</p>
          <ul role="list" className="mt-8 grid grid-cols-2 gap-x-[clamp(0.6rem,1.2vw,1rem)] gap-y-8 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-3 lg:grid-cols-5">
            {named.map((c, i) => {
              const role = c.body.find((b) => b.type === "paragraph");
              return (
                <li key={i} className="group">
                  <div data-nd="clip" style={d((i % 5) * 50)} className="nd-zoom relative aspect-[4/5] overflow-hidden rounded-[10px] bg-[color:var(--mist)]">
                    <div className="nd-settle absolute inset-0"><Pict img={c.img!} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw" className="absolute inset-0 h-full w-full object-cover object-[50%_22%]" /></div>
                  </div>
                  <p className="mt-3 text-[1.0625rem] font-semibold leading-tight tracking-[-0.01em]">{plain(c.title.html)}</p>
                  <p className="nd-muted mt-1 min-h-[1.4em] text-[0.9375rem] leading-snug">{role && "html" in role ? plain(role.html) : null}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
      <ClosingCta title="Let's talk." lead="Want to work with this team, or join it? Call, write, or start a project." />
    </>
  );
}

function LifeGrid({ cards }: { cards: NonNullable<ReturnType<typeof findCards>>["cards"] }) {
  return (
    <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-10 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <li key={i}>
          {c.img ? <div data-nd="clip" style={d(i * 70)} className="nd-zoom relative aspect-[4/3] overflow-hidden rounded-[10px]"><div className="nd-settle absolute inset-0"><Pict img={c.img} sizes="(min-width: 1024px) 23vw, 46vw" className="absolute inset-0 h-full w-full object-cover" /></div></div> : null}
          <h3 data-nd="up" className="mt-4 text-[1.25rem] font-semibold tracking-[-0.02em]">{plain(c.title.html)}</h3>
          {c.body.length ? <div className="nd-flow nd-flow--sm mt-2"><Flow blocks={c.body} /></div> : null}
        </li>
      ))}
    </ul>
  );
}

/* ================================================================== Contact */

export function ContactPage({ p }: { page: LegacyPage; p: Prepared }) {
  const all = p.sections.flatMap((s) => s.blocks);
  const map = all.find((b) => b.type === "video" && /maps/.test(b.embed ?? ""));
  const hours = all.find((b) => b.type === "paragraph" && /assistance hours/i.test(plain(b.html)));
  const badges = all.filter((b): b is I => b.type === "image" && /partner|iso|privacy/i.test(b.src));
  const unlock = p.sections.find((s) => s.blocks.some((b) => b.type === "heading" && /unlock/i.test(blockText(b))));
  const unlockH = unlock?.blocks.find((b) => b.type === "heading");
  const unlockP = unlock?.blocks.find((b) => b.type === "paragraph");
  const grow = all.find((b) => b.type === "heading" && /grow your real estate/i.test(blockText(b)));
  const growP = grow ? all[all.indexOf(grow) + 1] : null;
  const list = all.find((b) => b.type === "list");
  return (
    <>
      <section className="nd-dark relative overflow-hidden" aria-label="Contact">
        <div className="nd-wrap relative pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7.5rem,13vw,11rem)]">
          <div className="nd-cell flex flex-wrap items-center justify-between gap-4"><div data-nd="up"><Tag>Contact us</Tag></div></div>
          <div className="nd-cell mt-8">
            <h1 className="sr-only">{p.h1}</h1>
            <Words as="p" lines={["Let's talk."]} accent={["talk."]} accentClass="text-[color:var(--sky)]" className="text-[clamp(3.5rem,13vw,15rem)] font-semibold leading-[0.85] tracking-[-0.06em]" />
          </div>
          <div className="nd-grid mt-[clamp(2.5rem,6vw,5rem)] gap-y-10">
            <div className="nd-cell" data-nd="up">
              <p className="nd-label text-white/55">For sales / client enquiries</p>
              {site.phones.slice(0, 2).map((ph) => <a key={ph.number} href={ph.href} className="mt-2 block text-[clamp(1.5rem,2.2vw,2.25rem)] font-medium tracking-[-0.03em] hover:text-[color:var(--sky)]">{ph.number}</a>)}
              <p className="nd-label mt-7 text-white/55">Email address</p>
              <a href={`mailto:${site.email}`} className="mt-2 inline-block text-[1.25rem] font-medium hover:text-[color:var(--sky)]">{site.email}</a>
            </div>
            <div className="nd-cell" data-nd="up" style={d(80)}>
              <p className="nd-label text-white/55">Studio</p>
              <address className="mt-3 text-[1.0625rem] not-italic leading-[1.6] text-white/85">{site.address.lines.map((l) => <span key={l} className="block">{l}</span>)}</address>
              <a href="#map" className="nd-link nd-label mt-3 text-[color:var(--sky)]">View on map <ArrowUR className="h-3 w-3" /></a>
              {hours && "html" in hours ? <Html as="p" html={hours.html} className="mt-7 text-[1rem] leading-[1.6] text-white/66" /> : null}
            </div>
            <div className="nd-cell" data-nd="up" style={d(160)}>
              <p className="nd-label text-white/55">Careers</p>
              <a href={site.phones[2].href} className="mt-2 block text-[1.5rem] font-medium tracking-[-0.03em] hover:text-[color:var(--sky)]">{site.phones[2].number}</a>
              <p className="nd-label mt-7 text-white/55">Offices</p>
              <p className="mt-2 text-[1.0625rem] text-white/85">{site.offices.join(" · ")}</p>
              <ul className="mt-6 flex flex-wrap gap-5" role="list">{site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="nd-link text-[1rem] font-medium">{s.label}</a></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <Section tone="paper" id="enquiry" label="Send an enquiry">
        <div className="nd-grid gap-y-10">
          <div className="nd-cell">
            <div data-nd="up"><Tag>Send an enquiry</Tag></div>
            {unlockH && "html" in unlockH ? <Html as="h2" html={unlockH.html} className="mt-7 text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.045em]" /> : null}
            {unlockP && "html" in unlockP ? <Html as="p" html={unlockP.html} className="nd-lead nd-muted mt-6" /> : null}
            {grow && "html" in grow ? <Html as="h3" html={grow.html} className="nd-h4 mt-10" /> : null}
            {growP && "html" in growP ? <Html as="p" html={growP.html} className="nd-body nd-muted mt-3" /> : null}
            {list && list.type === "list" ? <ul className="mt-5 space-y-2" role="list">{list.items.map((it, i) => <li key={i} className="flex gap-3 text-[1rem]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--royal)]" /><Html as="span" html={it} /></li>)}</ul> : null}
            {badges.length ? <ul className="mt-9 flex flex-wrap items-center gap-6" role="list">{badges.map((b, i) => <li key={i}><Pict img={b} sizes="140px" className="h-12 w-auto object-contain" /></li>)}</ul> : null}
          </div>
          <div className="nd-cell lg:col-span-2" data-nd="up"><FormPanel id="contact-form" /></div>
        </div>
      </Section>

      {map && map.type === "video" ? (
        <Section tone="white" id="map" label="Map">
          <Head tag="Map" title="Visit the studio." accent={["studio."]} intro={site.address.lines.join(", ")} size="md" />
          <div className="nd-cell mt-10"><MapEmbed embed={(map.embed ?? "").replace("z=10", "z=15")} title="ScaleAcres studio, Saidulajab, New Delhi, on Google Maps" link={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Scaleacres Promotech, Saidulajab, New Delhi 110030")}`} /></div>
        </Section>
      ) : null}
      <WorkStrip />
    </>
  );
}

/* ================================================================== Services overview */

export function ServicesPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const solutions = p.sections.find((s) => s.blocks.filter((b) => b.type === "heading" && b.level === 2).length >= 4);
  return (
    <>
      <H1 text={p.h1} />
      <Hero
        as="p"
        tag="Our services"
        title="Everything a project needs to launch and sell."
        accent={["sell."]}
        crumbs={crumbsFor(page)}
        lead={p.leadHtml ? <Html as="p" html={p.leadHtml} /> : "Positioning and identity, websites, media and technology, planned and delivered by one team."}
        actions={<><Btn href="#services" variant="white">Explore services</Btn><Btn href="/contact-us/">Book a call</Btn></>}
      />
      <NdServices />
      {solutions ? <SolutionRows s={solutions} /> : null}
      <Sections sections={p.sections.filter((s) => s !== solutions)} label="Services" />
      <Markets />
      <WorkStrip />
      <ClosingCta />
    </>
  );
}

/** "Solution we provide": each h2 with its copy and image, alternating sides. */
function SolutionRows({ s }: { s: LegacySection }) {
  const { title, rest } = splitHead(s.blocks);
  const intro = rest[0]?.type === "paragraph" ? rest[0] : null;
  const groups: { h: Block; body: Block[]; img?: I }[] = [];
  const imgs: I[] = [];
  for (const b of intro ? rest.slice(1) : rest) {
    if (b.type === "heading") groups.push({ h: b, body: [] });
    else if (b.type === "image") imgs.push(b);
    else if (groups.length && !(b.type === "paragraph" && /^learn more$/i.test(plain(b.html)))) groups[groups.length - 1].body.push(b);
  }
  // the live layout pairs images with headings in order
  groups.forEach((g, i) => { g.img = imgs[i]; });
  return (
    <Section tone="mist" label="Solutions">
      <Head tag="Solutions" title={title ? blockText(title) : "Solutions we provide"} intro={intro && "html" in intro ? <Html as="span" html={intro.html} /> : undefined} />
      <ol role="list" className="mt-[clamp(2.5rem,5vw,4rem)] space-y-[clamp(2.5rem,5vw,4.5rem)]">
        {groups.map((g, i) => (
          <li key={i} className="nd-grid items-center gap-y-6">
            <div className={`nd-cell lg:col-span-2 ${i % 2 ? "lg:order-2" : ""}`}>
              {g.img ? <div data-nd="clip" className="nd-zoom relative aspect-[16/10] overflow-hidden rounded-[14px] bg-white shadow-[var(--sh-2)] ring-1 ring-[color:var(--line-l)]"><div className="nd-settle absolute inset-[clamp(0.75rem,2vw,1.75rem)]"><Pict img={g.img} sizes="(min-width: 1024px) 60vw, 92vw" className="absolute inset-0 h-full w-full object-contain" /></div></div> : null}
            </div>
            <div className="nd-cell" data-nd="up">
              <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}</span>
              {"html" in g.h ? <Html as="h3" html={g.h.html} className="mt-4 text-[clamp(1.6rem,2.6vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.035em]" /> : null}
              <div className="mt-4"><Flow blocks={g.body} /></div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Every location page linked from the live footer, as a clean index. */
export function Markets() {
  const india = liveFooter.topCities;
  return (
    <Section tone="white" label="Markets we serve">
      <Head tag="Markets we serve" title="From Delhi NCR to Dubai." accent={["Dubai."]} intro="City and country pages for the markets where we plan and run real estate campaigns." size="md" />
      <div className="nd-grid mt-10 gap-y-10">
        <div className="nd-cell lg:col-span-2">
          <p className="nd-label nd-muted">India</p>
          <ul role="list" className="mt-4 grid gap-x-6 sm:grid-cols-2">
            {india.map((c) => <li key={c.href} className="border-b border-[color:var(--line-l)]"><Link href={c.href} className="group flex items-center justify-between gap-3 py-3 text-[1rem] transition-colors hover:text-[color:var(--royal)]">{c.label.replace(/^Real Estate (Digital )?Marketing Agency in /, "")}<ArrowUR className="h-3 w-3 opacity-40 transition-transform group-hover:rotate-45 group-hover:opacity-100" /></Link></li>)}
          </ul>
        </div>
        <div className="nd-cell">
          <p className="nd-label nd-muted">International</p>
          <ul role="list" className="mt-4">
            {liveCountries.map((c) => <li key={c.href} className="border-b border-[color:var(--line-l)]"><Link href={c.href} className="group flex items-center justify-between gap-3 py-3 text-[1rem] transition-colors hover:text-[color:var(--royal)]">{c.label.replace(/^.*Real Estate in /, "")}<ArrowUR className="h-3 w-3 opacity-40 transition-transform group-hover:rotate-45 group-hover:opacity-100" /></Link></li>)}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ================================================================== Our work */

type Site = { logo?: I; shot: I; meta: string[] };
function parseSites(blocks: Block[]) {
  const sites: Site[] = [];
  let pendingLogo: I | undefined;
  const isShot = (b: I) => /scaled|screencapture|home-page|homee-page|website|landing/i.test(b.src) && !/logo/i.test(b.src);
  for (const b of blocks) {
    if (b.type === "image") {
      if (isShot(b)) { sites.push({ logo: pendingLogo, shot: b, meta: [] }); pendingLogo = undefined; }
      else pendingLogo = b;
    } else if (b.type === "heading" && sites.length && b.level >= 5) sites[sites.length - 1].meta.push(blockText(b));
  }
  return sites;
}
/** Client names for the website captures (the live page only names some of them in image alt text). */
const SITE_NAMES: [RegExp, string][] = [
  [/sidrealtech/i, "SID Realtech"], [/subata/i, "Subata Realty"], [/researchcapital/i, "Research Capital"], [/aevora/i, "Aevora Infratech"],
  [/jbbr/i, "JBBR Group"], [/scalemiles/i, "ScaleMiles"], [/imperial-sky/i, "Imperial Sky Realty"], [/landload/i, "Landlord Realtor Service"],
  [/homefynders/i, "Homefynders"], [/aakar/i, "Aakar Interiors"], [/straightup/i, "StraightUp Capital"], [/lets-movin/i, "Let's Movin"],
  [/innovativedeveloper/i, "Innovative Developers"], [/bizloan/i, "Bizloan India"], [/Investors-Guide/i, "Investors Guide, Gurgaon"],
  [/jina-cosmetics/i, "Jina Cosmetics"], [/mwbstore/i, "MW&B"], [/yugen/i, "Yugen Infra"], [/Media-pr/i, "Media PR"],
  [/cloudwaysapps/i, "Eggspert"], [/rudrom/i, "RPS Rudrom"],
];
const siteName = (s: Site) => {
  const hit = SITE_NAMES.find(([re]) => re.test(s.shot.src));
  if (hit) return hit[1];
  const m = (s.logo?.alt || s.shot.alt || "").match(/^(.*?) Client For Scaleacres/i);
  return m ? m[1] : "Website project";
};
const siteMeta = (s: Site) => {
  const get = (k: string) => s.meta.find((m) => new RegExp(`^${k}\\s*:`, "i").test(m))?.replace(/^[^:]*:\s*/, "").trim();
  const cat = get("Category"), plat = get("Platform");
  return [cat ? cat.replace(/^real[- ]estate$/i, "Real estate") : "Website design", plat].filter(Boolean).join(" · ");
};

/** Real estate video ads published on the Our Work page (Vimeo), with their posters. */
const VIMEO_H: Record<string, string> = { "1096842100": "06baa9ae7c", "1096842029": "fec77a110e", "1096841907": "b8a900bace", "1096841806": "9139cf65fa", "1096841691": "bccf0a83bb", "1096841538": "b51e5d5007", "1096841460": "8b05c058e4", "1096841377": "0283c34813" };

export function WorkPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const find = (re: RegExp) => p.sections.find((s) => s.blocks.some((b) => b.type === "heading" && re.test(blockText(b))));
  const webS = find(/website design/i);
  const magicS = find(/creative magic/i);
  const vidS = find(/real estate videos/i);
  const sites = webS ? parseSites(webS.blocks) : [];
  const creatives = magicS ? magicS.blocks.filter((b): b is I => b.type === "image" && /\.jpe?g$|jpeg/i.test(b.src)) : [];
  const vids: { v: Extract<Block, { type: "video" }>; t: string }[] = [];
  vidS?.blocks.forEach((b, i) => { if (b.type === "video") vids.push({ v: b, t: blockText(vidS.blocks[i + 1] ?? b) }); });
  return (
    <>
      <Hero
        tag={p.lead ? "Driving real results" : "Our work"}
        title={p.h1}
        crumbs={crumbsFor(page)}
        actions={<><Btn href="#websites" variant="white">Websites</Btn><Btn href="#videos-grid" variant="white">Videos</Btn><Btn href="/contact-us/">Start a project</Btn></>}
      />
      <NdShowcase />
      <NdWork />
      <NdBrands />
      {sites.length ? (
        <Section tone="white" id="websites" label="Website design">
          <Head tag="Website design" title={webS ? blockText(splitHead(webS.blocks).title ?? webS.blocks[0]) : "Website design"} intro={(() => { const x = webS?.blocks.find((b) => b.type === "paragraph"); return x && "html" in x ? <Html as="span" html={x.html} /> : undefined; })()} />
          <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(1rem,2vw,1.75rem)] gap-y-12 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((s, i) => (
              <li key={i} className="group">
                <div data-nd="clip" style={d((i % 3) * 70)} className="overflow-hidden rounded-[8px] bg-white shadow-[var(--sh-1)] ring-1 ring-[color:var(--line-l)] transition-shadow duration-500 group-hover:shadow-[var(--sh-3)]">
                  <div className="flex h-8 items-center gap-1.5 border-b border-[color:var(--line-l)] bg-[#f4f5f7] px-3">{[0, 1, 2].map((k) => <span key={k} className="h-2 w-2 rounded-full bg-[#d1d5dc]" />)}</div>
                  <div className="relative aspect-[16/11] overflow-hidden">
                    {/* full-page capture: scrolls through the site on hover */}
                    <Pict img={s.shot} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw" className="absolute inset-x-0 top-0 h-auto w-full transition-transform duration-[2600ms] ease-[cubic-bezier(0.45,0,0.2,1)] group-hover:translate-y-[calc(-100%+min(100%,24rem))] motion-reduce:transition-none" />
                  </div>
                </div>
                <div data-nd="up" className="mt-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[1.125rem] font-semibold tracking-[-0.02em]">{siteName(s)}</p>
                    <p className="nd-label nd-muted mt-1 truncate">{siteMeta(s)}</p>
                  </div>
                  {s.logo ? <Pict img={s.logo} sizes="120px" className="h-8 w-auto max-w-[7rem] object-contain opacity-80" /> : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {creatives.length ? (
        <Section tone="dark" label="Creative">
          <Head dark tag="Creative" title={magicS ? blockText(splitHead(magicS.blocks).title ?? magicS.blocks[0]) : "Our creative magic"} intro={(() => { const x = magicS?.blocks.find((b) => b.type === "paragraph"); return x && "html" in x ? <Html as="span" html={x.html} /> : undefined; })()} />
          <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] columns-2 gap-[clamp(0.75rem,1.5vw,1.25rem)] px-[clamp(0.75rem,1.2vw,1.25rem)] lg:columns-4">
            {creatives.map((c, i) => <li key={i} data-nd="clip" style={d((i % 4) * 70)} className="nd-zoom mb-[clamp(0.75rem,1.5vw,1.25rem)] break-inside-avoid overflow-hidden rounded-[8px]"><Pict img={c} sizes="(min-width: 1024px) 23vw, 46vw" className="block h-auto w-full" /></li>)}
          </ul>
        </Section>
      ) : null}
      {vids.length ? (
        <Section tone="white" id="videos-grid" label="Real estate videos">
          <Head tag="Video production" title={vidS ? blockText(splitHead(vidS.blocks).title ?? vidS.blocks[0]) : "Real estate videos"} intro={(() => { const x = vidS?.blocks.find((b) => b.type === "paragraph"); return x && "html" in x ? <Html as="span" html={x.html} /> : undefined; })()} />
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            <VideoTiles clips={vids.flatMap(({ v, t }) => { const id = v.embed?.match(/vimeo\.com\/video\/(\d+)/)?.[1]; return id ? [{ host: "vimeo" as const, id, hash: VIMEO_H[id], poster: `/media/ext/vm-${id}.webp`, title: t, ratio: "1/1" as const }] : []; })} />
          </div>
          <p className="nd-cell nd-label nd-muted mt-8">Video ads produced by ScaleAcres for developers · hosted on Vimeo</p>
        </Section>
      ) : null}
      <NdTestimonials />
      <ClosingCta />
    </>
  );
}

/* ================================================================== Case studies */

export function CaseStudiesPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const intro = p.sections.flatMap((s) => s.blocks).find((b) => b.type === "paragraph" && plain(b.html).length > 60);
  const cases = CASES.map((c) => {
    const lp = getLegacyPage(c.path);
    const all = lp ? lp.sections.flatMap((s) => s.blocks) : [];
    const h1 = all.find((b) => b.type === "heading" && b.level === 1 && lp!.sections[0].blocks.includes(b));
    const ov = all.findIndex((b) => b.type === "heading" && /project overview/i.test(blockText(b)));
    const sum = h1 ? blockText(h1) : ov >= 0 && "html" in all[ov + 1] ? plain((all[ov + 1] as { html: string }).html).split(/(?<=\.)\s/)[0] : "";
    return { ...c, sum };
  });
  return (
    <>
      <Hero
        tag="Case studies"
        title={p.h1}
        accent={["Studies"]}
        crumbs={crumbsFor(page)}
        lead={intro && "html" in intro ? <Html as="p" html={intro.html} /> : undefined}
        actions={<Btn href="/contact-us/">Start a project</Btn>}
      />
      <Section tone="white" label="Case studies">
        <Head tag="Delivering success" title="Delivering success, one project at a time." accent={["success,"]} intro="Full write-ups of two Goa launches: the brief, the strategy, the ad films and the results, as published by ScaleAcres." />
        <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(1rem,2vw,1.75rem)] gap-y-14 px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-2">
          {cases.map((c, i) => (
            <li key={c.path} className="group">
              <Link href={c.path} className="block">
                <div data-nd="clip" style={d(i * 90)} className="nd-zoom relative aspect-square overflow-hidden rounded-[14px] bg-[color:var(--ink)] shadow-[var(--sh-2)] transition-shadow duration-500 group-hover:shadow-[var(--sh-3)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media(c.card)} alt={`${c.client} case study: results`} width={536} height={536} loading="lazy" className="nd-settle absolute inset-0 h-full w-full object-cover" />
                </div>
                <div data-nd="up" className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="nd-label text-[color:var(--royal)]">{c.place}</p>
                    <h3 className="mt-2 text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-colors group-hover:text-[color:var(--royal)]">{c.client}</h3>
                    {c.sum ? <p className="nd-muted mt-3 max-w-[34rem] text-[1.0625rem] leading-[1.55]">{c.sum}</p> : null}
                  </div>
                  <span aria-hidden="true" className="mt-2 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[color:var(--line-l)] transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white"><ArrowUR className="h-4 w-4" /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <NdWork />
      {p.sections.filter(hasFaq).map((s, i) => <FaqBand key={i} s={s} />)}
      <ClosingCta />
    </>
  );
}

/* ================================================================== Careers */

export function CareersPage({ page, p }: { page: LegacyPage; p: Prepared }) {
  const team = getLegacyPage("/our-team/");
  const culture = (team?.sections ?? []).flatMap((s) => s.blocks).filter((b): b is I => b.type === "image" && /^(01|03|04|05|06|02-1|04-1|01-1|2|4|5|6)\.webp$/.test(b.src.split("/").pop() ?? ""));
  const lifeCards = team ? findCards(team.sections.find((s) => s.blocks.some((b) => b.type === "heading" && /life @/i.test(blockText(b))))?.blocks.slice(2) ?? []) : null;
  const formS = p.sections.find((s) => s.blocks.some((b) => b.type === "form"));
  const formHead = formS ? splitHead(formS.blocks) : null;
  const positions = p.sections.flatMap((s) => s.blocks).find((b) => b.type === "heading" && /open positions/i.test(blockText(b)));
  return (
    <>
      <Hero
        tag="Careers at ScaleAcres"
        title={p.h1}
        accent={["Passionate"]}
        crumbs={crumbsFor(page)}
        lead={p.leadHtml ? <Html as="p" html={p.leadHtml} /> : undefined}
        actions={<><Btn href="#apply">Apply now</Btn><a href={site.phones[2].href} className="nd-btn nd-btn--white">Call {site.phones[2].number} <ArrowUR /></a></>}
        media={culture.length >= 4 ? (
          <ul role="list" className="grid grid-cols-2 gap-[clamp(0.5rem,1vw,0.9rem)] lg:grid-cols-4">
            {culture.slice(0, 4).map((c, i) => <li key={i} data-nd="clip" style={d(i * 80)} className="nd-zoom overflow-hidden rounded-[10px]"><div className="nd-settle"><Pict img={c} sizes="25vw" className="block aspect-[4/3] h-full w-full object-cover" /></div></li>)}
          </ul>
        ) : <StudioMedia />}
      />
      {lifeCards ? (
        <Section tone="white" label="Life at ScaleAcres">
          <Head tag="Life @ ScaleAcres" title="A vibrant mix of innovation, teamwork and joy." accent={["joy."]} intro="Strategy sessions, creative reviews, festivals and team parties: how we work, and how we celebrate the wins together." />
          <LifeGrid cards={lifeCards.cards} />
        </Section>
      ) : null}
      <Section tone="paper" id="apply" label="Open positions and applications">
        <div className="nd-grid gap-y-12">
          <div className="nd-cell">
            <div data-nd="up"><Tag>Open positions</Tag></div>
            {positions && "html" in positions ? <Html as="h2" html={positions.html} className="mt-7 text-[clamp(2.1rem,3.6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]" /> : null}
            <div data-nd="up" className="mt-7 rounded-[12px] border border-[color:var(--line-l)] bg-white p-6">
              <p className="nd-label text-[color:var(--royal)]">Current openings</p>
              <p className="mt-3 text-[1.125rem] leading-[1.55]">No roles are listed right now. We still want to hear from strategists, designers, developers, performance marketers, video editors and writers who love real estate.</p>
            </div>
            <ol role="list" className="mt-8 grid gap-4">
              {["Choose the service closest to your craft in the form.", "Mention the role you want and add a link to your portfolio, LinkedIn or CV in the message.", `Or call the careers line on ${site.phones[2].number}.`].map((t, i) => (
                <li key={i} data-nd="up" style={d(i * 60)} className="flex gap-4 text-[1.0625rem] leading-[1.55]"><span className="nd-label mt-0.5 tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span><span>{t}</span></li>
              ))}
            </ol>
            {formHead?.title && "html" in formHead.title ? <Html as="p" html={formHead.title.html} className="mt-10 text-[1.375rem] font-semibold tracking-[-0.02em]" /> : null}
            {formHead ? <div className="mt-3"><Flow blocks={formHead.rest.filter((b) => b.type === "paragraph")} /></div> : null}
          </div>
          <div className="nd-cell lg:col-span-2" data-nd="up"><FormPanel id="careers-form" /></div>
        </div>
      </Section>
      {p.sections.filter(hasFaq).map((s, i) => <FaqBand key={i} s={s} />)}
      <ClosingCta />
    </>
  );
}

export { Band, Gallery, StatRow, sectionStats, media, Pic };
