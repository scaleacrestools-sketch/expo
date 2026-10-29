import Link from "next/link";
import { createElement, type CSSProperties, type ReactNode } from "react";
import { media, mediaHtml, plain, type Block, type LegacySection } from "@/lib/legacy";
import { asButton, isStatHeading, toItems } from "@/components/legacy/LegacyBlocks";
import { ArrowUR, Tag } from "@/components/nd/ui";
import { NdContactForm } from "@/components/nd/NdContactForm";
import { site } from "@/content/site";
import { Accordion } from "@/components/site/Accordion";
import { StatRow, lines } from "@/components/site/Kit";
import { Words } from "@/components/nd/ui";

/**
 * Renders a page's live content (verbatim blocks from the scaleacres.com capture) in the homepage
 * design language. Content is never edited here: only grouped and typeset. Patterns that read as
 * cards (an image or short heading followed by a line or two) become card grids, stat headings
 * become a stat row, image runs become galleries or logo walls, FAQs become the homepage accordion.
 */

type H = Extract<Block, { type: "heading" }>;
type I = Extract<Block, { type: "image" }>;
const isH = (b: Block): b is H => b.type === "heading";
const isImg = (b: Block): b is I => b.type === "image";
const isP = (b: Block) => b.type === "paragraph" && !asButton(b);
const text = (b: Block) => ("html" in b ? plain(b.html) : "");

export const Html = ({ as = "div", html, className }: { as?: string; html: string; className?: string }) =>
  createElement(as, { className, dangerouslySetInnerHTML: { __html: mediaHtml(html) } });

/* ------------------------------------------------------------------ images */

