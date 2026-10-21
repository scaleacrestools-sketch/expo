import type { ReactNode } from "react";
import { media, plain, type Block, type LegacyPage, type LegacySection } from "@/lib/legacy";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";
import { Rail } from "@/components/legacy/Rail";
import { Buttons, Faq, Flow, FormSlot, Html, Img, ListEl, Para, SectionBand, asButton, isStatHeading, Video, type FormCounter, type Tone } from "@/components/legacy/LegacyBlocks";

/**
 * PAGE COMPOSER (premium internal-page system)
 * ------------------------------------------------------------------
 * Recognises what each captured live section is (hero, logo wall, testimonials, showcase,
 * funnel, results, portfolio, awards, culture, editorial split, numbered reasons, creative rail,
 * FAQ…) and renders it with a purpose-built component in the homepage's design language.
 * Content is never altered: every block is rendered once, in its original tag, with its
 * original text, links, image sources and alt text. Unrecognised sections fall back to the
 * generic band renderer.
 */

type H = Extract<Block, { type: "heading" }>;
type I = Extract<Block, { type: "image" }>;
const isH = (b: Block): b is H => b.type === "heading";
const isImg = (b: Block): b is I => b.type === "image";
const isPara = (b: Block): b is Extract<Block, { type: "paragraph" }> => b.type === "paragraph" && !asButton(b);
const big = (i: I) => (i.width ?? 0) >= 600;
const portrait = (i: I) => (i.height ?? 0) > (i.width ?? 0) * 1.15;
const words = (bs: Block[]) => bs.filter(isPara).reduce((n, b) => n + plain(b.html).split(" ").length, 0);

/* ------------------------------------------------------------------ shared shells */

const BG: Record<Tone, string> = {
  hero: "bg-ink text-white on-dark",
  dark: "bg-ink text-white on-dark",
  light: "bg-white text-ink",
  mist: "bg-offwhite text-ink",
};
const navyBg = "bg-navy text-white on-dark";
const dark = (t: Tone) => t === "hero" || t === "dark";

function Shell({ tone, navy = false, children, className = "", id }: { tone: Tone; navy?: boolean; children: ReactNode; className?: string; id?: string }) {
  return (
    <Reveal as="section" id={id} className={`relative isolate overflow-hidden ${navy ? navyBg : BG[tone]} py-[clamp(5rem,10vw,9rem)] ${className}`}>
      <div className="container-x mx-auto max-w-[120rem]">{children}</div>
    </Reveal>
  );
}

/** Small uppercase section label (design chrome, not a heading). */
function Label({ children, tone }: { children: ReactNode; tone: Tone | "navy" }) {
  return <p className={`eyebrow ${tone === "light" || tone === "mist" ? "text-blue" : "text-sky"}`} data-reveal>{children}</p>;
}

/** Original heading, styled by role. Tag and text are untouched. */
function T({ b, size = "h2", className = "" }: { b: H; size?: "display" | "h2" | "h3" | "kicker" | "card" | "meta"; className?: string }) {
  const cls = {
    display: "text-[clamp(2.75rem,1rem+5.4vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.045em]",
    h2: "h2",
    h3: "text-[clamp(1.75rem,1rem+2.2vw,3.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]",
    kicker: "text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-blue",
    card: "text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-bold leading-snug tracking-[-0.01em]",
    meta: "text-[0.75rem] font-semibold uppercase tracking-[0.14em] opacity-70",
  }[size === "h2" && b.text.length > 48 ? "h3" : size];
  return <Html as={`h${b.level}`} html={b.html} className={`legacy-h text-balance ${cls} ${className}`} />;
}

function Text({ blocks, tone, lead = false }: { blocks: Block[]; tone: Tone; lead?: boolean }) {
  return (
    <div className="max-w-[62ch] space-y-5" data-reveal>
      {blocks.map((b, i) => (isPara(b) ? <Para key={i} html={b.html} tone={tone} lead={lead && i === 0} /> : b.type === "list" ? <ListEl key={i} b={b} tone={tone} /> : null))}
    </div>
  );
}

const btns = (bs: Block[]) => bs.map(asButton).filter(Boolean) as { href: string; text: string }[];

/** Any block type a component does not lay out itself (stats, video, tables, quotes, forms…) is still rendered. */
const EXTRA = new Set(["stat", "video", "table", "quote", "form", "rule", "faq"]);
function Extras({ blocks, tone, skip = [] as string[] }: { blocks: Block[]; tone: Tone; skip?: string[] }) {
  const xs = blocks.filter((b) => EXTRA.has(b.type) && !skip.includes(b.type));
  return xs.length ? <div className="mt-10 space-y-6"><Flow blocks={xs} tone={tone} /></div> : null;
}

/** Image frame with consistent radius, optional caption from the original alt text. */
function Frame({ img, ratio = "aspect-[16/10]", caption = false, className = "", position = "object-center" }: { img: I; ratio?: string; caption?: boolean; className?: string; position?: string }) {
  return (
    <figure className={`group m-0 ${className}`}>
      <div className={`overflow-hidden rounded-[14px] bg-ink/5 ${ratio}`}>
        <Img img={img} className={`h-full w-full object-cover ${position} transition-[scale] duration-[1400ms] ease-out-expo group-hover:scale-[1.04]`} />
      </div>
      {caption && img.alt ? <figcaption className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] opacity-60">{img.alt}</figcaption> : null}
    </figure>
  );
}

/** Showcase tile: 16:10 crop with hover zoom. The live alt text stays on the image only (it does not always describe the artwork). */
function Tile({ img }: { img: I }) {
  return (
    <figure className="group relative m-0 aspect-[16/10] overflow-hidden rounded-[14px] bg-white/5">
      <Img img={img} className="h-full w-full object-cover transition-[scale] duration-[1400ms] ease-out-expo group-hover:scale-[1.05]" />
    </figure>
  );
}

/* ------------------------------------------------------------------ section recognisers */

export type Kind =
  | "hero" | "logos" | "testimonials" | "statement" | "showcase" | "funnel" | "results" | "portfolio" | "collage"
  | "awards" | "culture" | "split" | "reasons" | "rows" | "stats" | "banner" | "videos" | "callout" | "creatives" | "faq" | "cta" | "generic";

