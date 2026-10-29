import Link from "next/link";
import type { CSSProperties } from "react";
import { legacyPages, media, pageKind, plain, type Block, type LegacyPage } from "@/lib/legacy";
import { Flow, FormPanel } from "@/components/site/Blocks";
import { Btn, ClosingCta, Crumbs, Hero, Section } from "@/components/site/Kit";
import { ArrowUR, Rules, Tag, Words } from "@/components/nd/ui";
import { crumbsFor } from "@/components/site/SitePage";
import { BlogArt } from "@/components/site/heroes";

/**
 * Blog: an editorial index, topic/author/date archives and the article template. Every card is
 * built from the post's own captured content (title, featured image, author, date, category).
 */

type Img = Extract<Block, { type: "image" }>;
export type PostCard = { path: string; title: string; img: Img | null; author: string; date: string; iso: string; category: string | null; excerpt: string; minutes: number };

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "");
const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let cards: Map<string, PostCard> | null = null;
function postCards() {
  if (cards) return cards;
  cards = new Map();
  for (const p of legacyPages()) {
    if (pageKind(p) !== "post") continue;
    const bs = p.sections[0]?.blocks ?? [];
    const h1 = bs.find((b) => b.type === "heading" && b.level === 1);
    const img = (bs.find((b) => b.type === "image") as Img | undefined) ?? null;
    const meta = bs.find((b) => b.type === "list" && b.variant === "icon");
    const rawAuthor = (meta && meta.type === "list" ? plain(meta.items[0] ?? "") : (p.article?.author ?? "")).trim();
    // WordPress shows some usernames in lower case ("prem"); display them as names
    const author = rawAuthor === rawAuthor.toLowerCase() ? rawAuthor.replace(/\b\w/g, (ch) => ch.toUpperCase()) : rawAuthor;
    const first = bs.find((b) => b.type === "paragraph" && plain(b.html).length > 80);
    const ex = first && "html" in first ? plain(first.html) : "";
    const sec = p.article?.section;
    const iso = p.article?.datePublished ?? "";
    cards.set(p.path, {
      path: p.path,
      title: h1 && h1.type === "heading" ? plain(h1.html) : (p.article?.headline ?? p.title),
      img,
      author,
      iso,
      date: fmt(iso),
      category: Array.isArray(sec) ? (sec[0] ?? null) : (sec ?? null),
      excerpt: ex.length > 170 ? `${ex.slice(0, 165).replace(/\s+\S*$/, "")}…` : ex,
      minutes: Math.max(2, Math.round(((p.article as { wordCount?: number } | null)?.wordCount ?? 1000) / 220)),
    });
  }
  return cards;
}

const byDate = (a: PostCard, b: PostCard) => b.iso.localeCompare(a.iso);
export const latestPosts = (n: number) => [...postCards().values()].sort(byDate).slice(0, n);
const archivePaths = () => new Set(legacyPages().filter((p) => pageKind(p) === "archive").map((p) => p.path));
const categoryHref = (c: string | null) => {
  if (!c) return null;
  const h = `/blog/category/${slug(c)}/`;
  return archivePaths().has(h) ? h : null;
};

