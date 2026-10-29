import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { site } from "@/content/site";
import { ArrowUR, Plus, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * Shared building blocks for every internal page, in the homepage design language: the same
 * grounds (white, Mist, warm paper, Brand Black), column rules, section tag, word-by-word headings,
 * clip reveals and buttons. Page templates compose these; nothing here is page-specific.
 */

export type Ground = "white" | "mist" | "paper" | "dark";
const GROUND: Record<Ground, string> = { white: "nd-white", mist: "nd-light", paper: "nd-paper", dark: "nd-dark" };

export function Section({ tone = "white", id, rules = true, className = "", pad = "default", children, label }: { tone?: Ground; id?: string; rules?: boolean; className?: string; pad?: "default" | "tight" | "none"; children: ReactNode; label?: string }) {
  const p = pad === "none" ? "" : pad === "tight" ? "py-[clamp(2.75rem,5vw,4.25rem)]" : "py-[clamp(4rem,7.5vw,6.75rem)]";
  return (
    <section id={id} aria-label={label} className={`${GROUND[tone]} relative scroll-mt-24 ${className}`}>
      {rules ? <Rules /> : null}
      <div className={`nd-wrap relative ${p}`}>{children}</div>
    </section>
  );
}

/** Splits a heading into balanced display lines (keeps the exact text; only line breaks are added). */
export function lines(text: string, maxChars: number) {
  const w = text.replace(/\s+/g, " ").trim().split(" ");
  const out: string[] = [];
  let cur = "";
  for (const x of w) {
    if (cur && (cur + " " + x).length > maxChars) { out.push(cur); cur = x; } else cur = cur ? `${cur} ${x}` : x;
  }
  if (cur) out.push(cur);
  return out;
}

/** Display size chosen from the heading length so long titles stay readable and never clip. */
export function displaySize(text: string) {
  const n = text.length;
  if (n <= 18) return "text-[clamp(3rem,10vw,9.5rem)] leading-[0.9] tracking-[-0.055em]";
  if (n <= 34) return "text-[clamp(2.6rem,7vw,7rem)] leading-[0.92] tracking-[-0.05em]";
  if (n <= 64) return "text-[clamp(2.2rem,5vw,5.25rem)] leading-[0.98] tracking-[-0.045em]";
  return "text-[clamp(1.9rem,3.6vw,3.75rem)] leading-[1.04] tracking-[-0.035em]";
}

export type Crumb = { label: string; href?: string };

export function Crumbs({ items, dark = true }: { items: Crumb[]; dark?: boolean }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={`nd-label ${dark ? "text-white/55" : "nd-muted"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {c.href && i < items.length - 1 ? <Link href={c.href} className="transition-colors hover:text-[color:var(--sky)]">{c.label}</Link> : <span aria-current="page" className={dark ? "text-white/85" : "text-[color:var(--ink)]"}>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Page hero: Brand Black (or white) with the column rules, section tag, the page's own H1 rising
 * word by word with one accent word, a lead, actions and an optional media panel underneath.
 */
export function Hero({
  tag,
  title,
  accent = [],
  lead,
  crumbs,
  actions,
  media,
  aside,
  tone = "dark",
  maxChars,
  as = "h1",
}: {
  tag: string;
  title: string;
  accent?: string[];
  lead?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  media?: ReactNode;
  aside?: ReactNode;
  tone?: "dark" | "white";
  maxChars?: number;
  as?: "h1" | "p";
}) {
  const dark = tone === "dark";
  const size = displaySize(title);
  const mc = maxChars ?? (title.length <= 18 ? 12 : title.length <= 34 ? 18 : title.length <= 64 ? 26 : 34);
  return (
    <section className={`${dark ? "nd-dark" : "nd-white"} relative overflow-hidden`} aria-label={tag}>
      <Rules />
      <div className="nd-wrap relative pb-[clamp(3rem,6vw,5.5rem)] pt-[clamp(7.5rem,13vw,11rem)]">
        <div className="nd-cell flex flex-wrap items-center justify-between gap-4">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          {crumbs ? <div data-nd="up" style={{ "--d": 60 } as CSSProperties}><Crumbs items={crumbs} dark={dark} /></div> : null}
        </div>
        <div className="nd-grid mt-[clamp(1.75rem,4vw,3.5rem)] items-end gap-y-8">
          <div className={`nd-cell ${aside ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <Words as={as} lines={lines(title, mc)} accent={accent} accentClass={dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"} className={`font-semibold ${size} [overflow-wrap:anywhere]`} />
          </div>
          {aside ? <div className="nd-cell lg:pb-3" data-nd="up" style={{ "--d": 180 } as CSSProperties}>{aside}</div> : null}
        </div>
        {lead || actions ? (
          <div className="nd-grid mt-[clamp(1.75rem,4vw,3rem)] gap-y-6">
            {lead ? <div className={`nd-cell nd-lead max-w-[40rem] lg:col-span-2 ${dark ? "text-white/75" : "nd-muted"}`} data-nd="up" style={{ "--d": 220 } as CSSProperties}>{lead}</div> : null}
            {actions ? <div className="nd-cell flex flex-wrap items-end gap-3 lg:justify-end" data-nd="up" style={{ "--d": 280 } as CSSProperties}>{actions}</div> : null}
          </div>
        ) : null}
        {media ? <div className="mt-[clamp(2.5rem,5vw,4.5rem)]">{media}</div> : null}
      </div>
    </section>
  );
}

export function Btn({ href, children, variant = "royal", className = "" }: { href: string; children: ReactNode; variant?: "royal" | "white" | "ink" | "line"; className?: string }) {
  const cls = variant === "line" ? "border border-current/30 hover:border-[color:var(--royal)] hover:bg-[color:var(--royal)] hover:text-white" : `nd-btn--${variant}`;
  const ext = /^https?:/.test(href);
  const inner = <>{children} <ArrowUR /></>;
  return ext ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`nd-btn ${cls} ${className}`}>{inner}</a>
  ) : (
    <Link href={href} className={`nd-btn ${cls} ${className}`}>{inner}</Link>
  );
}

/** Section heading row: tag + title on the left two thirds, an intro on the right. */
export function Head({ tag, title, accent = [], intro, dark = false, id, size = "lg" }: { tag: string; title: string; accent?: string[]; intro?: ReactNode; dark?: boolean; id?: string; size?: "lg" | "md" }) {
  const cls = size === "lg" ? "text-[clamp(2.3rem,5.4vw,5.5rem)] leading-[0.95] tracking-[-0.05em]" : "text-[clamp(1.9rem,3.6vw,3.5rem)] leading-[1] tracking-[-0.04em]";
  return (
    <div className="nd-grid items-end gap-y-6">
      <div className="nd-cell lg:col-span-2">
        <div data-nd="up"><Tag>{tag}</Tag></div>
        <Words id={id} lines={lines(title, size === "lg" ? 22 : 30)} accent={accent} accentClass={dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"} className={`mt-6 font-semibold ${cls}`} />
      </div>
      {intro ? <div className={`nd-cell nd-lead max-w-[28rem] lg:pb-2 ${dark ? "text-white/72" : "nd-muted"}`} data-nd="up" style={{ "--d": 140 } as CSSProperties}>{intro}</div> : null}
    </div>
  );
}

/** Brand Black closing call to action used before the footer on every internal page. */
export function ClosingCta({ title = "Let's talk.", lead = "Tell us about your project. We'll come back with a clear plan for branding, launch and lead generation." }: { title?: string; lead?: string }) {
  const [a, b] = title.includes(" ") ? [title.slice(0, title.lastIndexOf(" ")), title.slice(title.lastIndexOf(" ") + 1)] : [title, ""];
  return (
    <section className="nd-dark relative overflow-hidden" aria-label="Contact">
      <Rules />
      <div className="nd-wrap relative py-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-cell"><div data-nd="up"><Tag>Contact</Tag></div></div>
        <div className="nd-cell mt-7">
          <Words as="p" lines={[b ? `${a} ${b}` : a]} accent={b ? [b] : []} accentClass="text-[color:var(--sky)]" className="text-[clamp(3.2rem,11vw,12rem)] font-semibold leading-[0.86] tracking-[-0.06em]" />
        </div>
        <div className="nd-grid mt-[clamp(2.5rem,5vw,4rem)] gap-y-8">
          <div className="nd-cell" data-nd="up">
            <p className="nd-label nd-muted">Call</p>
            {site.phones.slice(0, 2).map((p) => <a key={p.number} href={p.href} className="mt-2 block text-[clamp(1.4rem,2vw,2rem)] font-medium tracking-[-0.03em] hover:text-[color:var(--sky)]">{p.number}</a>)}
          </div>
          <div className="nd-cell" data-nd="up" style={{ "--d": 80 } as CSSProperties}>
            <p className="nd-label nd-muted">Email</p>
            <a href={`mailto:${site.email}`} className="mt-2 block text-[1.25rem] font-medium hover:text-[color:var(--sky)]">{site.email}</a>
            <p className="nd-body mt-4 max-w-[22rem] text-white/66">{lead}</p>
          </div>
          <div className="nd-cell flex flex-col gap-3 lg:justify-end" data-nd="up" style={{ "--d": 160 } as CSSProperties}>
            <Link href="/contact-us/" className="nd-btn nd-btn--royal w-full">Start a project <Plus /></Link>
            <a href={`mailto:${site.email}`} className="nd-btn nd-btn--white w-full">Email us <ArrowUR /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A big stat row with hairlines (values exactly as published). */
export function StatRow({ stats, dark = false }: { stats: { value: string; label: string }[]; dark?: boolean }) {
  return (
    <dl className={`grid grid-cols-2 border-t lg:grid-cols-4 ${dark ? "border-white/12" : "border-[color:var(--line-l)]"}`}>
      {stats.map((s, i) => (
        <div key={i} data-nd="up" style={{ "--d": i * 80 } as CSSProperties} className={`px-[clamp(0.75rem,1.2vw,1.25rem)] pb-2 pt-6 ${i % 2 === 1 ? (dark ? "border-l border-white/12" : "border-l border-[color:var(--line-l)]") : ""} ${i >= 2 ? "max-lg:mt-6" : ""} lg:border-l lg:first:border-l-0 ${dark ? "lg:border-white/12" : "lg:border-[color:var(--line-l)]"}`}>
          <dt className={`nd-label ${dark ? "text-white/55" : "nd-muted"}`}>{s.label}</dt>
          <dd className="mt-3 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-none tracking-[-0.05em]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
