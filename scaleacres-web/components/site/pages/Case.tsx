import Link from "next/link";
import type { CSSProperties } from "react";
import { getLegacyPage, media, plain, type Block, type LegacyPage } from "@/lib/legacy";
import { Flow, Html, Pict, blockText } from "@/components/site/Blocks";
import { Btn, ClosingCta, Crumbs, Head, Section, StatRow } from "@/components/site/Kit";
import { VideoTiles, type Clip } from "@/components/site/Media";
import { ArrowUR, Rules, Tag, Words } from "@/components/nd/ui";

/**
 * Case-study detail, built from the live case-study page. Only what the page publishes is shown:
 * results, facts, the client's ad videos, challenges, the strategy steps, the campaign dashboard
 * and the outcome. Stock illustrations and unfinished placeholders from the live page are left out.
 */

type I = Extract<Block, { type: "image" }>;
const d = (n: number) => ({ "--d": n }) as CSSProperties;

export const CASES = [
  { path: "/yugen-case-study/", slug: "yugen-goa", client: "Yugen Infra", place: "North Goa", card: "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-03.webp", video: "Yugen Infra reel", services: "Brand campaign and hoardings · Video ads · Google PPC and Meta ads · Channel-partner programme" },
  { path: "/blog/casestudy/our-case-one-goa/", slug: "one-goa", client: "One Goa · The House of Abhinandan Lodha", place: "Bicholim, Goa", card: "/wp-content/uploads/2025/04/Scale-Acres-Case-Study-Cards-02.webp", video: "One Goa ad film", services: "Video ads in every format · Multichannel performance marketing · Leads for 12+ channel partners" },
] as const;

const JUNK_IMG = /bwink|casest|casewee|casestdy|Frame-2147223882|image-198|Group-2147223980|Case-Stu(d|c)y-Cards/i;
const junk = (b: Block) =>
  (b.type === "list" && b.items.every((t) => /^\s*\[show-/.test(plain(t)))) ||
  (b.type === "image" && JUNK_IMG.test(b.src)) ||
  (b.type === "paragraph" && plain(b.html).replace(/[\s​]/g, "") === "") ||
  (b.type === "heading" && /^(here are creative videos|more case studies)$/i.test(blockText(b).trim()));
const btnLike = (b: Block) => b.type === "paragraph" && /^\s*<a [^>]*>[^<]{2,40}<\/a>\s*$/.test(b.html.trim());
const titleCase = (t: string) => (t === t.toUpperCase() ? t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s-\s/, ": ") : t);