/** Post links in the order the archive lists them. */
function linkedPosts(page: LegacyPage) {
  const all = postCards();
  const seen = new Set<string>();
  const out: PostCard[] = [];
  for (const s of page.sections)
    for (const b of s.blocks) {
      const html = b.type === "heading" || b.type === "paragraph" ? b.html : b.type === "button" ? `href="${b.href}"` : "";
      for (const m of html.matchAll(/href="(\/blog\/[^"#?]+\/)"/g)) {
        const c = all.get(m[1]);
        if (c && !seen.has(c.path)) { seen.add(c.path); out.push(c); }
      }
    }
  return out;
}

function topics() {
  return legacyPages()
    .filter((p) => /^\/blog\/category\/(?!uncategorized)/.test(p.path))
    .map((p) => {
      const h = p.sections[0]?.blocks.find((b) => b.type === "heading" && b.level === 1);
      return { href: p.path, label: (h && h.type === "heading" ? plain(h.html) : p.title).replace(/^Category:\s*/i, "").replace(/ Archives.*$/, "") };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

/* ------------------------------------------------------------------ cards */

function Cover({ c, sizes, eager = false, ratio = "aspect-[19/10]" }: { c: PostCard; sizes: string; eager?: boolean; ratio?: string }) {
  return (
    <div data-nd="clip" className={`nd-zoom relative overflow-hidden rounded-[10px] bg-[color:var(--mist)] ${ratio}`}>
      <div className="nd-settle absolute inset-0">
        {c.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media(c.img.src)} alt={c.img.alt || c.title} width={c.img.width ?? undefined} height={c.img.height ?? undefined} sizes={sizes} loading={eager ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]" />
        ) : null}
      </div>
    </div>
  );
}

function Meta({ c, dark = false }: { c: PostCard; dark?: boolean }) {
  return (
    <p className={`nd-label flex flex-wrap items-center gap-x-3 gap-y-1 ${dark ? "text-white/55" : "nd-muted"}`}>
      {c.category ? <span className={dark ? "text-[color:var(--sky)]" : "text-[color:var(--royal)]"}>{c.category}</span> : null}
      <span>{c.date}</span>
      <span aria-hidden="true">·</span>
      <span>{c.minutes} min read</span>
    </p>
  );
}

export function PostTile({ c, i = 0, size = "md" }: { c: PostCard; i?: number; size?: "lg" | "md" }) {
  const lg = size === "lg";
  return (
    <article className="group relative" data-nd="up" style={{ "--d": (i % 3) * 80 } as CSSProperties}>
      <Cover c={c} eager={lg} sizes={lg ? "(min-width: 1024px) 62vw, 100vw" : "(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"} />
      <div className="mt-5"><Meta c={c} /></div>
      <h3 className={`mt-3 font-semibold tracking-[-0.03em] ${lg ? "text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05]" : "text-[1.3125rem] leading-[1.2]"}`}>
        <Link href={c.path} className="bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 [background-image:linear-gradient(currentColor,currentColor)] after:absolute after:inset-0 group-hover:bg-[length:100%_1px]">{c.title}</Link>
      </h3>
      {c.excerpt ? <p className={`nd-muted mt-3 ${lg ? "max-w-[40rem] text-[1.0625rem]" : "text-[0.975rem]"} leading-[1.6]`}>{c.excerpt}</p> : null}
      <p className="mt-4 text-[0.9375rem] font-medium">{c.author}</p>
    </article>
  );
}

function Row({ c }: { c: PostCard }) {
  return (
    <li className="border-b border-[color:var(--line-l)]">
      <Link href={c.path} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 px-[clamp(0.75rem,1.2vw,1.25rem)] py-5 md:grid-cols-[9rem_minmax(0,1fr)_10rem_auto]">
        <span className="nd-label nd-muted hidden tabular-nums md:block">{c.date}</span>
        <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.015em] transition-[transform,color] duration-500 group-hover:translate-x-1.5 group-hover:text-[color:var(--royal)] md:text-[1.1875rem]">{c.title}</span>
        <span className="nd-label hidden truncate text-[color:var(--royal)] md:block">{c.category}</span>
        <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--line-l)] transition-[background-color,border-color,color,transform] duration-500 group-hover:rotate-45 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white"><ArrowUR className="h-3 w-3" /></span>
      </Link>
    </li>
  );
}