export function Pict({ img, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", eager = false }: { img: I; className?: string; sizes?: string; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media(img.src)} alt={img.alt ?? ""} width={img.width ?? undefined} height={img.height ?? undefined} loading={eager ? "eager" : "lazy"} decoding="async" sizes={sizes} className={className} />;
}

const small = (i: I) => (i.width ?? 0) > 0 && (i.width ?? 0) <= 520;
const decorative = (i: I) => /\.svg$/i.test(i.src) && !/logo/i.test(i.src);

export function Gallery({ images, dark = false }: { images: I[]; dark?: boolean }) {
  const shown = images.filter((i) => !decorative(i));
  if (!shown.length) return null;
  const logos = shown.length >= 4 && shown.filter(small).length / shown.length > 0.6;
  if (logos) {
    return (
      <ul role="list" className={`grid grid-cols-2 border-l border-t sm:grid-cols-3 lg:grid-cols-6 ${dark ? "border-white/12" : "border-[color:var(--line-l)]"}`}>
        {shown.map((img, i) => (
          <li key={i} data-nd="up" style={{ "--d": (i % 6) * 50 } as CSSProperties} className={`grid aspect-[3/2] place-items-center border-b border-r p-5 ${dark ? "border-white/12" : "border-[color:var(--line-l)] bg-white"}`}>
            <Pict img={img} sizes="200px" className="max-h-14 w-auto max-w-[80%] object-contain opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0" />
          </li>
        ))}
      </ul>
    );
  }
  if (shown.length === 1) {
    const img = shown[0];
    if ((img.width ?? 999) < 220) return <Pict img={img} sizes="200px" className="h-auto max-h-20 w-auto" />;
    return (
      <figure className="m-0">
        <div data-nd="clip" className="nd-zoom overflow-hidden rounded-[10px] shadow-[var(--sh-2)]">
          <div className="nd-settle"><Pict img={img} className="block h-auto w-full" /></div>
        </div>
        {img.caption ? <Html as="figcaption" html={img.caption} className="nd-label nd-muted mt-3" /> : null}
      </figure>
    );
  }
  const cols = shown.length === 2 ? "sm:grid-cols-2" : shown.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul role="list" className={`grid gap-[clamp(0.75rem,1.5vw,1.25rem)] ${cols}`}>
      {shown.map((img, i) => (
        <li key={i} data-nd="clip" style={{ "--d": (i % 4) * 70 } as CSSProperties} className="nd-zoom overflow-hidden rounded-[8px] shadow-[var(--sh-1)]">
          <div className="nd-settle"><Pict img={img} sizes="(min-width: 1024px) 33vw, 50vw" className="block h-auto w-full" /></div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ text */

export function Heading({ b, dark = false }: { b: H; dark?: boolean }) {
  const t = text(b);
  if (b.level <= 2) return <Html as={`h${Math.max(2, b.level)}`} html={b.html} className="nd-h2 mt-2" />;
  if (b.level === 3) return <Html as="h3" html={b.html} className="nd-h3" />;
  if (b.level === 4) return <Html as="h4" html={b.html} className="nd-h4" />;
  return t.length <= 40 ? <Html as={`h${b.level}`} html={b.html} className={`nd-label ${dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"}`} /> : <Html as={`h${b.level}`} html={b.html} className="nd-h4" />;
}

function ListEl({ b }: { b: Extract<Block, { type: "list" }> }) {
  return (
    <ul role="list" className="nd-list" data-ordered={b.ordered ? "1" : undefined}>
      {b.items.map((it, i) => (
        <li key={i} className="flex gap-4 border-t border-[color:var(--rule)] py-3">
          <span className="nd-label w-7 shrink-0 tabular-nums text-[color:var(--royal)] [.nd-dark_&]:text-[color:var(--sky)]">{String(i + 1).padStart(2, "0")}</span>
          <Html as="span" html={it} className="min-w-0 flex-1" />
        </li>
      ))}
    </ul>
  );
}

function TableEl({ b }: { b: Extract<Block, { type: "table" }> }) {
  return (
    <div className="overflow-x-auto">
      <table className="nd-table w-full min-w-[34rem] border-collapse text-left">
        <tbody>
          {b.rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => createElement(c.h ? "th" : "td", { key: j, dangerouslySetInnerHTML: { __html: mediaHtml(c.html) } }))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Video({ b, title }: { b: Extract<Block, { type: "video" }>; title?: string }) {
  if (b.embed) {
    let src = b.embed;
    const yt = src.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    const map = /maps\.google|google\.com\/maps/.test(src);
    const portrait = /shorts\//.test(b.embed);
    return (
      <div data-nd="clip" className={`overflow-hidden rounded-[10px] bg-[color:var(--ink)] shadow-[var(--sh-2)] ${portrait ? "mx-auto aspect-[9/16] max-w-[22rem]" : map ? "aspect-[4/3] md:aspect-[16/7]" : "aspect-video"}`}>
        <iframe src={src} title={title || b.title || (map ? "ScaleAcres studio location on Google Maps" : "Video")} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" className={`h-full w-full border-0 ${map ? "[filter:grayscale(0.35)_contrast(1.05)]" : ""}`} />
      </div>
    );
  }
  return <video src={media(b.src)} poster={b.poster ? media(b.poster) : undefined} controls preload="none" playsInline className="w-full rounded-[10px] bg-[color:var(--ink)]" />;
}

export function Buttons({ buttons, dark = false }: { buttons: { href: string; text: string }[]; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((b, i) => {
        const t = b.text.replace(/\s*»\s*$/, "").trim();
        const cls = `nd-btn ${i === 0 ? "nd-btn--royal" : dark ? "nd-btn--white" : "nd-btn--ink"} min-w-[13rem]`;
        return /^https?:/.test(b.href) || b.href.startsWith("tel:") || b.href.startsWith("mailto:") ? (
          <a key={i} href={b.href} className={cls} {...(/^https?:/.test(b.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{t} <ArrowUR /></a>
        ) : (
          <Link key={i} href={b.href} className={cls}>{t} <ArrowUR /></Link>
        );
      })}
    </div>
  );
}

export function FormPanel({ dark = false, id = "enquiry" }: { dark?: boolean; id?: string }) {
  return (
    <div id={id} className={`scroll-mt-28 rounded-[16px] bg-[color:var(--ink)] p-[clamp(1.25rem,3vw,2.75rem)] text-white ${dark ? "ring-1 ring-white/10" : "shadow-[var(--sh-3)]"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/12 pb-5">
        <p className="text-[clamp(1.35rem,2vw,1.75rem)] font-semibold tracking-[-0.025em]">Send an enquiry</p>
        <p className="text-[0.9375rem] text-white/60">Prefer to talk? <a href={site.phones[0].href} className="font-medium text-white underline-offset-4 hover:underline">{site.phones[0].number}</a></p>
      </div>
      <div className="nd-dark mt-7 bg-transparent"><NdContactForm /></div>
    </div>
  );
}

/** Linear rendering of blocks (body copy, post bodies, FAQ answers). */
/** The page's first form is the working form; later ones link to it. */
function claimForm(f?: { v: boolean }) {
  if (f) f.v = true;
}

export function Flow({ blocks, dark = false, formUsed }: { blocks: Block[]; dark?: boolean; formUsed?: { v: boolean } }) {
  return (
    <div className="nd-flow">
      {toItems(blocks).map((it, i) => {
        if (it.kind === "gallery") return <Gallery key={i} images={it.images} dark={dark} />;
        if (it.kind === "stats") return <StatRow key={i} dark={dark} stats={it.stats.map((s) => ({ value: typeof s.value === "string" ? s.value : String(s.value), label: s.label }))} />;
        if (it.kind === "buttons") return <Buttons key={i} buttons={it.buttons} dark={dark} />;
        const b = it.block;
        switch (b.type) {
          case "heading": return <Heading key={i} b={b} dark={dark} />;
          case "paragraph": return /facebook\.com\/sharer|twitter\.com\/intent|linkedin\.com\/share/.test(b.html) ? null : <Html key={i} as="p" html={b.html} />;
          case "list": return <ListEl key={i} b={b} />;
          case "table": return <TableEl key={i} b={b} />;
          case "faq": return <Accordion key={i} dark={dark} items={b.items.map((f) => ({ q: plain(f.q), a: <Flow blocks={f.answer} dark={dark} /> }))} />;
          case "video": return <Video key={i} b={b} />;
          case "quote": return <Html key={i} as="blockquote" html={b.html} className="border-l-2 border-[color:var(--royal)] pl-6 text-[1.375rem] leading-[1.45]" />;
          case "form": {
            if (formUsed?.v) return <Buttons key={i} buttons={[{ href: "#enquiry", text: "Enquire now" }]} dark={dark} />;
            claimForm(formUsed);
            return <FormPanel key={i} dark={dark} />;
          }
          case "rule": return <hr key={i} className="border-[color:var(--rule)]" />;
          default: return null;
        }
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ section composer */

type Card = { img?: I; title: H; body: Block[]; logo?: I };

/** Finds runs of [image?] heading(h3–h6, short) [paragraph…] repeated three or more times. */
export function findCards(blocks: Block[]) {
  const cards: Card[] = [];
  let i = 0, start = -1, end = -1;
  const flush = () => { if (cards.length < 3) { cards.length = 0; start = -1; } };
  while (i < blocks.length) {
    const b = blocks[i];
    let img: I | undefined;
    let j = i;
    if (isImg(b) && blocks[i + 1] && isH(blocks[i + 1])) { img = b; j = i + 1; }
    const h = blocks[j];
    if (h && isH(h) && h.level >= 3 && text(h).length <= 70 && !isStatHeading(h)) {
      const body: Block[] = [];
      let k = j + 1;
      while (k < blocks.length && (isP(blocks[k]) || blocks[k].type === "list" || asButton(blocks[k])) && body.length < 4) { body.push(blocks[k]); k++; }
      // a following image (not followed by a heading) belongs to this card when it has none yet
      let logo: I | undefined;
      if (!img && blocks[k] && isImg(blocks[k]) && !(blocks[k + 1] && isH(blocks[k + 1]))) { img = blocks[k] as I; k++; }
      // a client's logo after a person card (photo, name, logo)
      else if (img && blocks[k] && isImg(blocks[k]) && (!blocks[k + 1] || isImg(blocks[k + 1]) || isH(blocks[k + 1]) === false)) { logo = blocks[k] as I; k++; }
      if (start < 0) start = i;
      cards.push({ img, title: h, body, logo });
      end = k;
      i = k;
      continue;
    }
    if (cards.length >= 3) break;
    flush();
    i++;
  }
  if (cards.length < 3) return null;
  return { start, end, cards };
}

export function Cards({ cards, dark = false, people = false }: { cards: Card[]; dark?: boolean; people?: boolean }) {
  const withImg = cards.filter((c) => c.img && !decorative(c.img)).length;
  if (withImg >= cards.length * 0.6) {
    return (
      <ul role="list" className={`grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-10 ${people ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {cards.map((c, i) => (
          <li key={i} className="group">
            {c.img ? (
              <div data-nd="clip" style={{ "--d": (i % 5) * 60 } as CSSProperties} className={`nd-zoom relative overflow-hidden rounded-[8px] bg-[color:var(--mist)] shadow-[var(--sh-1)] transition-shadow duration-500 group-hover:shadow-[var(--sh-2)] ${people ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <div className="nd-settle absolute inset-0"><Pict img={c.img} sizes={people ? "(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 46vw" : "(min-width: 1024px) 31vw, 50vw"} className={`absolute inset-0 h-full w-full object-cover ${people ? "object-top" : ""}`} /></div>
              </div>
            ) : null}
            <div data-nd="up" style={{ "--d": (i % 5) * 60 + 100 } as CSSProperties} className="mt-4">
              <Html as={`h${c.title.level}`} html={c.title.html} className={people ? "text-[1.0625rem] font-semibold leading-tight tracking-[-0.01em]" : "nd-h4"} />
              {c.logo ? <Pict img={c.logo} sizes="120px" className="mt-3 h-8 w-auto max-w-[8rem] object-contain object-left opacity-80" /> : null}
              {c.body.length ? <div className={`mt-1.5 ${people ? `text-[0.9375rem] ${dark ? "text-white/60" : "text-[color:var(--muted-l)]"}` : "nd-flow nd-flow--sm"}`}><Flow blocks={c.body} dark={dark} /></div> : null}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ol role="list" className={`grid border-t sm:grid-cols-2 lg:grid-cols-3 ${dark ? "border-white/12" : "border-[color:var(--line-l)]"}`}>
      {cards.map((c, i) => (
        <li key={i} data-nd="up" style={{ "--d": (i % 3) * 80 } as CSSProperties} className={`border-b px-[clamp(0.75rem,1.2vw,1.25rem)] py-7 sm:border-r ${dark ? "border-white/12" : "border-[color:var(--line-l)]"}`}>
          <span className={`nd-label tabular-nums ${dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"}`}>{String(i + 1).padStart(2, "0")}</span>
          <Html as={`h${c.title.level}`} html={c.title.html} className="nd-h4 mt-4" />
          {c.body.length ? <div className="nd-flow nd-flow--sm mt-3"><Flow blocks={c.body} dark={dark} /></div> : null}
        </li>
      ))}
    </ol>
  );
}

/** Splits leading headings/intro off a section. */
export function splitHead(blocks: Block[]) {
  let i = 0;
  const heads: H[] = [];
  while (i < blocks.length && isH(blocks[i]) && !isStatHeading(blocks[i]) && heads.length < 3) { heads.push(blocks[i] as H); i++; }
  if (!heads.length) return { kicker: null as H | null, title: null as H | null, rest: blocks };
  // a short first heading above a bigger one reads as a kicker ("Case study's" → "Delivering Success…")
  if (heads.length >= 2 && text(heads[0]).length <= 32 && heads[1].level <= heads[0].level + 1) return { kicker: heads[0], title: heads[1], rest: [...heads.slice(2), ...blocks.slice(i)] };
  return { kicker: null, title: heads[0], rest: [...heads.slice(1), ...blocks.slice(i)] };
}

/**
 * One live section as an editorial band: title (and kicker) across two columns with the intro
 * beside it, then card grids, galleries and body copy at full width.
 */
export function Band({ s, dark = false, label, formUsed, titleAs }: { s: LegacySection; dark?: boolean; label?: string; formUsed?: { v: boolean }; titleAs?: "h1" | "h2" }) {
  const { kicker, title, rest } = splitHead(s.blocks);
  const firstText = rest.findIndex((b) => isP(b));
  const intro = firstText === 0 ? rest[0] : null;
  const body = intro ? rest.slice(1) : rest;
  const cards = findCards(body);
  const before = cards ? body.slice(0, cards.start) : body;
  const after = cards ? body.slice(cards.end) : [];
  const textOnly = (bs: Block[]) => bs.every((b) => b.type === "paragraph" || b.type === "heading" || b.type === "list" || b.type === "quote" || asButton(b));
  const titleText = title ? text(title) : "";
  const bodyOf = (bs: Block[]) =>
    !bs.length ? null : textOnly(bs) ? (
      <div className="nd-grid mt-10"><div className="nd-cell lg:col-span-2 lg:col-start-2"><Flow blocks={bs} dark={dark} formUsed={formUsed} /></div></div>
    ) : (
      <div className="nd-cell mt-10"><Flow blocks={bs} dark={dark} formUsed={formUsed} /></div>
    );
  return (
    <>
      {title ? (
        <div className="nd-grid items-end gap-y-6">
          <div className="nd-cell lg:col-span-2">
            <div data-nd="up"><Tag>{kicker ? text(kicker) : label ?? "ScaleAcres"}</Tag></div>
            <Words
              as={titleAs ?? ((title.level <= 2 ? "h2" : `h${Math.min(6, title.level)}`) as "h2" | "h3" | "h4" | "h5" | "h6")}
              lines={lines(titleText, titleText.length > 60 ? 34 : 24)}
              className={`mt-6 font-semibold ${titleText.length > 60 ? "text-[clamp(1.8rem,3.2vw,3.25rem)] leading-[1.04] tracking-[-0.035em]" : "text-[clamp(2.2rem,4.8vw,4.75rem)] leading-[0.96] tracking-[-0.045em]"}`}
            />
          </div>
          {intro ? <Html as="p" html={(intro as { html: string }).html} className={`nd-cell nd-lead max-w-[30rem] lg:pb-2 ${dark ? "text-white/72" : "nd-muted"}`} /> : null}
        </div>
      ) : intro ? (
        <div className="nd-grid"><Html as="p" html={(intro as { html: string }).html} className="nd-cell nd-lead lg:col-span-2" /></div>
      ) : null}
      {bodyOf(before)}
      {cards ? <div className="nd-cell mt-12"><Cards cards={cards.cards} dark={dark} /></div> : null}
      {bodyOf(after)}
    </>
  );
}

/** Pulls the obvious stats (value heading + short label) out of a section for a stat row. */
export function sectionStats(s: LegacySection) {
  const out: { value: string; label: string }[] = [];
  s.blocks.forEach((b, i) => {
    if (isStatHeading(b)) {
      const n = s.blocks[i + 1];
      out.push({ value: text(b), label: n && n.type === "paragraph" ? text(n) : "" });
    }
    if (b.type === "stat") out.push({ value: b.value, label: b.label });
  });
  return out;
}

export const blockText = text;
export type { Card, H as HeadingBlock, I as ImageBlock };
export function Spacer({ children }: { children?: ReactNode }) { return <div className="mt-[clamp(3rem,6vw,5rem)]">{children}</div>; }
