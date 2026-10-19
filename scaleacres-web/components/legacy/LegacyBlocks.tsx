import { createElement, Fragment, type ReactNode } from "react";
import Link from "next/link";
import { media, mediaHtml, plain, type Block } from "@/lib/legacy";
import { Arrow } from "@/components/ui/Arrow";
import { ContactForm } from "@/components/ContactForm";

/**
 * Presentation-only renderer for captured live content. Text, heading tags and levels, links,
 * image sources and alt text are rendered exactly as captured; only layout and styling change.
 */

export type Tone = "hero" | "light" | "mist" | "dark";
const onDark = (t: Tone) => t === "hero" || t === "dark";

/* ------------------------------------------------------------------ helpers */

const BUTTON_RE = /^\s*<a href="([^"]+)"[^>]*>\s*([^<]{1,48}?)\s*<\/a>\s*$/;
export const asButton = (b: Block): { href: string; text: string } | null => {
  if (b.type === "button") return { href: b.href, text: b.text };
  if (b.type === "paragraph") {
    const m = b.html.match(BUTTON_RE);
    if (m) return { href: m[1], text: m[2].trim() };
  }
  return null;
};
const STAT_RE = /^[\s₹$€£]*[\d][\d.,]*\s*(cr|crore|lacs?|lakhs?|k|m|mn|bn|x|%)?\s*\+?\s*$/i;
export const isStatHeading = (b: Block) => b.type === "heading" && b.text.length <= 14 && STAT_RE.test(b.text);
const textLen = (bs: Block[]) => bs.reduce((n, b) => n + ("html" in b ? plain(b.html).length : "items" in b && b.type === "list" ? b.items.join(" ").length : 0), 0);
const isShare = (b: Block) => b.type === "paragraph" && /facebook\.com\/sharer|twitter\.com\/intent|linkedin\.com\/share|wa\.me\/\?|api\.whatsapp/.test(b.html);

const Html = ({ as = "span", html, className }: { as?: string; html: string; className?: string }) =>
  createElement(as, { className, dangerouslySetInnerHTML: { __html: mediaHtml(html) } });

/* ------------------------------------------------------------------ items (pre-grouped blocks) */

type Item =
  | { kind: "block"; block: Block }
  | { kind: "gallery"; images: Extract<Block, { type: "image" }>[] }
  | { kind: "stats"; stats: { value: ReactNode; label: string; heading?: Extract<Block, { type: "heading" }> }[] }
  | { kind: "buttons"; buttons: { href: string; text: string }[] };

export function toItems(blocks: Block[]): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const last = items[items.length - 1];
    if (b.type === "image") {
      if (last?.kind === "gallery") last.images.push(b);
      else items.push({ kind: "gallery", images: [b] });
      continue;
    }
    if (isStatHeading(b) && b.type === "heading") {
      const next = blocks[i + 1];
      const label = next && next.type === "paragraph" && plain(next.html).length <= 60 ? plain(next.html) : "";
      if (label) i++;
      const stat = { value: b.text, label, heading: b };
      if (last?.kind === "stats") last.stats.push(stat);
      else items.push({ kind: "stats", stats: [stat] });
      continue;
    }
    if (b.type === "stat") {
      const stat = { value: b.value, label: b.label };
      if (last?.kind === "stats") last.stats.push(stat);
      else items.push({ kind: "stats", stats: [stat] });
      continue;
    }
    const btn = asButton(b);
    if (btn) {
      if (last?.kind === "buttons") last.buttons.push(btn);
      else items.push({ kind: "buttons", buttons: [btn] });
      continue;
    }
    items.push({ kind: "block", block: b });
  }
  return items;
}

/* ------------------------------------------------------------------ primitives */

export function HeadingEl({ b, role, tone }: { b: Extract<Block, { type: "heading" }>; role: "display" | "title" | "group" | "minor"; tone: Tone }) {
  const cls = {
    display: "text-[clamp(2.5rem,1rem+5vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]",
    title: "text-[clamp(2rem,1rem+3vw,4.25rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em]",
    group: "text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-bold leading-[1.15] tracking-[-0.015em]",
    minor: `text-[0.8125rem] font-semibold uppercase tracking-[0.16em] ${onDark(tone) ? "text-sky" : "text-blue"}`,
  }[role];
  return <Html as={`h${b.level}`} html={b.html} className={`legacy-h text-balance ${cls}`} />;
}

