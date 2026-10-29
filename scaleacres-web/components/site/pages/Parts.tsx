import Link from "next/link";
import type { CSSProperties } from "react";
import { plain, type Block, type LegacySection } from "@/lib/legacy";
import { asButton } from "@/components/legacy/LegacyBlocks";
import { Flow, Html, Pict, splitHead, blockText } from "@/components/site/Blocks";
import { Btn, Section, lines, type Ground } from "@/components/site/Kit";
import { ndServiceCards } from "@/content/nd";
import { ArrowUR, Tag, Words } from "@/components/nd/ui";

/** Page parts shared by the company pages. All copy and photos come from the live pages. */

type I = Extract<Block, { type: "image" }>;
const d = (n: number) => ({ "--d": n }) as CSSProperties;
const isImg = (b: Block): b is I => b.type === "image";
const SOCIAL = /instagram|facebook|linkedin/i;

/** Uniform photo grid: every photo cropped to the same ratio so rows line up. */
export function PhotoGrid({ images, ratio = "aspect-[4/3]", cols = "grid-cols-2 lg:grid-cols-4", sizes = "(min-width: 1024px) 23vw, 46vw" }: { images: I[]; ratio?: string; cols?: string; sizes?: string }) {
  return (
    <ul role="list" className={`grid gap-[clamp(0.6rem,1.2vw,1rem)] ${cols}`}>
      {images.map((im, i) => (
        <li key={im.src + i} data-nd="clip" style={d((i % 4) * 70)} className={`nd-zoom relative overflow-hidden rounded-[10px] bg-[color:var(--mist)] ${ratio}`}>
          <div className="nd-settle absolute inset-0"><Pict img={im} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" /></div>
        </li>
      ))}
    </ul>
  );
}