export function kindOf(s: LegacySection, i: number): Kind {
  const b = s.blocks;
  const imgs = b.filter(isImg);
  const hs = b.filter(isH);
  if (i === 0 && hs.some((h) => h.level === 1)) return "hero";
  if (b.length && b.every((x) => asButton(x))) return "cta";
  // A wide banner image (often with its title set in the artwork) on its own.
  if (b.length <= 2 && imgs.length === b.length && imgs.every((x) => !x.width || !x.height || x.width >= x.height * 3)) return "banner";
  // A short call to action: small headings (often the same line twice, one per breakpoint) and a button.
  if (imgs.length === 0 && hs.length >= 1 && hs.length <= 3 && hs.every((h) => h.level >= 5) && btns(b).length >= 1 && words(b) === 0) return "callout";
  // Key figures written as short numeric headings ("15cr+", "33+", "2.5Lacs+").
  if (hs.filter(isStatHeading).length >= 3 && imgs.length === 0) return "stats";
  if (b.some((x) => x.type === "faq")) return "faq";
  if (b.filter((x) => x.type === "video").length >= 2 && imgs.length === 0) return "videos";
  if (hs.filter((h) => /founder|director|ceo|owner/i.test(h.text)).length >= 3) return "testimonials";
  if (hs.filter((h) => /^category\s*:/i.test(h.text)).length >= 3) return "portfolio";
  // Long mixed sections (a whole case study in one block run) read best as heading-grouped editorial rows.
  if (b.length > 24 && hs.length >= 5 && imgs.length < 12) return "generic";
  // Keyword cues read only the section's main headings (H1–H3), never card labels.
  const title = hs.filter((h) => h.level <= 3).map((h) => h.text).join(" ");
  if (/result|proof|performance/i.test(title) && imgs.length >= 2 && hs.length <= 2) return "results";
  if (/culture|team|life at/i.test(title) && imgs.filter(big).length >= 3) return "culture";
  if (imgs.length >= 3 && imgs.filter(portrait).length >= 3 && hs.length <= 2 && words(b) < 120) return "creatives";
  // Client logos: many images, no copy, at most a title (checked before the image showcase).
  if (imgs.length >= 8 && hs.length <= 2 && words(b) === 0 && !b.some((x) => x.type === "video")) return "logos";
  if (imgs.length >= 6 && imgs.filter(big).length >= 6 && hs.length <= 2) return "showcase";
  if (imgs.length >= 8 && hs.length <= 2) return "logos";
  if (imgs.length >= 3 && hs.length <= 2 && words(b) < 160) return "culture";
  if (hs.length <= 3 && imgs.length >= 1 && imgs.length <= 2 && imgs.every((x) => (x.width ?? 0) >= 1200) && words(b) === 0) return "collage";
  if (hs.length <= 2 && imgs.filter(big).length >= 2 && imgs.length <= 5) return "results";
  const small = hs.filter((h) => h.level >= 4);
  if (small.length >= 3 && small.length === hs.length - 1 && imgs.length === 0) return "reasons";
  // A title followed by a list of offerings written as headings with little or no copy between them.
  if (hs.length >= 5 && imgs.length === 0 && words(b) < 25 * hs.length && !b.some((x) => x.type === "faq")) return "rows";
  if (hs.length === 2 && hs[0].text.length < 30 && imgs.length === 1 && b.filter(isPara).length >= 1) return "awards";
  if (b.some((x) => x.type === "stat") && imgs.length === 0) return "statement";
  if (imgs.length >= 1 && hs.length >= 1) return "split";
  if (hs.length >= 1 && imgs.length === 0 && words(b) > 0 && words(b) < 400 && !b.some((x) => x.type === "list")) return "statement";
  return "generic";
}

/* ------------------------------------------------------------------ components */