export function CaseDetailPage({ page }: { page: LegacyPage }) {
  const meta = CASES.find((c) => c.path === page.path);
  const all = page.sections.flatMap((s) => s.blocks).filter((b) => !junk(b) && !btnLike(b));
  const H = (re: RegExp) => all.findIndex((b) => b.type === "heading" && re.test(blockText(b)));
  const logo = page.sections[0]?.blocks.find((b): b is I => b.type === "image");
  const h1 = all.find((b) => b.type === "heading" && b.level === 1);
  const h2top = page.sections[0]?.blocks.find((b) => b.type === "heading" && b.level === 2);
  const title = titleCase(blockText((h1 && page.sections[0].blocks.includes(h1) ? h1 : h2top ?? h1)!));
  // results: stat blocks, labelled by the next heading when the stat has none
  const stats = all.flatMap((b, i) => {
    if (b.type !== "stat") return [];
    const next = all[i + 1];
    return [{ value: b.value.replace(/\s+\+/, "+"), label: b.label || (next && next.type === "heading" ? blockText(next) : "") }];
  });
  const facts: { k: string; v: string }[] = [];
  all.forEach((b) => {
    const t = "html" in b ? plain(b.html) : "";
    if (b.type === "heading" && /^(client|project location)\s*:/i.test(t)) facts.push({ k: t.split(":")[0].trim(), v: t.split(":").slice(1).join(":").trim() });
    if (b.type === "paragraph" && /all clients location\s*:/i.test(t)) {
      const m = t.match(/All Clients Location\s*:\s*(.*?)\s*Product\s*:\s*(.*)$/i);
      if (m) { facts.push({ k: "Buyers from", v: m[1].replace(/Delshi/i, "Delhi").replace(/\s*,\s*/g, ", ") }); facts.push({ k: "Product", v: m[2].replace(/\s*\|\s*/g, " · ") }); }
    }
  });
  const clips: Clip[] = all.flatMap((b) => {
    if (b.type !== "video") return [];
    const id = (b.embed ?? b.src ?? "").match(/shorts\/([\w-]{11})|youtu\.be\/([\w-]{11})|v=([\w-]{11})/)?.slice(1).find(Boolean);
    return id ? [{ host: "youtube" as const, id, poster: `/media/ext/yt-${id}.webp`, title: meta?.video ?? "Ad film", ratio: id === "9qwSclZWaag" ? ("1/1" as const) : ("9/16" as const) }] : [];
  }).map((c, i, a) => ({ ...c, title: a.length > 1 ? `${c.title} ${i + 1}` : c.title }));
  const ov = H(/project overview/i);
  const overview = ov >= 0 ? all[ov + 1] : null;
  const ch = H(/challenges/i), ap = H(/strategic approach/i), dash = H(/real-time campaign dashboard|our creative magic/i), rs = H(/^results/i), cn = H(/conclusion/i);
  const stop = (from: number) => { const n = [ch, ap, dash, rs, cn].filter((x) => x > from).sort((a, b) => a - b)[0]; return n ?? all.length; };
  const challenges = ch >= 0 ? all.slice(ch + 1, stop(ch)).filter((b) => b.type === "paragraph").map((b) => { const t = plain((b as { html: string }).html).trim(); const [k, ...v] = t.split(/\s+[–-]\s+/); return { k: v.length ? k : "", v: v.length ? v.join(" – ") : t }; }) : [];
  const stepsRaw = ap >= 0 ? all.slice(ap + 1, stop(ap)) : [];
  const steps: { h: string; body: Block[] }[] = [];
  stepsRaw.forEach((b) => {
    if (b.type === "heading") steps.push({ h: blockText(b), body: [] });
    else if (b.type !== "image" && b.type !== "video" && steps.length) steps[steps.length - 1].body.push(b);
  });
  const cleanSteps = steps.filter((s) => s.body.length);
  const dashImgs = all.filter((b): b is I => b.type === "image" && /1742\d+/.test(b.src));
  const results = rs >= 0 ? all.slice(rs + 1, stop(rs)).filter((b) => b.type === "list" || b.type === "paragraph") : [];
  const conclusion = cn >= 0 ? all.slice(cn + 1, stop(cn)).filter((b) => b.type === "paragraph") : [];
  const hero = all.find((b): b is I => b.type === "image" && b !== logo && (b.width ?? 0) >= 700 && !/1742/.test(b.src));
  const other = CASES.filter((c) => c.path !== page.path);
  return (
    <>
      {h1 && blockText(h1) !== title ? <h1 className="sr-only">{blockText(h1)}</h1> : null}
      <section className="nd-dark relative overflow-hidden" aria-label="Case study">
        <Rules />
        <div className="nd-wrap relative pb-[clamp(3rem,6vw,5rem)] pt-[clamp(7.5rem,13vw,10.5rem)]">
          <div className="nd-cell flex flex-wrap items-center justify-between gap-4">
            <div data-nd="up"><Tag>Case study</Tag></div>
            <div data-nd="up"><Crumbs items={[{ label: "Home", href: "/" }, { label: "Case studies", href: "/case-studies/" }, { label: meta?.client ?? title }]} /></div>
          </div>
          <div className="nd-grid mt-[clamp(1.75rem,4vw,3rem)] items-end gap-y-10">
            <div className="nd-cell lg:col-span-2">
              {logo ? <div data-nd="up" className="mb-8 inline-flex h-20 items-center rounded-[12px] bg-white/[0.06] px-5 ring-1 ring-white/10"><Pict img={logo} eager sizes="260px" className="h-14 w-auto max-w-[15rem] object-contain" /></div> : null}
              {h1 && page.sections[0].blocks.includes(h1)
                ? <Words as="h1" lines={[title]} className="text-[clamp(2.3rem,5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]" />
                : <Words as="p" lines={[title]} className="text-[clamp(2.6rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]" />}
              <div data-nd="up" style={d(200)} className="mt-8 flex flex-wrap gap-3">
                <Btn href="#approach" variant="white">See how we did it</Btn>
                <Btn href="/contact-us/">Start a project</Btn>
              </div>
            </div>
            {meta ? (
              <div className="nd-cell" data-nd="up" style={d(160)}>
                {stats.length === 1 ? (
                  <div className="mb-8">
                    <p className="text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-[color:var(--sky)]">{stats[0].value}</p>
                    <p className="nd-label mt-3 text-white/70">{stats[0].label}</p>
                  </div>
                ) : null}
                <dl className="grid gap-5 border-t border-white/12 pt-6">
                  <div><dt className="nd-label text-white/55">Client</dt><dd className="mt-1 text-[1.125rem] font-medium">{meta.client}</dd></div>
                  <div><dt className="nd-label text-white/55">Location</dt><dd className="mt-1 text-[1.125rem] font-medium">{meta.place}</dd></div>
                  <div><dt className="nd-label text-white/55">Services</dt><dd className="mt-1 text-[1.0625rem] text-white/80">{meta.services}</dd></div>
                </dl>
              </div>
            ) : null}
          </div>
          {stats.length > 1 ? <div className="nd-cell mt-[clamp(2.5rem,5vw,4rem)]"><StatRow dark stats={stats} /></div> : null}
        </div>
      </section>

      {overview || hero || facts.length ? (
        <Section tone="white" label="Project overview">
          <div className="nd-grid items-center gap-y-10">
            <div className="nd-cell lg:col-span-2">
              <div data-nd="up"><Tag>Project overview</Tag></div>
              {overview && "html" in overview ? <Html as="p" html={overview.html} className="mt-7 text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.025em]" /> : null}
              {facts.length ? (
                <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {facts.map((f) => <div key={f.k} data-nd="up" className="border-t border-[color:var(--line-l)] pt-4"><dt className="nd-label nd-muted">{f.k}</dt><dd className="mt-2 text-[1.125rem] font-medium">{f.v}</dd></div>)}
                </dl>
              ) : null}
            </div>
            {hero ? <div className="nd-cell"><div data-nd="clip" className="nd-zoom overflow-hidden rounded-[14px] shadow-[var(--sh-3)]"><div className="nd-settle"><Pict img={hero} sizes="(min-width: 1024px) 30vw, 92vw" className="block h-auto w-full" /></div></div></div> : null}
          </div>
        </Section>
      ) : null}

      {clips.length ? (
        <Section tone="dark" label="Video ads">
          <Head dark tag="Video ads" title="The films that drove the enquiries." accent={["enquiries."]} intro="Ad films produced by ScaleAcres for the campaign, as published on the ScaleAcres YouTube channel." size="md" />
          <div className="mt-[clamp(2.5rem,5vw,4rem)]"><VideoTiles dark clips={clips} cols={clips.length >= 4 ? 4 : clips.length === 3 ? 3 : 2} /></div>
        </Section>
      ) : null}

      {challenges.length ? (
        <Section tone="mist" label="Challenges">
          <Head tag="The brief" title="Challenges" />
          <ol role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid border-t border-[color:var(--line-l)] md:grid-cols-2">
            {challenges.map((c, i) => (
              <li key={i} data-nd="up" style={d((i % 2) * 80)} className="border-b border-[color:var(--line-l)] px-[clamp(0.75rem,1.2vw,1.25rem)] py-8 md:odd:border-r">
                <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
                {c.k ? <h3 className="mt-4 text-[clamp(1.3rem,1.8vw,1.6rem)] font-semibold leading-tight tracking-[-0.025em]">{c.k}</h3> : null}
                <p className="nd-muted mt-3 max-w-[36rem] text-[1.0625rem] leading-[1.65]">{c.v}</p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {cleanSteps.length ? (
        <Section tone="white" id="approach" label="Strategic approach">
          <Head tag="How we did it" title="Strategic approach" />
          <ol role="list" className="mt-[clamp(2.5rem,5vw,4rem)]">
            {cleanSteps.map((st, i) => (
              <li key={i} className="nd-grid gap-y-4 border-t border-[color:var(--line-l)] py-[clamp(1.75rem,3.5vw,2.75rem)]">
                <div className="nd-cell" data-nd="up">
                  <span className="nd-label tabular-nums text-[color:var(--royal)]">Step {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-[clamp(1.4rem,2.2vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em]">{st.h.replace(/^\d+[.)]\s*/, "")}</h3>
                </div>
                <div className="nd-cell lg:col-span-2" data-nd="up" style={d(100)}><Flow blocks={st.body} /></div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {dashImgs.length ? (
        <Section tone="dark" label="Campaign dashboard">
          <Head dark tag="Live reporting" title="Real-time campaign dashboard." accent={["dashboard."]} intro="The reporting view the client saw throughout the campaign." size="md" />
          <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-[clamp(0.75rem,1.6vw,1.5rem)] px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-2">
            {dashImgs.map((im, i) => (
              <li key={i} data-nd="clip" style={d(i * 90)} className={`overflow-hidden rounded-[10px] bg-white ring-1 ring-white/10 ${i === 0 ? "md:col-span-2" : ""}`}>
                <div className="flex h-7 items-center gap-1.5 bg-[#f4f5f7] px-3">{[0, 1, 2].map((k) => <span key={k} className="h-2 w-2 rounded-full bg-[#d1d5dc]" />)}</div>
                <Pict img={im} sizes="(min-width: 768px) 31vw, 92vw" className="block h-auto w-full" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {results.length || conclusion.length ? (
        <Section tone="white" label="Results">
          <div className="nd-grid gap-y-10">
            <div className="nd-cell"><div data-nd="up"><Tag>Outcome</Tag></div><Words as="h2" lines={["Results & impact."]} accent={["impact."]} className="mt-6 text-[clamp(2.2rem,4.4vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.045em]" /></div>
            <div className="nd-cell lg:col-span-2" data-nd="up">
              {results.length ? <Flow blocks={results} /> : null}
              {conclusion.length ? <div className="mt-10 border-l-2 border-[color:var(--royal)] pl-6"><p className="nd-label nd-muted">Conclusion</p><div className="mt-3 [&_p]:text-[1.25rem] [&_p]:leading-[1.55] [&_p]:text-[color:var(--ink)]"><Flow blocks={conclusion} /></div></div> : null}
            </div>
          </div>
        </Section>
      ) : null}

      {other.length ? (
        <Section tone="mist" pad="tight" label="More case studies">
          <div className="nd-grid items-center gap-y-6">
            <div className="nd-cell"><Tag>Next case study</Tag></div>
            {other.map((o) => {
              const op = getLegacyPage(o.path);
              return (
                <Link key={o.path} href={o.path} className="group nd-cell flex items-center gap-5 lg:col-span-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media(o.card)} alt="" width={536} height={536} loading="lazy" className="h-24 w-24 rounded-[10px] object-cover shadow-[var(--sh-1)]" />
                  <span className="text-[clamp(1.4rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] transition-colors group-hover:text-[color:var(--royal)]">{o.client}<span className="nd-label nd-muted mt-2 block">{op ? "Read the case study" : ""}</span></span>
                  <ArrowUR className="ml-auto h-5 w-5 transition-transform group-hover:rotate-45" />
                </Link>
              );
            })}
          </div>
        </Section>
      ) : null}
      <ClosingCta />
    </>
  );
}