function Topics({ active }: { active?: string }) {
  const list = topics();
  return (
    <nav aria-label="Blog topics" className="flex flex-wrap gap-2">
      <Link href="/blog/" aria-current={active === "/blog/" ? "page" : undefined} className={`rounded-full border px-4 py-2 text-[0.9375rem] font-medium transition-colors ${active === "/blog/" ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white" : "border-[color:var(--line-l)] hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]"}`}>All articles</Link>
      {list.map((t) => (
        <Link key={t.href} href={t.href} aria-current={active === t.href ? "page" : undefined} className={`rounded-full border px-4 py-2 text-[0.9375rem] font-medium transition-colors ${active === t.href ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white" : "border-[color:var(--line-l)] hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]"}`}>{t.label}</Link>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------------------ archive */

export function ArchivePage({ page }: { page: LegacyPage }) {
  const h1 = page.sections[0]?.blocks.find((b) => b.type === "heading" && b.level === 1);
  const raw = h1 && h1.type === "heading" ? plain(h1.html) : page.title;
  const [, kindLabel, name] = raw.match(/^(Category|Tag|Author|Day|Month|Year|Archives?):\s*(.+)$/i) ?? [];
  const isIndex = page.path === "/blog/";
  const posts = linkedPosts(page);
  const [lead, ...rest] = posts;
  const shown = new Set(posts.map((p) => p.path));
  const more = isIndex ? [...postCards().values()].filter((c) => !shown.has(c.path)).sort(byDate) : [];
  const title = isIndex ? "Blog" : (name ?? raw);
  return (
    <>
      <Hero
        tag={isIndex ? "Insights" : (kindLabel ?? "Archive")}
        title={isIndex ? "Blog" : title}
        accent={isIndex ? ["Blog"] : []}
        crumbs={crumbsFor(page)}
        lead={<p>{isIndex ? "Notes from the studio on real estate branding, websites, search and performance marketing." : `${posts.length} article${posts.length === 1 ? "" : "s"}.`}</p>}
        art={<BlogArt posts={posts.length ? posts : latestPosts(3)} />}
      />
      <Section tone="white" pad="tight" label="Articles">
        <div className="nd-cell"><Topics active={page.path} /></div>
        {lead ? (
          <div className="nd-grid mt-[clamp(2.5rem,5vw,4rem)] gap-y-14">
            <div className="nd-cell lg:col-span-2"><PostTile c={lead} size="lg" /></div>
            <div className="nd-cell grid content-start gap-12">
              {rest.slice(0, 2).map((c, i) => <PostTile key={c.path} c={c} i={i + 1} />)}
            </div>
          </div>
        ) : null}
        {rest.length > 2 ? (
          <div className="mt-[clamp(3.5rem,6vw,5rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-14 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((c, i) => <PostTile key={c.path} c={c} i={i} />)}
          </div>
        ) : null}
      </Section>
      {more.length ? (
        <Section tone="mist" label="All articles">
          <div className="nd-grid items-end gap-y-6">
            <div className="nd-cell lg:col-span-2">
              <div data-nd="up"><Tag>Archive</Tag></div>
              <Words as="h2" lines={["Every article."]} className="mt-6 text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]" />
            </div>
            <p className="nd-cell nd-muted lg:text-right" data-nd="up">{more.length + posts.length} articles, newest first.</p>
          </div>
          <ul role="list" className="mt-[clamp(2rem,4vw,3rem)] border-t border-[color:var(--line-l)]">
            {more.map((c) => <Row key={c.path} c={c} />)}
          </ul>
        </Section>
      ) : null}
      <ClosingCta />
    </>
  );
}

/* ------------------------------------------------------------------ article */

const HOSTS: [RegExp, string][] = [
  [/chat\.openai\.com/, "ChatGPT"], [/perplexity\.ai/, "Perplexity"], [/x\.com\/i\/grok/, "Grok"], [/google\.com\/search/, "Google AI"], [/claude\.ai/, "Claude"],
  [/facebook\.com\/sharer/, "Facebook"], [/twitter\.com\/intent/, "X"], [/linkedin\.com\/sharing/, "LinkedIn"], [/reddit\.com\/submit/, "Reddit"],
];
const AI = new Set(["ChatGPT", "Perplexity", "Grok", "Google AI", "Claude"]);

function shareLinks(html: string) {
  const seen = new Set<string>();
  const out: { label: string; href: string }[] = [];
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    const hit = HOSTS.find(([re]) => re.test(href));
    if (hit && !seen.has(hit[1])) { seen.add(hit[1]); out.push({ label: hit[1], href }); }
  }
  return out;
}

const isShare = (b: Block) => b.type === "paragraph" && /sharer|intent\/tweet|share-offsite|chat\.openai/.test(b.html) && plain(b.html).trim() === "";
const blank = (b: Block) => b.type === "paragraph" && plain(b.html).replace(/[\s​]/g, "") === "";

function splitPost(page: LegacyPage) {
  const bs = page.sections[0]?.blocks ?? [];
  const h1i = bs.findIndex((b) => b.type === "heading" && b.level === 1);
  const endI = bs.findIndex((b, i) => i > h1i && b.type === "heading" && /^(Enquire Now!?|Recent Posts)$/i.test(plain(b.html)));
  const share = bs.find(isShare);
  const body = bs.slice(h1i + 1, endI > 0 ? endI : undefined).filter((b) => !isShare(b) && !blank(b) && !(b.type === "paragraph" && /^Summarize this Post$/i.test(plain(b.html))));
  return { body, share: share && share.type === "paragraph" ? shareLinks(share.html) : [] };
}

/** Splits the article at its H2s so the contents list can link to each part. */
function chapters(body: Block[]) {
  const out: { id: string; title: string | null; blocks: Block[] }[] = [{ id: "intro", title: null, blocks: [] }];
  for (const b of body) {
    if (b.type === "heading" && b.level === 2) out.push({ id: slug(plain(b.html)).slice(0, 60) || `part-${out.length}`, title: plain(b.html), blocks: [b] });
    else out[out.length - 1].blocks.push(b);
  }
  return out.filter((c) => c.blocks.length);
}

export function PostPage({ page }: { page: LegacyPage }) {
  const c = postCards().get(page.path);
  if (!c) return null;
  const { body, share } = splitPost(page);
  const parts = chapters(body);
  const toc = parts.filter((p) => p.title);
  const catHref = categoryHref(c.category);
  const authorHref = [slug(c.author), slug(c.author.split(" ")[0])].map((a) => `/blog/author/${a}/`).find((h) => archivePaths().has(h)) ?? null;
  const all = [...postCards().values()].filter((p) => p.path !== c.path).sort(byDate);
  const related = [...all.filter((p) => p.category && p.category === c.category), ...all.filter((p) => p.category !== c.category)].slice(0, 3);
  const ai = share.filter((s) => AI.has(s.label));
  const social = share.filter((s) => !AI.has(s.label));
  return (
    <>
      <section className="nd-white relative overflow-hidden" aria-label="Article">
        <Rules />
        <div className="nd-wrap relative pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(7.5rem,13vw,10.5rem)]">
          <div className="nd-cell flex flex-wrap items-center justify-between gap-4">
            <div data-nd="up">{catHref ? <Link href={catHref}><Tag>{c.category}</Tag></Link> : <Tag>Insights</Tag>}</div>
            <div data-nd="up"><Crumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog/" }, { label: c.title }]} dark={false} /></div>
          </div>
          <div className="nd-grid mt-[clamp(1.75rem,4vw,3rem)]">
            <div className="nd-cell lg:col-span-3">
              <h1 data-nd="up" className="max-w-[22ch] text-[clamp(2.25rem,5.4vw,5rem)] font-semibold leading-[1] tracking-[-0.05em] [overflow-wrap:anywhere]">{c.title}</h1>
              <p data-nd="up" style={{ "--d": 120 } as CSSProperties} className="nd-label nd-muted mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>By {authorHref ? <Link href={authorHref} className="nd-link text-[color:var(--ink)]">{c.author}</Link> : c.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={c.iso}>{c.date}</time>
                <span aria-hidden="true">·</span>
                <span>{c.minutes} min read</span>
              </p>
            </div>
          </div>
          {c.img ? (
            <div className="nd-grid mt-[clamp(2rem,4vw,3.5rem)]">
              <div className="nd-cell lg:col-span-2 lg:col-start-2">
                <div data-nd="clip" className="overflow-hidden rounded-[14px] bg-[color:var(--mist)] shadow-[var(--sh-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media(c.img.src)} alt={c.img.alt || c.title} width={c.img.width ?? undefined} height={c.img.height ?? undefined} sizes="(min-width: 1024px) 62vw, 100vw" loading="eager" fetchPriority="high" decoding="async" className="block h-auto w-full" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Section tone="white" pad="tight" rules={false} label="Article body">
        <div className="nd-grid gap-y-12">
          <aside className="nd-cell order-2 lg:order-1">
            <div className="grid gap-8 lg:sticky lg:top-28">
              {toc.length >= 2 ? (
                <nav aria-label="In this article" className="hidden lg:block">
                  <p className="nd-label nd-muted">In this article</p>
                  <ol role="list" className="mt-4 grid gap-0 border-l border-[color:var(--line-l)]">
                    {toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[0.9375rem] leading-snug text-[color:var(--muted-l)] transition-colors hover:border-[color:var(--royal)] hover:text-[color:var(--ink)]">{t.title}</a></li>
                    ))}
                  </ol>
                </nav>
              ) : null}
              {ai.length ? (
                <div>
                  <p className="nd-label nd-muted">Summarize this post</p>
                  <ul role="list" className="mt-3 flex flex-wrap gap-2">
                    {ai.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-[color:var(--line-l)] px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]">{s.label}</a></li>)}
                  </ul>
                </div>
              ) : null}
              {social.length ? (
                <div>
                  <p className="nd-label nd-muted">Share</p>
                  <ul role="list" className="mt-3 flex flex-wrap gap-2">
                    {social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-[color:var(--line-l)] px-3.5 py-1.5 text-[0.875rem] font-medium transition-colors hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]">{s.label}</a></li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
          <div className="nd-cell order-1 min-w-0 lg:order-2 lg:col-span-2">
            <div className="nd-article max-w-[46rem]">
              {parts.map((p) => (
                <div key={p.id} id={p.title ? p.id : undefined} className="scroll-mt-28">
                  <Flow blocks={p.blocks} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper" label="Enquire now">
        <div className="nd-grid gap-y-10">
          <div className="nd-cell">
            <div data-nd="up"><Tag>Enquire now</Tag></div>
            <Words as="h2" lines={["Want this", "working for", "your project?"]} accent={["your project?"]} className="mt-7 text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em]" />
            <p className="nd-muted mt-6 max-w-[24rem]">Tell us about your project and the team will come back with a plan.</p>
          </div>
          <div className="nd-cell lg:col-span-2" data-nd="up"><FormPanel /></div>
        </div>
      </Section>

      <Section tone="white" label="Recent posts">
        <div className="nd-grid items-end gap-y-6">
          <div className="nd-cell lg:col-span-2">
            <div data-nd="up"><Tag>Keep reading</Tag></div>
            <Words as="h2" lines={["Recent posts."]} className="mt-6 text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]" />
          </div>
          <div className="nd-cell flex lg:justify-end" data-nd="up"><Btn href="/blog/" variant="ink">All articles</Btn></div>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-14 px-[clamp(0.75rem,1.2vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r, i) => <PostTile key={r.path} c={r} i={i} />)}
        </div>
      </Section>
    </>
  );
}

