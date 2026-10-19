import Link from "next/link";
import { media, pageKind, plain, type Block, type LegacyPage as Page, type PageKind } from "@/lib/legacy";
import { Arrow } from "@/components/ui/Arrow";
import { ComposedPage } from "@/components/legacy/Composer";
import { Flow, HeadingEl, SectionBand, Gallery, Html, Buttons, asButton, type FormCounter, type Tone } from "@/components/legacy/LegacyBlocks";

/**
 * Redesigned template for every migrated page. Content comes verbatim from the live capture;
 * the template only decides presentation per page type.
 */
/** Stage A: the premium composed system is live on these pages only, pending approval. */
const COMPOSED = new Set(["/real-estate-marketing-delhi/"]);

export function LegacyPageView({ page }: { page: Page }) {
  const kind = pageKind(page);
  const form: FormCounter = { first: page.sections.flatMap((s) => s.blocks).find((b) => b.type === "form") ?? null };
  return (
    <article data-legacy-path={page.path} data-kind={kind}>
      {page.canonical ? <link rel="canonical" href={page.canonical} /> : null}
      {kind === "post" ? (
        <PostTemplate page={page} form={form} />
      ) : kind === "archive" ? (
        <ArchiveTemplate page={page} />
      ) : COMPOSED.has(page.path) ? (
        <ComposedPage page={page} form={form} />
      ) : (
        <BandTemplate page={page} kind={kind} form={form} />
      )}
      {kind !== "legal" && kind !== "fragment" ? <ClosingCta /> : null}
      {page.jsonld.map((raw, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: raw.replace(/<\/script/gi, "<\\/script") }} />
      ))}
    </article>
  );
}

/* ------------------------------------------------------------------ shared bits */