export function Para({ html, tone, lead = false }: { html: string; tone: Tone; lead?: boolean }) {
  return <Html as="p" html={html} className={`legacy-rich ${lead ? "text-[length:var(--fs-lead)] leading-[1.55]" : "text-[length:var(--fs-body)] leading-[1.7]"} ${onDark(tone) ? "text-grey-soft" : "text-graphite"}`} />;
}

export function Buttons({ buttons, tone }: { buttons: { href: string; text: string }[]; tone: Tone }) {
  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((b, i) => {
        const external = /^(https?:|mailto:|tel:)/.test(b.href);
        const cls = `group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
          i === 0 ? "bg-blue text-on-accent hover:bg-blue-deep" : onDark(tone) ? "border border-white/25 hover:border-sky hover:text-sky" : "border border-ink/20 hover:border-blue hover:text-blue"
        }`;
        const inner = (<>{b.text}<Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>);
        return external ? <a key={i} href={media(b.href)} className={cls}>{inner}</a> : <Link key={i} href={b.href} className={cls}>{inner}</Link>;
      })}
    </div>
  );
}

/** Images that are links on the live site (the extractor records image sources, not their wrapping link). */
const IMAGE_LINKS: Record<string, string> = {
  // Live link is /casestudy/our-case-one-goa/, which returns 404 on scaleacres.com; the case
  // study itself lives at /blog/casestudy/our-case-one-goa/ (broken link fixed, see SEO report).
  "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-02.webp": "/blog/casestudy/our-case-one-goa/",
  "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-03.webp": "/yugen-case-study/",
};

export function Img({ img, className = "", sizes }: { img: Extract<Block, { type: "image" }>; className?: string; sizes?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  const el = <img src={media(img.src)} alt={img.alt ?? ""} width={img.width ?? undefined} height={img.height ?? undefined} loading="lazy" decoding="async" sizes={sizes} className={className} />;
  const href = IMAGE_LINKS[img.src];
  return href ? <Link href={href} className="block">{el}</Link> : el;
}

/** Logos and small marks → greyscale wall; photos and screenshots → rounded gallery. */
export function Gallery({ images, tone, feature = false }: { images: Extract<Block, { type: "image" }>[]; tone: Tone; feature?: boolean }) {
  const small = images.filter((i) => (i.width ?? 0) > 0 && (i.width ?? 0) <= 520).length;
  const logoWall = images.length >= 5 && small / images.length > 0.6;
  if (logoWall) {
    return (
      <ul role="list" className={`grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border sm:grid-cols-4 lg:grid-cols-6 ${onDark(tone) ? "border-white/10 bg-white/10" : "border-line bg-line"}`}>
        {images.map((img, i) => (
          <li key={i} className={`grid aspect-[3/2] place-items-center p-4 ${onDark(tone) ? "bg-ink" : "bg-white"}`}>
            <Img img={img} className={`max-h-14 w-auto max-w-[80%] object-contain opacity-80 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 ${onDark(tone) ? "" : ""}`} />
          </li>
        ))}
      </ul>
    );
  }
  if (images.length === 1) {
    const img = images[0];
    const tiny = (img.width ?? 999) < 200;
    return (
      <figure className="m-0">
        <Img img={img} className={tiny ? "h-auto max-h-20 w-auto" : `h-auto w-full rounded-[14px] object-cover ${feature ? "max-h-[70vh]" : ""}`} />
        {img.caption ? <Html as="figcaption" html={img.caption} className="mt-3 text-sm text-steel" /> : null}
      </figure>
    );
  }
  const cols = images.length === 2 ? "sm:grid-cols-2" : images.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul role="list" className={`grid gap-4 ${cols}`}>
      {images.map((img, i) => (
        <li key={i} className="group overflow-hidden rounded-[14px]">
          <Img img={img} className="h-auto w-full object-cover transition-[scale] duration-[1200ms] ease-out-expo group-hover:scale-[1.03]" />
        </li>
      ))}
    </ul>
  );
}

const STAT_COLS = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