/** Founders: portrait beside the story, the opening line set large. */
export function FoundersBand({ s, tone = "white" }: { s: LegacySection; tone?: Ground }) {
  const img = s.blocks.find(isImg);
  const paras = s.blocks.filter((b) => b.type === "paragraph" && !SOCIAL.test(plain(b.html).split(/\s+/).join(" ")) && !asButton(b));
  const social = s.blocks.find((b) => b.type === "paragraph" && /instagram/i.test(plain(b.html)));
  const links = social && social.type === "paragraph" ? [...social.html.matchAll(/href="([^"]+)"[^>]*>\s*([^<]+?)\s*</g)].map((m) => ({ href: m[1], label: m[2] })) : [];
  const [first, ...rest] = paras;
  return (
    <Section tone={tone} label="Founders">
      <div className="nd-grid items-center gap-y-10">
        {img ? (
          <div className="nd-cell">
            <div data-nd="clip" className="nd-zoom relative mx-auto aspect-[4/5] max-w-[26rem] overflow-hidden rounded-[14px] bg-[color:var(--ink)] shadow-[var(--sh-3)] lg:max-w-none">
              <div className="nd-settle absolute inset-0"><Pict img={img} sizes="(min-width: 1024px) 30vw, 90vw" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" /></div>
            </div>
            <p className="nd-label nd-muted mt-4">Mohit &amp; Prem · Founders, ScaleAcres</p>
          </div>
        ) : null}
        <div className="nd-cell lg:col-span-2 lg:pl-[clamp(1rem,3vw,3rem)]">
          <div data-nd="up"><Tag>Founders</Tag></div>
          {first && "html" in first ? <Html as="p" html={first.html} className="mt-7 text-[clamp(1.5rem,2.5vw,2.35rem)] font-medium leading-[1.22] tracking-[-0.03em] [&_strong]:font-semibold [&_strong]:text-[color:var(--royal)]" /> : null}
          {rest.map((b, i) => ("html" in b ? <Html key={i} as="p" html={b.html} className="nd-lead nd-muted mt-6 max-w-[40rem] [&_strong]:font-semibold [&_strong]:text-[color:var(--ink)]" /> : null))}
          {links.length ? (
            <ul role="list" className="mt-8 flex flex-wrap gap-2">
              {links.map((l) => <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-l)] px-4 py-2 text-[0.9375rem] font-medium transition-colors hover:border-[color:var(--royal)] hover:text-[color:var(--royal)]">{l.label} <ArrowUR className="h-3 w-3" /></a></li>)}
            </ul>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

/** A heading with long copy: title on the left, the copy at reading size on the right. */
export function StoryBand({ s, tone = "mist", tag }: { s: LegacySection; tone?: Ground; tag: string }) {
  const { title, rest } = splitHead(s.blocks);
  const btn = rest.map(asButton).find(Boolean);
  const body = rest.filter((b) => !asButton(b));
  const t = title ? blockText(title) : tag;
  return (
    <Section tone={tone} label={t}>
      <div className="nd-grid gap-y-8">
        <div className="nd-cell">
          <div data-nd="up"><Tag>{tag}</Tag></div>
          <Words as="h2" lines={lines(t, 14)} className="mt-6 text-[clamp(2.2rem,4.4vw,4.25rem)] font-semibold leading-[0.96] tracking-[-0.045em]" />
        </div>
        <div className="nd-cell lg:col-span-2" data-nd="up">
          <div className="nd-flow [&>p]:text-[clamp(1.125rem,1.35vw,1.3125rem)] [&>p]:leading-[1.65]"><Flow blocks={body} /></div>
          {btn ? <div className="mt-8"><Btn href={btn.href.replace(/^#elementor.*/, "/contact-us/")}>{btn.text}</Btn></div> : null}
        </div>
      </div>
    </Section>
  );
}

const EXPERTISE_IMG: [RegExp, string][] = [[/lead/i, "performance-marketing"], [/brand/i, "branding-creative-design"], [/advertis|digital/i, "social-media-marketing"]];

/**
 * "Our expertise": the live page lists three capabilities whose descriptions were cut off on the
 * live site ("Targeted Lead Generation – Connecting you"). Only the complete names are shown, each
 * with the matching ScaleAcres service work.
 */
export function ExpertiseBand({ s, tone = "white" }: { s: LegacySection; tone?: Ground }) {
  const { title, rest } = splitHead(s.blocks);
  const intro = rest.find((b) => b.type === "paragraph");
  const items = rest.filter((b) => b.type === "heading").map((b) => blockText(b).split(/\s+[–-]\s+/)[0].trim());
  return (
    <Section tone={tone} label="Our expertise">
      <div className="nd-grid items-end gap-y-6">
        <div className="nd-cell lg:col-span-2">
          <div data-nd="up"><Tag>Our expertise</Tag></div>
          <Words as="h2" lines={[title ? blockText(title) : "Our Expertise"]} className="mt-6 text-[clamp(2.2rem,4.8vw,4.75rem)] font-semibold leading-[0.96] tracking-[-0.045em]" />
        </div>
        {intro && "html" in intro ? <Html as="p" html={intro.html} className="nd-cell nd-lead nd-muted max-w-[30rem] lg:pb-2" /> : null}
      </div>
      <ul role="list" className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(0.75rem,1.6vw,1.5rem)] gap-y-10 px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-3">
        {items.map((name, i) => {
          const slug = EXPERTISE_IMG.find(([re]) => re.test(name))?.[1];
          const svc = ndServiceCards.find((c) => c.slug === slug);
          return (
            <li key={name} className="group">
              {svc ? (
                <Link href={svc.href} className="block">
                  <div data-nd="clip" style={d(i * 90)} className="nd-zoom relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f4f5f7] shadow-[var(--sh-1)] transition-shadow duration-500 group-hover:shadow-[var(--sh-3)]">
                    <div className="nd-settle absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={svc.image.src} srcSet={svc.image.srcSet} sizes="(min-width: 768px) 31vw, 92vw" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                  </div>
                </Link>
              ) : null}
              <div data-nd="up" style={d(i * 90 + 120)} className="mt-5 flex items-start gap-4">
                <span className="nd-label tabular-nums text-[color:var(--royal)]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[clamp(1.35rem,1.9vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em]">{name}</h3>
                  {svc ? <p className="nd-muted mt-2 text-[1rem]">{svc.caption}</p> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export { Flow };