function PageHead({ page, label }: { page: LegacyPage; label: string }) {
  const crumbs = page.breadcrumbs;
  return (
    <section className="on-dark bg-ink pb-[clamp(2.5rem,5vw,4rem)] pt-[calc(var(--header-h)+clamp(2.5rem,5vw,4rem))] text-white">
      <div className="container-x mx-auto flex max-w-[120rem] flex-wrap items-center gap-x-4 gap-y-2">
        <p className="eyebrow text-sky">{label}</p>
        {crumbs && crumbs.length > 1 ? (
          <nav aria-label="Breadcrumb" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/50">
            {crumbs.map((c, i) => (
              <span key={i}>{i > 0 ? " / " : ""}{c.url && i < crumbs.length - 1 ? <a href={c.url} className="hover:text-sky">{plain(c.name)}</a> : <span className="text-white/80">{plain(c.name)}</span>}</span>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

/** Splits the H1 section into the hero itself and the blocks that follow it (composed as their own section). */
function splitHero(s: LegacySection) {
  const b = s.blocks;
  const h1i = b.findIndex((x) => isH(x) && x.level === 1);
  // Hero group: H1, the heading right after it (sub-title), buttons, intro copy, small trust images.
  let end = h1i + 1;
  if (b[end] && isH(b[end]) && (b[end] as H).level > 1) end++;
  while (end < b.length && (asButton(b[end]) || isPara(b[end]) || (isImg(b[end]) && ((b[end] as I).width ?? 0) < 400))) end++;
  // Images before the H1 (a client logo, a project visual) stay in the hero; anything else before it follows.
  const pre = b.slice(0, h1i);
  const heroBlocks = [...b.slice(h1i, end)];
  const preImgs = pre.filter(isImg);
  // With no working form in this section, a large photo right after the copy becomes the hero visual.
  if (!b.some((x) => x.type === "form" && x.primary) && b[end] && isImg(b[end]) && big(b[end] as I) && !preImgs.some(big)) preImgs.push(b[end++] as I);
  const rest = [...pre.filter((x) => !isImg(x)), ...b.slice(end)];
  const formIdx = rest.findIndex((x) => x.type === "form" && x.primary);
  const formHeadIdx = formIdx > 0 && isH(rest[formIdx - 1]) ? formIdx - 1 : formIdx;
  const formBlocks = formIdx >= 0 ? rest.slice(formHeadIdx, formIdx + 1) : [];
  const after = formIdx >= 0 ? [...rest.slice(0, formHeadIdx), ...rest.slice(formIdx + 1)] : rest;
  return { heroBlocks, preImgs, formBlocks, after };
}

function Hero({ page, backdrop, label, parts }: { page: LegacyPage; backdrop?: I; label: string; parts: ReturnType<typeof splitHero> }) {
  const { heroBlocks, preImgs, formBlocks } = parts;
  const h1 = heroBlocks[0] as H;
  const sub = heroBlocks[1] && isH(heroBlocks[1]) ? (heroBlocks[1] as H) : null;
  const others = heroBlocks.slice(sub ? 2 : 1);
  const visual = !formBlocks.length ? preImgs.find(big) : undefined;
  const marks = preImgs.filter((x) => x !== visual);
  const crumbs = page.breadcrumbs;

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
        {backdrop ? (
          <div aria-hidden="true" className="absolute inset-0 -z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media(backdrop.src)} alt="" className="h-full w-full scale-105 object-cover opacity-[0.28] blur-[1px]" />
          </div>
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(29,78,216,0.45),transparent_60%),linear-gradient(180deg,rgba(11,13,13,0.55),rgba(11,13,13,0.92)_70%)]" />
        <div className="container-x mx-auto grid max-w-[120rem] gap-12 pb-[clamp(4rem,8vw,7rem)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))] lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="eyebrow text-sky">{label}</p>
              {crumbs && crumbs.length > 1 ? (
                <nav aria-label="Breadcrumb" className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {crumbs.map((c, i) => (
                    <span key={i}>{i > 0 ? " / " : ""}{c.url && i < crumbs.length - 1 ? <a href={c.url} className="hover:text-sky">{plain(c.name)}</a> : <span className="text-white/80">{plain(c.name)}</span>}</span>
                  ))}
                </nav>
              ) : null}
            </div>
            {marks.length ? <div className="mt-8 flex flex-wrap items-center gap-4">{marks.map((im, i) => <Img key={i} img={im} className="h-12 w-auto max-w-[12rem] object-contain" />)}</div> : null}
            <T b={h1} size="display" className="mt-8 max-w-[14ch]" />
            {sub ? <Html as={`h${sub.level}`} html={sub.html} className="legacy-h mt-8 max-w-[30ch] text-[clamp(1.25rem,1rem+1.1vw,2rem)] font-medium leading-[1.25] tracking-[-0.01em] text-white/85" /> : null}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Buttons buttons={btns(others)} tone="hero" />
              {others.filter(isImg).map((im, i) => (
                <Img key={i} img={im} className="h-12 w-auto opacity-90" />
              ))}
            </div>
            {others.filter(isPara).length ? <div className="mt-8"><Text blocks={others} tone="hero" lead /></div> : null}
          </div>
          {visual ? (
            <div className="lg:col-span-5" data-reveal><Frame img={visual} ratio="aspect-[4/5]" /></div>
          ) : null}
          {formBlocks.length ? (
            <div className="lg:col-span-5">
              <div id="enquiry" className="scroll-mt-28 rounded-[22px] border border-white/15 bg-white/[0.06] p-6 shadow-[0_40px_120px_-40px_rgba(29,78,216,0.6)] backdrop-blur-md md:p-8">
                {formBlocks.filter(isH).map((h, i) => <T key={i} b={h} size="h3" className="mb-6 !text-[clamp(1.5rem,1rem+1.2vw,2.25rem)]" />)}
                <FormSlot first tone="light" bare />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function Logos({ blocks, tone }: { blocks: Block[]; tone: Tone }) {
  const hs = blocks.filter(isH);
  const imgs = blocks.filter(isImg);
  return (
    <Shell tone={tone} className="!py-[clamp(4rem,8vw,7rem)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6" data-reveal>{hs.map((h, i) => <T key={i} b={h} size="h3" />)}</div>
        <div className="lg:col-span-6"><Text blocks={blocks} tone={tone} /></div>
      </div>
      <ul role="list" className="mt-12 grid grid-cols-2 overflow-hidden rounded-[16px] border-l border-t border-line bg-white sm:grid-cols-3 lg:grid-cols-6" data-reveal>
        {imgs.map((im, i) => (
          <li key={i} className="group relative aspect-[2/1] border-b border-r border-line bg-white">
            <Img img={im} className="absolute inset-0 m-auto h-auto max-h-[62%] w-auto max-w-[74%] object-contain opacity-80 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0" />
          </li>
        ))}
      </ul>
      {btns(blocks).length ? <div className="mt-10"><Buttons buttons={btns(blocks)} tone={tone} /></div> : null}
      <Extras blocks={blocks} tone={tone} />
    </Shell>
  );
}

function Testimonials({ s, tone }: { s: LegacySection; tone: Tone }) {
  // Cards: photo (before the name), name heading, company logo (after the name).
  const cards: { photo?: I; name: H; logo?: I }[] = [];
  let pending: I | undefined;
  const loose: Block[] = [];
  const orphans: I[] = [];
  // Logos are wide and short; photos are roughly 4:3.
  const isLogo = (b: I) => (b.width ?? 0) > (b.height ?? 1) * 2.2 || (b.width ?? 0) < 300;
  for (const b of s.blocks) {
    if (isImg(b)) {
      const last = cards[cards.length - 1];
      if (last && !last.logo && isLogo(b)) last.logo = b;
      else { if (pending) orphans.push(pending); pending = b; }
    } else if (isH(b)) { cards.push({ photo: pending, name: b }); pending = undefined; }
    else loose.push(b);
  }
  if (pending) orphans.push(pending);
  return (
    <Shell tone={tone}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Label tone={tone}>Client stories</Label>
      </div>
      {loose.length ? <div className="mt-6"><Flow blocks={loose} tone={tone} /></div> : null}
      <div className="mt-6">
        <Rail label="client stories" tone={dark(tone) ? "dark" : "light"}>
          {cards.map((c, i) => (
            <li key={i} className="w-[78vw] max-w-[22rem] shrink-0 snap-start">
              <article className={`flex h-full flex-col overflow-hidden rounded-[18px] ${dark(tone) ? "bg-white/5" : "bg-white"} shadow-[0_20px_60px_-40px_rgba(11,13,13,0.35)]`}>
                {c.photo ? <div className="aspect-[4/3] overflow-hidden"><Img img={c.photo} className="h-full w-full object-cover" /></div> : null}
                <div className="flex flex-1 items-end justify-between gap-4 p-6">
                  <Html as={`h${c.name.level}`} html={c.name.html} className="legacy-h legacy-person text-[0.9375rem] leading-snug" />
                  {c.logo ? <Img img={c.logo} className="h-8 w-auto max-w-[7rem] object-contain opacity-80" /> : null}
                </div>
              </article>
            </li>
          ))}
        </Rail>
      </div>
      {orphans.length ? <div className="mt-6 grid max-w-3xl grid-cols-2 gap-4">{orphans.map((o, i) => <Frame key={i} img={o} />)}</div> : null}
    </Shell>
  );
}

function Statement({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const hs = b.filter(isH);
  const kicker = hs.length >= 2 && hs[0].text.length < 32 ? hs[0] : null;
  const titles = kicker ? hs.slice(1) : hs;
  const stats = b.filter((x) => x.type === "stat") as Extract<Block, { type: "stat" }>[];
  return (
    <Shell tone={tone}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-6 lg:col-span-7" data-reveal>
          {kicker ? <T b={kicker} size="kicker" /> : null}
          {titles.map((h, i) => <T key={i} b={h} size={i === 0 ? "h2" : "h3"} />)}
        </div>
        <div className="space-y-8 lg:col-span-5 lg:pt-4">
          <Text blocks={b} tone={tone} lead />
          {stats.map((st, i) => (
            <div key={i} className={`border-t pt-6 ${dark(tone) ? "border-white/15" : "border-line"}`} data-reveal>
              <p className="text-[clamp(3.5rem,2rem+4vw,6.5rem)] font-black leading-none tracking-[-0.05em] text-blue">{st.value}</p>
              <p className="mt-3 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] opacity-70">{st.label}</p>
            </div>
          ))}
          {btns(b).length ? <div data-reveal><Buttons buttons={btns(b)} tone={tone} /></div> : null}
        </div>
      </div>
      <Extras blocks={b} tone={tone} skip={["stat"]} />
    </Shell>
  );
}

function Showcase({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const hs = b.filter(isH);
  const imgs = b.filter(isImg);
  return (
    <Shell tone={tone}>
      <Label tone={tone}>Branding &amp; creative</Label>
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7" data-reveal>{hs.map((h, i) => <T key={i} b={h} />)}</div>
        <div className="lg:col-span-5"><Text blocks={b} tone={tone} lead /></div>
      </div>
      <div className="mt-14 grid gap-4 md:gap-5 lg:grid-cols-12">
        {imgs[0] ? <div className="lg:col-span-8" data-reveal><Tile img={imgs[0]} /></div> : null}
        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:col-span-4 lg:grid-cols-1">
          {imgs.slice(1, 3).map((im, i) => <div key={i} data-reveal><Tile img={im} /></div>)}
        </div>
      </div>
      {/* Three across; a short final row widens so every row is filled edge to edge. */}
      <ul role="list" className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-6">
        {imgs.slice(3).map((im, i, all) => {
          const left = all.length % 3;
          const span = left && i >= all.length - left ? (left === 2 ? "lg:col-span-3" : "lg:col-span-6") : "lg:col-span-2";
          return <li key={i} className={span} data-reveal><Tile img={im} /></li>;
        })}
      </ul>
      {btns(b).length ? <div className="mt-12"><Buttons buttons={btns(b)} tone={tone} /></div> : null}
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

/** "End-to-End Funnel Strategy": an intro section followed by stage sections, rendered as one timeline. */
function Funnel({ intro, stages, cta }: { intro: LegacySection; stages: LegacySection[]; cta?: LegacySection }) {
  const hs = intro.blocks.filter(isH);
  const kicker = hs.length >= 2 ? hs[0] : null;
  const titles = kicker ? hs.slice(1) : hs;
  return (
    <Reveal as="section" className={`relative isolate overflow-hidden ${navyBg} py-[clamp(5rem,10vw,9rem)]`}>
      <div aria-hidden="true" className="absolute -left-40 top-20 -z-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)]" />
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="space-y-6 lg:col-span-8" data-reveal>
            {kicker ? <T b={kicker} size="kicker" className="!text-sky" /> : null}
            {titles.map((h, i) => <T key={i} b={h} />)}
          </div>
          <div className="space-y-6 lg:col-span-4"><Text blocks={intro.blocks} tone="dark" lead />{btns(intro.blocks).length ? <Buttons buttons={btns(intro.blocks)} tone="dark" /> : null}</div>
        </div>
        <ol className="mt-16 space-y-6 lg:mt-24">
          {stages.map((st, i) => {
            const imgs = st.blocks.filter(isImg);
            const rest = st.blocks.filter((x) => !isImg(x));
            const h = rest.filter(isH);
            return (
              <li key={i} className="grid items-center gap-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-10 lg:grid-cols-12 lg:gap-14" data-reveal>
                <div className={`space-y-6 lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                  <p aria-hidden="true" className="text-[clamp(3.5rem,2rem+4vw,6rem)] font-black leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgba(56,189,248,0.7)]">{String(i + 1).padStart(2, "0")}</p>
                  {h.map((x, j) => <T key={j} b={x} size="h3" />)}
                  <Text blocks={rest} tone="dark" />
                  {btns(rest).length ? <Buttons buttons={btns(rest)} tone="dark" /> : null}
                  <Extras blocks={rest} tone="dark" />
                </div>
                <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>
                  {imgs.map((im, j) => <Frame key={j} img={im} ratio="aspect-[16/10]" />)}
                </div>
              </li>
            );
          })}
        </ol>
        {cta ? <div className="mt-12" data-reveal><Buttons buttons={btns(cta.blocks)} tone="dark" /></div> : null}
      </div>
    </Reveal>
  );
}

function Results({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const imgs = b.filter(isImg);
  return (
    <Shell tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6" data-reveal><Label tone={tone}>Results</Label><div className="mt-6">{b.filter(isH).map((h, i) => <T key={i} b={h} />)}</div></div>
        <div className="lg:col-span-6"><Text blocks={b} tone={tone} lead /></div>
      </div>
      <ul role="list" className="mt-14 grid gap-6 md:grid-cols-2">
        {imgs.map((im, i) => (
          <li key={i} className="rounded-[18px] border border-line bg-white p-3 shadow-[0_30px_80px_-50px_rgba(11,22,64,0.45)]" data-reveal>
            <div className="mb-3 flex gap-1.5 px-2 pt-1" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /></div>
            <div className="overflow-hidden rounded-[12px]"><Img img={im} className="h-auto w-full" /></div>
          </li>
        ))}
      </ul>
      {btns(b).length ? <div className="mt-12"><Buttons buttons={btns(b)} tone={tone} /></div> : null}
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

function Portfolio({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const firstImg = b.findIndex(isImg);
  const head = b.slice(0, firstImg);
  type P = { logo?: I; shot?: I; meta: H[] };
  const projects: P[] = [];
  const tail: Block[] = [];
  for (const x of b.slice(firstImg)) {
    const cur = projects[projects.length - 1];
    if (isImg(x)) {
      const isShot = (x.height ?? 0) >= 1800 && (x.width ?? 0) < (x.height ?? 0) * 0.7 && !/\.svg$/i.test(x.src);
      if (isShot) { if (cur && !cur.shot) cur.shot = x; else projects.push({ shot: x, meta: [] }); }
      else if (!cur || cur.shot || cur.meta.length) projects.push({ logo: x, meta: [] });
      else cur.logo = cur.logo ?? x;
    } else if (isH(x) && cur) cur.meta.push(x);
    else tail.push(x);
  }
  const shots = projects.filter((p) => p.shot);
  const marks = projects.filter((p) => !p.shot);
  return (
    <Shell tone={tone}>
      <Label tone={tone}>Website portfolio</Label>
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7" data-reveal>{head.filter(isH).map((h, i) => <T key={i} b={h} />)}</div>
        <div className="lg:col-span-5"><Text blocks={head} tone={tone} lead /></div>
      </div>
      {/* Hierarchy: the first two projects lead large, the rest follow in a tighter grid. Every project stays in the HTML. */}
      <ul role="list" className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-6">
        {shots.map((p, i) => {
          const lead = i < 2;
          return (
            <li key={i} className={`group ${lead ? "col-span-2 lg:col-span-3" : "lg:col-span-2"}`} data-reveal>
              {p.shot ? (
                <div className={`relative overflow-hidden rounded-[16px] bg-white ${lead ? "aspect-[4/5] lg:aspect-[16/13]" : "aspect-[4/5]"}`}>
                  <Img img={p.shot} className="absolute inset-0 h-full w-full object-cover object-top transition-[object-position] duration-[4500ms] ease-in-out group-hover:object-bottom" />
                  <span aria-hidden="true" className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-blue text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"><Arrow className="h-4 w-4" /></span>
                </div>
              ) : null}
              <div className="mt-4 flex flex-col-reverse gap-3 sm:mt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="space-y-1">{p.meta.map((m, j) => <T key={j} b={m} size="meta" />)}</div>
                {p.logo ? <span className="grid h-10 w-fit min-w-10 place-items-center rounded-[10px] bg-white px-2 sm:h-12 sm:min-w-12"><Img img={p.logo} className="max-h-7 w-auto max-w-[5.5rem] object-contain sm:max-h-8 sm:max-w-[6rem]" /></span> : null}
              </div>
            </li>
          );
        })}
      </ul>
      {marks.length ? (
        <ul role="list" className="mt-12 flex flex-wrap items-center gap-3">
          {marks.map((p, i) => (
            <li key={i} className="flex items-center gap-4 rounded-[12px] border border-white/10 px-4 py-3">
              {p.logo ? <span className="grid h-10 place-items-center rounded-[8px] bg-white px-2"><Img img={p.logo} className="max-h-7 w-auto max-w-[6rem] object-contain" /></span> : null}
              {p.meta.map((m, j) => <T key={j} b={m} size="meta" />)}
            </li>
          ))}
        </ul>
      ) : null}
      {tail.length ? <div className="mt-12 space-y-6"><Text blocks={tail} tone={tone} /><Buttons buttons={btns([...head, ...tail])} tone={tone} /><Extras blocks={[...head, ...tail]} tone={tone} /></div> : null}
    </Shell>
  );
}

function Collage({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const imgs = b.filter(isImg);
  const wide = imgs.find((x) => (x.width ?? 0) >= (x.height ?? 0));
  const tall = imgs.find((x) => x !== wide);
  const hs = b.filter(isH);
  return (
    <Shell tone={tone}>
      <div className="max-w-[60rem] space-y-5" data-reveal>
        {hs.map((h, i) => <T key={i} b={h} size={i === 0 && hs.length > 1 ? "kicker" : "h2"} />)}
      </div>
      {b.some(isPara) ? <div className="mt-6"><Text blocks={b} tone={tone} lead /></div> : null}
      {btns(b).length ? <div className="mt-8" data-reveal><Buttons buttons={btns(b)} tone={tone} /></div> : null}
      <div className="mt-12" data-reveal>
        {wide ? <div className={tall ? "hidden md:block" : ""}><Img img={wide} className="h-auto w-full rounded-[18px]" /></div> : null}
        {tall ? <div className={wide ? "md:hidden" : ""}><Img img={tall} className="h-auto w-full rounded-[18px]" /></div> : null}
      </div>
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

function Awards({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const hs = b.filter(isH);
  const img = b.find(isImg);
  return (
    <Shell tone={tone}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7" data-reveal>{img ? <Frame img={img} ratio="aspect-[16/10]" /> : null}</div>
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-4" data-reveal>{hs.map((h, i) => <T key={i} b={h} size={i === 0 && hs.length > 1 ? "kicker" : "h3"} />)}</div>
          <Text blocks={b} tone={tone} lead />
          {btns(b).length ? <div data-reveal><Buttons buttons={btns(b)} tone={tone} /></div> : null}
        </div>
      </div>
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

function Culture({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const imgs = b.filter(isImg);
  return (
    <Shell tone={tone}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-8 lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div data-reveal>{b.filter(isH).map((h, i) => <T key={i} b={h} size="h3" />)}</div>
            <Text blocks={b} tone={tone} />
            {btns(b).length ? <div data-reveal><Buttons buttons={btns(b)} tone={tone} /></div> : null}
          </div>
        </div>
        <ul role="list" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {imgs.map((im, i) => (
            <li key={i} className={i === 0 ? "sm:col-span-2" : ""} data-reveal><Frame img={im} ratio={i === 0 ? "aspect-[16/8]" : "aspect-[3/2]"} /></li>
          ))}
        </ul>
      </div>
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

function Split({ s, tone, flip }: { s: LegacySection; tone: Tone; flip: boolean }) {
  const b = s.blocks;
  const imgs = b.filter(isImg).filter((x) => (x.width ?? 0) >= 300);
  const icons = b.filter(isImg).filter((x) => (x.width ?? 0) < 300);
  const text = b.filter((x) => !isImg(x));
  // Text before the first list/small heading after paragraphs is the editorial column; the rest (cards) follows.
  const hs = text.filter(isH);
  const mainH = hs.filter((h) => h.level <= 3);
  const cardsStart = text.findIndex((x, i) => i > 0 && isH(x) && x.level >= 5 && text.slice(0, i).some(isPara));
  const lead = cardsStart > 0 ? text.slice(0, cardsStart) : text;
  const cards = cardsStart > 0 ? text.slice(cardsStart) : [];
  return (
    <Shell tone={tone}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className={`space-y-7 lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
          <div className="space-y-4" data-reveal>
            {lead.filter(isH).map((h, i) => <T key={i} b={h} size={h.level >= 4 ? "kicker" : mainH.length > 1 && i === 0 && h.text.length < 40 ? "h3" : "h2"} />)}
          </div>
          {icons.length ? <div className="flex gap-3" data-reveal>{icons.map((im, i) => <Img key={i} img={im} className="h-10 w-10" />)}</div> : null}
          <Text blocks={lead} tone={tone} lead />
          {btns(lead).length ? <div data-reveal><Buttons buttons={btns(lead)} tone={tone} /></div> : null}
        </div>
        <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`} data-reveal>
          {imgs.length === 1 ? <Frame img={imgs[0]} ratio="aspect-[4/3]" /> : null}
          {cards.length || imgs.length > 1 ? (
            <div className="rounded-[22px] bg-ink p-6 text-white on-dark md:p-8">
              <div className="grid gap-4">
                {imgs.length > 1 ? imgs.map((im, i) => <Frame key={i} img={im} ratio={i === 0 ? "aspect-[16/9]" : "aspect-square max-w-[8rem]"} />) : null}
                <div className="legacy-cards space-y-3"><Flow blocks={cards} tone="dark" /></div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Extras blocks={lead} tone={tone} />
    </Shell>
  );
}

function Reasons({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const title = b.find(isH)!;
  const rows: { h: H; body: Block[] }[] = [];
  const intro: Block[] = [];
  for (const x of b.slice(b.indexOf(title) + 1)) {
    if (isH(x)) rows.push({ h: x, body: [] });
    else if (rows.length) rows[rows.length - 1].body.push(x);
    else intro.push(x);
  }
  return (
    <Shell tone={tone}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div data-reveal>{/why/i.test(title.text) ? <Label tone={tone}>Why ScaleAcres</Label> : null}<div className={/why/i.test(title.text) ? "mt-6" : ""}><T b={title} /></div></div>
            <Text blocks={intro} tone={tone} />
            {btns(intro).length ? <div data-reveal><Buttons buttons={btns(intro)} tone={tone} /></div> : null}
            <Extras blocks={intro} tone={tone} />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {rows.map((r, i) => (
            <li key={i} className={`group grid grid-cols-[3.5rem_1fr] gap-6 border-t py-9 md:grid-cols-[5.5rem_1fr] md:gap-8 ${dark(tone) ? "border-white/12" : "border-line"}`} data-reveal>
              <span aria-hidden="true" className="text-[clamp(2.5rem,1.5rem+2.5vw,4.5rem)] font-black leading-none tracking-[-0.05em] text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_rgba(56,189,248,0.6)] group-hover:text-sky">{String(i + 1).padStart(2, "0")}</span>
              <div className="space-y-4">
                <T b={r.h} size="card" className="!text-[clamp(1.375rem,1rem+1vw,2rem)] !font-extrabold" />
                <Text blocks={r.body} tone={tone} />
                {r.body.filter(isImg).map((im, j) => <Frame key={j} img={im} />)}
                {btns(r.body).length ? <Buttons buttons={btns(r.body)} tone={tone} /> : null}
                <Extras blocks={r.body} tone={tone} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}

/** Key figures: each numeric heading with the copy that follows it as its label. */
function Stats({ s }: { s: LegacySection }) {
  const b = s.blocks;
  const first = b.findIndex(isStatHeading);
  const head = b.slice(0, first);
  const items: { n: H; body: Block[] }[] = [];
  const tail: Block[] = [];
  for (const x of b.slice(first)) {
    if (isStatHeading(x)) items.push({ n: x as H, body: [] });
    else if (isH(x) || asButton(x)) tail.push(x);
    else items[items.length - 1].body.push(x);
  }
  return (
    <Reveal as="section" className={`relative isolate overflow-hidden ${navyBg} py-[clamp(5rem,10vw,8rem)]`}>
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,78,216,0.45),transparent)]" />
      <div className="container-x mx-auto max-w-[120rem]">
        {head.length ? (
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7" data-reveal>{head.filter(isH).map((h, i) => <T key={i} b={h} />)}</div>
            <div className="lg:col-span-5"><Text blocks={head} tone="dark" lead /></div>
          </div>
        ) : null}
        <ul role="list" className={`grid gap-px overflow-hidden rounded-[20px] bg-white/10 sm:grid-cols-2 ${items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} ${head.length ? "mt-14" : ""}`}>
          {items.map((it, i) => (
            <li key={i} className="bg-navy p-8 md:p-10" data-reveal>
              <Html as={`h${it.n.level}`} html={it.n.html} className="legacy-h text-[clamp(3rem,1.8rem+3.4vw,5.5rem)] font-black leading-none tracking-[-0.05em] text-sky" />
              <div className="mt-5 text-white/75"><Text blocks={it.body} tone="dark" /></div>
              <Extras blocks={it.body} tone="dark" />
            </li>
          ))}
        </ul>
        {tail.length ? <div className="mt-10 space-y-6"><Flow blocks={tail.filter(isH)} tone="dark" />{btns(tail).length ? <Buttons buttons={btns(tail)} tone="dark" /> : null}</div> : null}
      </div>
    </Reveal>
  );
}

/** Offerings written as a run of headings: an interactive, numbered list with a sticky title. */
function Rows({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const hs = b.filter(isH);
  const title = hs[0];
  const rows: { h: H; body: Block[]; step?: H }[] = [];
  const intro: Block[] = [];
  const stepped = hs.filter((h) => /^step\s*\d+/i.test(h.text)).length >= 2;
  for (const x of b.slice(b.indexOf(title) + 1)) {
    const last = rows[rows.length - 1];
    if (stepped && isH(x) && /^step\s*\d+/i.test(x.text)) rows.push({ h: x, body: [], step: x });
    else if (stepped && isH(x) && last?.step && last.h === last.step) last.h = x;
    else if (stepped && isH(x) && last) last.body.push(x);
    else if (isH(x)) rows.push({ h: x, body: [] });
    else if (last) last.body.push(x);
    else intro.push(x);
  }
  // A closing paragraph after the last offering reads as the section's summary.
  const last = rows[rows.length - 1];
  const outro = last && last.body.length && last.body.every((x) => isPara(x) || asButton(x)) && rows.slice(0, -1).every((r) => !r.body.length) ? last.body.splice(0) : [];
  return (
    <Shell tone={tone}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div data-reveal><T b={title} /></div>
            <Text blocks={[...intro, ...outro]} tone={tone} />
            {btns([...intro, ...outro]).length ? <div data-reveal><Buttons buttons={btns([...intro, ...outro])} tone={tone} /></div> : null}
          </div>
        </div>
        <ol className="lg:col-span-7">
          {rows.map((r, i) => (
            <li key={i} className={`group grid grid-cols-[3rem_1fr_auto] items-start gap-5 border-t py-7 transition-colors duration-500 md:grid-cols-[4rem_1fr_auto] ${dark(tone) ? "border-white/12 hover:border-sky" : "border-line hover:border-blue"}`} data-reveal>
              {r.step ? (
                <Html as={`h${r.step.level}`} html={r.step.html} className={`legacy-h pt-1 text-[0.75rem] font-bold uppercase tracking-[0.14em] ${dark(tone) ? "text-sky" : "text-blue"}`} />
              ) : (
                <span aria-hidden="true" className={`pt-1 text-[0.875rem] font-bold tabular-nums tracking-[0.12em] ${dark(tone) ? "text-sky" : "text-blue"}`}>{String(i + 1).padStart(2, "0")}</span>
              )}
              <div className="space-y-3">
                {r.h !== r.step ? <T b={r.h} size="card" className="!text-[clamp(1.25rem,1rem+0.9vw,1.875rem)] !font-extrabold transition-transform duration-500 group-hover:translate-x-1" /> : null}
                {r.body.filter(isH).map((h, j) => <Html key={j} as={`h${h.level}`} html={h.html} className={`legacy-h max-w-[60ch] text-[1rem] font-normal leading-relaxed ${dark(tone) ? "text-white/70" : "text-graphite"}`} />)}
                <Text blocks={r.body} tone={tone} />
                {btns(r.body).length ? <Buttons buttons={btns(r.body)} tone={tone} /> : null}
                <Extras blocks={r.body} tone={tone} />
              </div>
              <Arrow className={`mt-2 h-4 w-4 opacity-30 transition-all duration-500 group-hover:opacity-100 ${dark(tone) ? "group-hover:text-sky" : "group-hover:text-blue"}`} />
            </li>
          ))}
        </ol>
      </div>
    </Shell>
  );
}

/** Film reel: each video with the title that follows it. */
function Videos({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const first = b.findIndex((x) => x.type === "video");
  const head = b.slice(0, first);
  const items: { v: Extract<Block, { type: "video" }>; meta: Block[] }[] = [];
  for (const x of b.slice(first)) {
    if (x.type === "video") items.push({ v: x, meta: [] });
    else items[items.length - 1].meta.push(x);
  }
  return (
    <Shell tone={tone}>
      <Label tone={tone}>Films</Label>
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7" data-reveal>{head.filter(isH).map((h, i) => <T key={i} b={h} />)}</div>
        <div className="space-y-6 lg:col-span-5"><Text blocks={head} tone={tone} lead />{btns(head).length ? <Buttons buttons={btns(head)} tone={tone} /> : null}</div>
      </div>
      <ul role="list" className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={i} data-reveal>
            <Video b={it.v} />
            <div className="mt-4 space-y-2">
              {it.meta.filter(isH).map((h, j) => <T key={j} b={h} size="card" />)}
              <Text blocks={it.meta} tone={tone} />
              {btns(it.meta).length ? <Buttons buttons={btns(it.meta)} tone={tone} /> : null}
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

/** Short call to action on Royal Navy. A line repeated for another breakpoint is shown once (both stay in the HTML). */
function Callout({ s }: { s: LegacySection }) {
  const hs = s.blocks.filter(isH);
  const seen = new Set<string>();
  return (
    <section className={`relative isolate overflow-hidden ${navyBg}`}>
      <div aria-hidden="true" className="absolute -right-32 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,78,216,0.5),transparent)]" />
      <div className="container-x mx-auto flex max-w-[120rem] flex-col items-start justify-between gap-8 py-[clamp(3rem,6vw,5rem)] lg:flex-row lg:items-center" data-reveal>
        <div>
          {hs.map((h, i) => {
            const key = plain(h.html).toLowerCase();
            const dup = seen.has(key);
            seen.add(key);
            return <Html key={i} as={`h${h.level}`} html={h.html} className={`legacy-h max-w-[30ch] text-[clamp(1.5rem,1rem+1.6vw,2.75rem)] font-extrabold uppercase leading-[1] tracking-[-0.03em] ${dup ? "hidden" : ""}`} />;
          })}
        </div>
        <Buttons buttons={btns(s.blocks)} tone="dark" />
      </div>
    </section>
  );
}

/** A wide banner image shown full-bleed on black. */
function Banner({ s }: { s: LegacySection }) {
  return (
    <section className="on-dark bg-ink pb-[clamp(2.5rem,5vw,4rem)]">
      <div className="container-x mx-auto max-w-[120rem] space-y-4">
        {s.blocks.filter(isImg).map((im, i) => <Img key={i} img={im} className="h-auto w-full rounded-[18px]" />)}
      </div>
    </section>
  );
}

function Creatives({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const imgs = b.filter(isImg);
  return (
    <Shell tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7" data-reveal><Label tone={tone}>Creative studio</Label><div className="mt-6">{b.filter(isH).map((h, i) => <T key={i} b={h} />)}</div></div>
        <div className="lg:col-span-5"><Text blocks={b} tone={tone} lead /></div>
      </div>
      <ul role="list" className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {imgs.map((im, i) => (
          <li key={i} className={i % 2 ? "lg:translate-y-10" : ""} data-reveal>
            {/* Landscape artwork is shown whole rather than cropped into the portrait frame. */}
            <Frame img={im} ratio="aspect-[4/5]" position={(im.width ?? 0) > (im.height ?? 0) * 1.2 ? "!object-contain bg-ink" : "object-center"} />
          </li>
        ))}
      </ul>
      {btns(b).length ? <div className="mt-20"><Buttons buttons={btns(b)} tone={tone} /></div> : null}
      <Extras blocks={s.blocks} tone={tone} />
    </Shell>
  );
}

function FaqSection({ s, tone }: { s: LegacySection; tone: Tone }) {
  const b = s.blocks;
  const faq = b.find((x) => x.type === "faq") as Extract<Block, { type: "faq" }>;
  const head = b.filter((x) => x !== faq);
  return (
    <Shell tone={tone}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-28">
            <Label tone={tone}>Frequently asked questions</Label>
            <div data-reveal>{head.filter(isH).map((h, i) => <T key={i} b={h} size="h3" />)}</div>
            <Text blocks={head} tone={tone} />
            <div data-reveal><Buttons buttons={[...btns(head), { href: "/contact-us/", text: "Ask us more" }]} tone={tone} /></div>
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal><Faq b={faq} tone={tone} /></div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ composer */

const LIGHT_ORDER: Tone[] = ["light", "mist"];

/** Heading-only fragments join the section after them; the H1 section leads. */
function prepare(page: LegacyPage, form: FormCounter): LegacySection[] {
  // Only the page's first form becomes the working form; any later one links to it, wherever it is rendered.
  const raw = page.sections
    .filter((s) => s.blocks.length)
    .map((s) => ({ ...s, blocks: s.blocks.map((b) => (b.type === "form" ? { ...b, primary: b === form.first } : b)) }));
  const merged: LegacySection[] = [];
  let carry: Block[] = [];
  for (const s of raw) {
    const headingOnly = s.blocks.length <= 3 && s.blocks.every(isH) && !s.blocks.some((x) => isH(x) && x.level === 1);
    if (headingOnly) { carry.push(...s.blocks); continue; }
    merged.push(carry.length ? { ...s, blocks: [...carry, ...s.blocks] } : s);
    carry = [];
  }
  if (carry.length) merged.push({ ...raw[raw.length - 1], blocks: carry });
  const h1 = merged.findIndex((s) => s.blocks.some((x) => isH(x) && x.level === 1));
  return h1 > 0 ? [merged[h1], ...merged.slice(0, h1), ...merged.slice(h1 + 1)] : merged;
}

export function ComposedPage({ page, form, label }: { page: LegacyPage; form: FormCounter; label: string }) {
  const prepared = prepare(page, form);
  const hasHero = prepared[0]?.blocks.some((x) => isH(x) && x.level === 1);
  const heroParts = hasHero ? splitHero(prepared[0]) : null;
  // The blocks after the hero group (a logo wall, an intro…) are composed as a section of their own.
  const secs = heroParts ? [prepared[0], ...(heroParts.after.length ? [{ ...prepared[0], blocks: heroParts.after }] : []), ...prepared.slice(1)] : prepared;
  const kinds = secs.map((s, i) => (i === 0 && heroParts ? "hero" : kindOf(s, Math.max(i, 1))));
  // Hero backdrop: the page's own editorial photography (split sections first, then awards/culture),
  // never a client logo, a card thumbnail, a screenshot or an animated GIF; a descriptive alt marks a real photograph.
  const backdrop = (["split", "awards", "culture"] as Kind[])
    .flatMap((kind) => secs.filter((s, i) => kinds[i] === kind && !s.blocks.some((x) => isH(x) && x.level >= 5)))
    .flatMap((s) => s.blocks)
    .filter(isImg)
    .find((x) => (x.width ?? 0) >= 700 && (x.width ?? 0) >= (x.height ?? 0) * 1.2 && !/\.(svg|gif)$/i.test(x.src) && (x.alt ?? "").trim().split(/\s+/).length >= 3);
  const out: ReactNode[] = [];
  // Pages without an H1 still open on the dark band with their label and breadcrumb (no heading is invented).
  if (!heroParts) out.push(<PageHead key="head" page={page} label={label} />);
  let light = 0;
  const nextLight = () => LIGHT_ORDER[light++ % 2];
  let flip = false;

  for (let i = 0; i < secs.length; i++) {
    const s = secs[i];
    const k = kinds[i];
    // Funnel: a heading-only intro (≤1 paragraph, no images) followed by stage sections with lists.
    if (k === "statement" && !s.blocks.some(isImg) && s.blocks.filter(isPara).length <= 1 && secs[i + 1]?.blocks.some((x) => x.type === "list")) {
      const stages: LegacySection[] = [];
      let j = i + 1;
      while (j < secs.length && secs[j].blocks.some((x) => x.type === "list") && secs[j].blocks.some(isH)) stages.push(secs[j++]);
      const cta = kinds[j] === "cta" ? secs[j++] : undefined;
      if (stages.length >= 2) {
        out.push(<Funnel key={i} intro={s} stages={stages} cta={cta} />);
        i = j - 1;
        continue;
      }
    }
    switch (k) {
      case "hero": out.push(<Hero key={i} page={page} backdrop={backdrop} label={label} parts={heroParts!} />); break;
      case "stats": out.push(<Stats key={i} s={s} />); break;
      case "rows": out.push(<Rows key={i} s={s} tone={nextLight()} />); break;
      case "banner": out.push(<Banner key={i} s={s} />); break;
      case "videos": out.push(<Videos key={i} s={s} tone="dark" />); break;
      case "callout": out.push(<Callout key={i} s={s} />); break;
      case "logos": out.push(<Logos key={i} blocks={s.blocks} tone={nextLight()} />); break;
      case "testimonials": out.push(<Testimonials key={i} s={s} tone="mist" />); light = 0; break;
      case "statement": out.push(<Statement key={i} s={s} tone={nextLight()} />); break;
      case "showcase": out.push(<Showcase key={i} s={s} tone="dark" />); break;
      case "results": out.push(<Results key={i} s={s} tone={nextLight()} />); break;
      case "portfolio": out.push(<Portfolio key={i} s={s} tone="dark" />); break;
      case "collage": out.push(<Collage key={i} s={s} tone={nextLight()} />); break;
      case "awards": out.push(<Awards key={i} s={s} tone={nextLight()} />); break;
      case "culture": out.push(<Culture key={i} s={s} tone={nextLight()} />); break;
      case "split": out.push(<Split key={i} s={s} tone={nextLight()} flip={(flip = !flip)} />); break;
      case "reasons": out.push(<Reasons key={i} s={s} tone="dark" />); break;
      case "creatives": out.push(<Creatives key={i} s={s} tone="dark" />); break;
      case "faq": out.push(<FaqSection key={i} s={s} tone="light" />); break;
      case "cta":
        out.push(
          <section key={i} className="bg-white py-10"><div className="container-x mx-auto flex max-w-[120rem] justify-center"><Buttons buttons={btns(s.blocks)} tone="light" /></div></section>,
        );
        break;
      default: {
        const t = nextLight();
        out.push(<SectionBand key={i} blocks={s.blocks} tone={t} index={i} form={form} />);
      }
    }
  }
  return <>{out}</>;
}