function Stats({ stats, tone }: { stats: Extract<Item, { kind: "stats" }>["stats"]; tone: Tone }) {
  return (
    <ul role="list" className={`grid grid-cols-2 gap-px overflow-hidden rounded-[14px] ${STAT_COLS[Math.min(stats.length, 4)]} ${onDark(tone) ? "bg-white/12" : "bg-line"}`}>
      {stats.map((s, i) => (
        <li key={i} className={`p-6 md:p-8 ${onDark(tone) ? "bg-ink" : "bg-white"}`}>
          {s.heading ? (
            <Html as={`h${s.heading.level}`} html={s.heading.html} className={`legacy-h text-[clamp(2.25rem,1rem+3vw,4rem)] font-black leading-none tracking-[-0.04em] ${onDark(tone) ? "text-sky" : "text-blue"}`} />
          ) : (
            <p className={`text-[clamp(2.25rem,1rem+3vw,4rem)] font-black leading-none tracking-[-0.04em] ${onDark(tone) ? "text-sky" : "text-blue"}`}>{s.value}</p>
          )}
          {s.label ? <p className={`mt-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] ${onDark(tone) ? "text-white/70" : "text-steel"}`}>{s.label}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function ListEl({ b, tone }: { b: Extract<Block, { type: "list" }>; tone: Tone }) {
  const Tag = b.ordered ? "ol" : "ul";
  return (
    <Tag className={`legacy-list legacy-rich grid gap-x-10 ${b.items.length > 6 && b.items.every((x) => plain(x).length < 70) ? "sm:grid-cols-2" : ""} ${onDark(tone) ? "text-grey-soft" : "text-graphite"}`}>
      {b.items.map((it, i) => (
        <li key={i} className={`relative border-t py-3 pl-7 text-[length:var(--fs-body)] leading-[1.6] ${onDark(tone) ? "border-white/10" : "border-line"}`}>
          <span aria-hidden="true" className={`absolute left-0 top-[1.15rem] h-[2px] w-3.5 ${onDark(tone) ? "bg-sky" : "bg-blue"}`} />
          {b.ordered ? <span className="sr-only">{i + 1}. </span> : null}
          <Html html={it} />
        </li>
      ))}
    </Tag>
  );
}

function TableEl({ b, tone }: { b: Extract<Block, { type: "table" }>; tone: Tone }) {
  return (
    <div className={`overflow-x-auto rounded-[14px] border ${onDark(tone) ? "border-white/15" : "border-line"}`}>
      <table className="legacy-table w-full min-w-[34rem] border-collapse text-left text-[0.9375rem]">
        <tbody>
          {b.rows.map((r, i) => (
            <tr key={i} className={i === 0 && r.every((c) => c.h) ? (onDark(tone) ? "bg-white/5" : "bg-offwhite") : ""}>
              {r.map((c, j) => createElement(c.h ? "th" : "td", { key: j, className: `border-b px-4 py-3 align-top ${onDark(tone) ? "border-white/10" : "border-line"} ${c.h ? "font-semibold" : ""}`, dangerouslySetInnerHTML: { __html: mediaHtml(c.html) } }))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Faq({ b, tone }: { b: Extract<Block, { type: "faq" }>; tone: Tone }) {
  return (
    <div className={`border-t ${onDark(tone) ? "border-white/15" : "border-ink/15"}`}>
      {b.items.map((it, i) => {
        const q = <span className="legacy-faq-q">{it.q}</span>;
        return (
          <details key={i} className={`group border-b ${onDark(tone) ? "border-white/15" : "border-ink/15"}`} {...(i === 0 ? { open: true } : {})}>
            <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-[clamp(1.0625rem,1rem+0.5vw,1.375rem)] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
              <span className="flex-1 group-open:text-blue">{it.qTag ? createElement(it.qTag, { className: "legacy-h text-inherit" }, it.q) : q}</span>
              <span aria-hidden="true" className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors group-open:border-blue group-open:bg-blue group-open:text-white ${onDark(tone) ? "border-white/25" : "border-ink/20"}`}>
                <span className="absolute h-[1.5px] w-3.5 bg-current" />
                <span className="absolute h-3.5 w-[1.5px] bg-current transition-transform group-open:scale-y-0" />
              </span>
            </summary>
            <div className="space-y-4 pb-7 pr-12">
              <Flow blocks={it.answer} tone={tone} />
            </div>
          </details>
        );
      })}
    </div>
  );
}

function Video({ b }: { b: Extract<Block, { type: "video" }> }) {
  if (b.embed) {
    let src = b.embed;
    const yt = src.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    const portrait = /shorts\//.test(b.embed);
    const map = /maps\.google|google\.com\/maps/.test(src);
    return (
      <div className={`overflow-hidden rounded-[14px] bg-ink ${portrait ? "mx-auto aspect-[9/16] max-w-[22rem]" : map ? "aspect-[16/7]" : "aspect-video"}`}>
        <iframe src={src} title={b.title || (map ? "Map" : "Video")} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" className="h-full w-full border-0" />
      </div>
    );
  }
  return <video src={media(b.src)} poster={b.poster ? media(b.poster) : undefined} controls preload="none" playsInline className="w-full rounded-[14px] bg-ink" />;
}

/** One page-wide contact form; any further form blocks become a link to it. */
export function FormSlot({ first, tone, bare = false }: { first: boolean; tone: Tone; bare?: boolean }) {
  if (!first) return <Buttons buttons={[{ href: "#enquiry", text: "Enquire now" }]} tone={tone} />;
  if (bare) return <ContactForm />;
  return (
    <div id="enquiry" className="on-dark scroll-mt-28 rounded-[20px] bg-ink p-6 text-white shadow-[0_30px_80px_-40px_rgba(11,13,13,0.45)] md:p-8">
      <ContactForm />
    </div>
  );
}

/* ------------------------------------------------------------------ flows */

/** The page's first form block gets the working contact form; later ones link to it. */
export type FormCounter = { first: Block | null };

/** Linear rendering (blog bodies, FAQ answers, small groups). */
export function Flow({ blocks, tone, form, headingRole = "group" }: { blocks: Block[]; tone: Tone; form?: FormCounter; headingRole?: "group" | "title" }) {
  return (
    <>
      {toItems(blocks).map((it, i) => (
        <ItemEl key={i} it={it} tone={tone} form={form} headingRole={headingRole} />
      ))}
    </>
  );
}

function ItemEl({ it, tone, form, headingRole }: { it: Item; tone: Tone; form?: FormCounter; headingRole: "group" | "title" }) {
  if (it.kind === "gallery") return <Gallery images={it.images} tone={tone} />;
  if (it.kind === "stats") return <Stats stats={it.stats} tone={tone} />;
  if (it.kind === "buttons") return <Buttons buttons={it.buttons} tone={tone} />;
  const b = it.block;
  switch (b.type) {
    case "heading":
      return <HeadingEl b={b} role={b.level === 1 ? "display" : b.level >= 5 ? "minor" : b.level === 2 ? "title" : headingRole} tone={tone} />;
    case "paragraph":
      if (isShare(b)) return <Html as="p" html={b.html} className="legacy-share flex flex-wrap gap-3 text-[0.8125rem] text-steel" />;
      return <Para html={b.html} tone={tone} />;
    case "list":
      return <ListEl b={b} tone={tone} />;
    case "table":
      return <TableEl b={b} tone={tone} />;
    case "faq":
      return <Faq b={b} tone={tone} />;
    case "video":
      return <Video b={b} />;
    case "quote":
      return <Html as="blockquote" html={b.html} className="border-l-2 border-blue pl-6 text-[length:var(--fs-lead)] italic leading-[1.5]" />;
    case "form": {
      return <FormSlot first={!form || form.first === b} tone={tone} />;
    }
    case "rule":
      return <hr className={onDark(tone) ? "border-white/15" : "border-line"} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ sections */

type Group = { heading?: Extract<Block, { type: "heading" }>; extraHeadings?: Extract<Block, { type: "heading" }>[]; items: Item[]; blocks: Block[]; lead?: Extract<Block, { type: "image" }> };

function groupBlocks(blocks: Block[]): Group[] {
  const groups: Group[] = [];
  let cur: Group = { items: [], blocks: [] };
  for (const b of blocks) {
    if (b.type === "heading" && !isStatHeading(b)) {
      // Card pattern (photo, name, logo, photo, name, logo…): an image right before a heading
      // belongs to the next card when the current one already has its own image.
      let carry: Extract<Block, { type: "image" }> | undefined;
      const last = cur.blocks[cur.blocks.length - 1];
      if (last?.type === "image" && b.level >= 4 && (cur.blocks.filter((x) => x.type === "image").length > 1 || (!cur.heading && cur.blocks.every((x) => x.type === "image")))) {
        carry = cur.blocks.pop() as Extract<Block, { type: "image" }>;
      }
      if (cur.heading || cur.blocks.length) groups.push(cur);
      cur = { heading: b, items: [], blocks: [], lead: carry };
    } else cur.blocks.push(b);
  }
  if (cur.heading || cur.blocks.length) groups.push(cur);
  for (const g of groups) g.items = toItems(g.blocks);
  return groups;
}

/** Runs of heading-only groups that repeat a pattern ("Step 1", title, text, "Step 2"…) become one card per step. */
function chunkSteps(groups: Group[]): Group[] {
  if (groups.length < 4 || !groups.every((g) => g.heading && !g.blocks.length && !g.lead && g.heading.level >= 4)) return groups;
  const sig = (g: Group) => g.heading!.text.replace(/\d+/g, "#").trim();
  const first = sig(groups[0]);
  if (!/#/.test(first)) return groups;
  const period = groups.findIndex((g, i) => i > 0 && sig(g) === first);
  if (period < 2 || groups.length % period !== 0) return groups;
  const out: Group[] = [];
  for (let i = 0; i < groups.length; i += period) out.push({ heading: groups[i].heading, extraHeadings: groups.slice(i + 1, i + period).map((g) => g.heading!), items: [], blocks: [] });
  return out;
}

/**
 * Lays out one captured section as a design band. The band's lead heading becomes the section
 * title; sibling sub-sections become an editorial grid (short, uniform content) or rows.
 */
export function SectionBand({ blocks, tone, index, form, hero = false }: { blocks: Block[]; tone: Tone; index: number; form: FormCounter; hero?: boolean }) {
  const groups = groupBlocks(blocks);
  const bg = { hero: "bg-ink text-white on-dark", dark: "bg-navy text-white on-dark", light: "bg-white text-ink", mist: "bg-offwhite text-ink" }[tone];
  const pad = hero ? "pt-[calc(var(--header-h)+clamp(3rem,6vw,5.5rem))] pb-[clamp(3.5rem,7vw,6rem)]" : "py-[clamp(4rem,8vw,7.5rem)]";

  // Title group: the first group whose heading is the highest level in the band.
  const levels = groups.map((g) => g.heading?.level ?? 9);
  const top = Math.min(...levels);
  const titleIdx = groups.findIndex((g) => g.heading && g.heading.level === top && g.heading.level <= 3);
  const leadGroups = titleIdx > 0 ? groups.slice(0, titleIdx) : [];
  const title = titleIdx >= 0 ? groups[titleIdx] : null;
  const rest = chunkSteps(titleIdx >= 0 ? groups.slice(titleIdx + 1) : groups);

  const textual = (g: Group) => g.items.every((it) => (it.kind === "gallery" ? it.images.length <= 2 : it.kind !== "block" || ["paragraph", "list", "heading"].includes(it.block.type)));
  const compact = rest.length >= 3 && rest.every((g) => g.heading && textual(g) && textLen(g.blocks) < 650) && new Set(rest.map((g) => g.heading!.level)).size === 1;
  const cols = rest.length % 4 === 0 && rest.length >= 4 ? "lg:grid-cols-4" : rest.length === 4 || rest.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  // Title group media (one image or gallery) sits beside the title copy.
  const titleMedia = title?.items.filter((it) => it.kind === "gallery") ?? [];
  const titleText = title?.items.filter((it) => it.kind !== "gallery") ?? [];
  const sideBySide = !!title && titleMedia.length === 1 && (titleMedia[0] as Extract<Item, { kind: "gallery" }>).images.length <= 2 && titleText.length > 0;

  return (
    <section className={`relative isolate overflow-hidden ${bg} ${pad}`} data-legacy-section={index}>
      <div className="container-x mx-auto max-w-[120rem] space-y-10">
        {leadGroups.map((g, i) => (
          <div key={`l${i}`} className="space-y-6">
            {g.heading ? <HeadingEl b={g.heading} role={g.heading.level === 1 ? "display" : "minor"} tone={tone} /> : null}
            {g.items.map((it, j) => (<ItemEl key={j} it={it} tone={tone} form={form} headingRole="group" />))}
          </div>
        ))}

        {title ? (
          <div className={`grid gap-10 ${sideBySide ? "lg:grid-cols-12 lg:items-center lg:gap-16" : ""}`}>
            <div className={`space-y-6 ${sideBySide ? "lg:col-span-6" : "max-w-[64rem]"}`}>
              <span aria-hidden="true" className={`block h-[2px] w-12 ${onDark(tone) ? "bg-sky" : "bg-blue"}`} />
              <HeadingEl b={title.heading!} role={title.heading!.level === 1 ? "display" : "title"} tone={tone} />
              {titleText.map((it, j) =>
                it.kind === "block" && it.block.type === "paragraph" && j === 0 ? (
                  <Para key={j} html={it.block.html} tone={tone} lead />
                ) : (
                  <ItemEl key={j} it={it} tone={tone} form={form} headingRole="group" />
                ),
              )}
            </div>
            {sideBySide ? <div className="lg:col-span-6"><ItemEl it={titleMedia[0]} tone={tone} form={form} headingRole="group" /></div> : titleMedia.map((it, j) => <ItemEl key={`m${j}`} it={it} tone={tone} form={form} headingRole="group" />)}
          </div>
        ) : null}

        {compact ? (
          <ul role="list" className={`grid gap-px overflow-hidden rounded-[14px] sm:grid-cols-2 ${cols} ${onDark(tone) ? "bg-white/12" : "bg-line"}`}>
            {rest.map((g, i) => (
              <li key={i} className={`space-y-4 p-7 md:p-9 ${onDark(tone) ? "bg-ink" : tone === "mist" ? "bg-offwhite" : "bg-white"}`}>
                {g.lead ? <Img img={g.lead} className="mb-2 aspect-[4/3] h-auto w-full rounded-[10px] object-cover" /> : <span className={`block text-xs font-semibold tabular-nums ${onDark(tone) ? "text-sky" : "text-blue"}`}>{String(i + 1).padStart(2, "0")}</span>}
                <HeadingEl b={g.heading!} role={g.heading!.level >= 5 && !g.lead && !g.extraHeadings ? "minor" : "group"} tone={tone} />
                {g.extraHeadings?.map((h, j) => (<HeadingEl key={`x${j}`} b={h} role={j === 0 ? "group" : "minor"} tone={tone} />))}
                {g.items.map((it, j) => (it.kind === "gallery" && g.lead ? <Gallery key={j} images={it.images} tone={tone} /> : <ItemEl key={j} it={it} tone={tone} form={form} headingRole="group" />))}
              </li>
            ))}
          </ul>
        ) : (
          rest.map((g, i) => {
            const media = g.items.filter((it) => it.kind === "gallery");
            const body = g.items.filter((it) => it.kind !== "gallery");
            const wide = body.some((it) => it.kind === "block" && ["faq", "table", "video", "form"].includes(it.block.type)) || !g.heading || media.some((it) => it.kind === "gallery" && it.images.length >= 6);
            if (wide) {
              return (
                <div key={i} className="space-y-6">
                  {g.lead ? <Gallery images={[g.lead]} tone={tone} /> : null}
                  {g.heading ? <HeadingEl b={g.heading} role={g.heading.level <= 2 ? "title" : g.heading.level >= 5 ? "minor" : "group"} tone={tone} /> : null}
                  {g.items.map((it, j) => (<ItemEl key={j} it={it} tone={tone} form={form} headingRole="group" />))}
                </div>
              );
            }
            return (
              <div key={i} className={`grid gap-6 border-t pt-8 lg:grid-cols-12 lg:gap-12 ${onDark(tone) ? "border-white/12" : "border-line"}`}>
                <div className="space-y-5 lg:col-span-5">
                  {g.lead ? <Gallery images={[g.lead]} tone={tone} /> : null}
                  <HeadingEl b={g.heading!} role={g.heading!.level <= 2 ? "title" : g.heading!.level >= 5 ? "minor" : "group"} tone={tone} />
                </div>
                <div className="space-y-5 lg:col-span-7">
                  {body.map((it, j) => (<ItemEl key={j} it={it} tone={tone} form={form} headingRole="group" />))}
                  {media.map((it, j) => (<ItemEl key={`g${j}`} it={it} tone={tone} form={form} headingRole="group" />))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export { Html, Fragment };