function Crumbs({ page, tone = "dark" }: { page: Page; tone?: "dark" | "light" }) {
  const items = page.breadcrumbs;
  if (!items || items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={`text-[0.75rem] font-semibold uppercase tracking-[0.16em] ${tone === "dark" ? "text-white/55" : "text-steel"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {c.url && i < items.length - 1 ? <Link href={c.url} className="hover:text-sky">{c.name}</Link> : <span aria-current="page" className={tone === "dark" ? "text-white/85" : "text-ink"}>{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const KIND_LABEL: Record<PageKind, string> = {
  post: "Insights", archive: "Blog", location: "Real estate marketing", service: "Services", services: "Services", company: "ScaleAcres",
  case: "Case study", work: "Our work", contact: "Contact", legal: "Legal", fragment: "ScaleAcres",
};

function ClosingCta() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-white" aria-label="Start a project">
      <div aria-hidden="true" className="absolute -right-32 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,78,216,0.35),transparent)]" />
      <div className="container-x mx-auto flex max-w-[120rem] flex-col items-start justify-between gap-8 py-[clamp(4rem,8vw,6.5rem)] lg:flex-row lg:items-end">
        <p className="max-w-[18ch] text-[clamp(2.25rem,1rem+3.6vw,4.75rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">
          Let&apos;s build something <span className="text-blue">that matters.</span>
        </p>
        <Link href="/contact-us/" className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-blue px-8 py-5 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-on-accent transition-colors duration-500 hover:bg-white hover:text-ink">
          Let&apos;s Talk <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ band template (pages, services, locations…) */

function toneFor(blocks: Block[], i: number): Tone {
  const stats = blocks.filter((b) => b.type === "stat" || (b.type === "heading" && /^[\s₹$]*\d[\d.,]*\s*(cr|lacs?|k|x|%)?\s*\+?$/i.test(b.text))).length;
  if (stats >= 3 && stats * 2 >= blocks.filter((b) => b.type === "heading" || b.type === "stat").length) return "dark";
  return i % 2 === 1 ? "light" : "mist";
}

function BandTemplate({ page, kind, form }: { page: Page; kind: PageKind; form: FormCounter }) {
  const sections = page.sections.filter((s) => s.blocks.length);
  const first = sections[0];
  const firstHasHeading = first?.blocks.some((b) => b.type === "heading");
  const bannerOnly = first && !firstHasHeading && first.blocks.every((b) => b.type === "image" || asButton(b));
  const rest = bannerOnly || !firstHasHeading ? sections.slice(1) : sections.slice(1);

  return (
    <>
      {/* Hero */}
      {bannerOnly || !firstHasHeading ? (
        <section className="on-dark relative isolate overflow-hidden bg-ink pb-[clamp(2.5rem,5vw,4rem)] pt-[calc(var(--header-h)+clamp(2.5rem,5vw,4rem))] text-white">
          <div className="container-x mx-auto max-w-[120rem] space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow text-blue">{KIND_LABEL[kind]}</p>
              <Crumbs page={page} />
            </div>
            {first ? <Flow blocks={first.blocks} tone="hero" form={form} /> : null}
          </div>
        </section>
      ) : (
        <div className="relative">
          <div className="container-x pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+1rem)] z-10 mx-auto flex max-w-[120rem] flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-blue">{KIND_LABEL[kind]}</p>
            <div className="pointer-events-auto"><Crumbs page={page} /></div>
          </div>
          <SectionBand blocks={first.blocks} tone="hero" index={0} form={form} hero />
        </div>
      )}

      {rest.map((s, i) => (
        <SectionBand key={i} blocks={s.blocks} tone={toneFor(s.blocks, i)} index={i + 1} form={form} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ blog article */

function PostTemplate({ page, form }: { page: Page; form: FormCounter }) {
  const all = page.sections.flatMap((s) => s.blocks);
  const h1i = all.findIndex((b) => b.type === "heading" && b.level === 1);
  const h1 = h1i >= 0 ? (all[h1i] as Extract<Block, { type: "heading" }>) : null;
  const before = h1i >= 0 ? all.slice(0, h1i) : [];
  const featured = before.find((b) => b.type === "image") as Extract<Block, { type: "image" }> | undefined;
  const byline = before.filter((b) => b.type === "list" || b.type === "paragraph");
  const body = all.slice(h1i + 1);
  const date = page.article?.datePublished ? new Date(page.article.datePublished) : null;
  const cats = ([] as string[]).concat(page.article?.section ?? []);

  return (
    <>
      <header className="on-dark bg-ink pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--header-h)+clamp(2.5rem,5vw,4.5rem))] text-white">
        <div className="container-x mx-auto max-w-[76rem] space-y-8">
          <Crumbs page={page} />
          {cats.length ? <p className="eyebrow text-blue">{cats.join(" · ")}</p> : null}
          {h1 ? <HeadingEl b={h1} role="display" tone="hero" /> : null}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.875rem] text-white/70">
            {byline.map((b, i) => (b.type === "list" ? <Html key={i} as="span" html={b.items.join(" · ")} className="legacy-byline font-semibold text-white" /> : <Html key={i} as="span" html={(b as { html: string }).html} className="legacy-byline" />))}
            {date ? <time dateTime={page.article!.datePublished}>{date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time> : null}
          </div>
        </div>
      </header>
      {featured ? (
        <div className="bg-ink">
          <div className="container-x mx-auto max-w-[76rem] translate-y-0 pb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media(featured.src)} alt={featured.alt ?? ""} width={featured.width ?? undefined} height={featured.height ?? undefined} className="relative z-[1] -mb-[clamp(3rem,8vw,7rem)] h-auto w-full rounded-[18px] object-cover" />
          </div>
        </div>
      ) : null}
      <div className={`bg-white text-ink ${featured ? "pt-[clamp(5rem,11vw,10rem)]" : "pt-16"} pb-[clamp(4rem,8vw,7rem)]`}>
        <div className="container-x mx-auto max-w-[46rem] legacy-article space-y-6">
          <Flow blocks={body} tone="light" form={form} />
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ archives (blog, categories, tags, authors, dates) */

function ArchiveTemplate({ page }: { page: Page }) {
  const all = page.sections.flatMap((s) => s.blocks);
  const h1i = all.findIndex((b) => b.type === "heading" && b.level === 1);
  const h1 = h1i >= 0 ? (all[h1i] as Extract<Block, { type: "heading" }>) : null;
  const intro: Block[] = [];
  const cards: { img?: Extract<Block, { type: "image" }>; heading: Extract<Block, { type: "heading" }>; rest: Block[] }[] = [];
  const tail: Block[] = [];
  let pendingImg: Extract<Block, { type: "image" }> | undefined;
  for (let i = h1i + 1; i < all.length; i++) {
    const b = all[i];
    if (b.type === "image") { pendingImg = b; continue; }
    if (b.type === "heading" && b.level >= 2) { cards.push({ img: pendingImg, heading: b, rest: [] }); pendingImg = undefined; continue; }
    if (cards.length) cards[cards.length - 1].rest.push(b);
    else intro.push(b);
  }
  if (pendingImg) tail.push(pendingImg);

  return (
    <>
      <header className="on-dark bg-ink pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--header-h)+clamp(2.5rem,5vw,4.5rem))] text-white">
        <div className="container-x mx-auto max-w-[120rem] space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow text-blue">Insights</p>
            <Crumbs page={page} />
          </div>
          {all.slice(0, Math.max(h1i, 0)).length ? <Flow blocks={all.slice(0, h1i)} tone="hero" /> : null}
          {h1 ? <HeadingEl b={h1} role="display" tone="hero" /> : null}
          {intro.length ? <div className="max-w-[60rem] space-y-4"><Flow blocks={intro} tone="hero" /></div> : null}
        </div>
      </header>
      <section className="bg-white py-[clamp(3.5rem,7vw,6rem)] text-ink">
        <div className="container-x mx-auto max-w-[120rem]">
          {cards.length ? (
            <ul role="list" className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c, i) => {
                const btn = c.rest.map(asButton).find(Boolean) ?? null;
                const href = btn?.href ?? (c.heading.html.match(/href="([^"]+)"/)?.[1] ?? null);
                return (
                  <li key={i} className="group flex flex-col">
                    {c.img ? (
                      <div className="overflow-hidden rounded-[14px] bg-offwhite">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media(c.img.src)} alt={c.img.alt ?? ""} width={c.img.width ?? undefined} height={c.img.height ?? undefined} loading="lazy" decoding="async" className="aspect-[16/10] h-auto w-full object-cover transition-[scale] duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" />
                      </div>
                    ) : null}
                    <div className="mt-6 flex flex-1 flex-col gap-4">
                      <HeadingEl b={c.heading} role="group" tone="light" />
                      {c.rest.filter((b) => !asButton(b)).map((b, j) =>
                        b.type === "paragraph" ? <Html key={j} as="p" html={b.html} className={`legacy-rich ${/\d{4}\s*$/.test(plain(b.html)) && plain(b.html).length < 60 ? "text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-steel" : "text-[0.975rem] leading-[1.65] text-graphite"}`} /> : <Flow key={j} blocks={[b]} tone="light" />,
                      )}
                      {btn && href ? (
                        <Link href={href} className="mt-auto inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-blue hover:text-blue-deep">
                          {btn.text} <Arrow className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {tail.length ? <div className="mt-12"><Gallery images={tail as Extract<Block, { type: "image" }>[]} tone="light" /></div> : null}
          <div className="mt-14"><Buttons buttons={[{ href: "/blog/", text: "All articles" }]} tone="light" /></div>
        </div>
      </section>
    </>
  );
}
