import { plain, type Block, type LegacyPage, type LegacySection } from "@/lib/legacy";
import { asButton } from "@/components/legacy/LegacyBlocks";

/** Helpers that read a captured live page for the redesigned templates (content is never altered). */

export type Prepared = {
  h1: string;
  lead: string | null;
  leadHtml: string | null;
  actions: { href: string; text: string }[];
  sections: LegacySection[];
};

const onlyImages = (s: LegacySection) => s.blocks.length > 0 && s.blocks.every((b) => b.type === "image");

/** Lifts the page's H1 (and a short line after it) into the hero and drops the decorative banner. */
export function prepare(page: LegacyPage): Prepared {
  let sections = page.sections.map((s) => ({ ...s, blocks: [...s.blocks] }));
  if (sections[0] && onlyImages(sections[0]) && sections[0].blocks.length <= 2) sections = sections.slice(1);
  let h1 = page.headings?.h1?.[0] ? plain(page.headings.h1[0]) : "";
  let lead: string | null = null, leadHtml: string | null = null;
  const actions: { href: string; text: string }[] = [];
  outer: for (const s of sections) {
    for (let i = 0; i < s.blocks.length; i++) {
      const b = s.blocks[i];
      if (b.type === "heading" && b.level === 1) {
        h1 = b.text || plain(b.html);
        s.blocks.splice(i, 1);
        // a kicker heading right before the H1 ("CAREER AT Scaleacers") is dropped into the tag
        const n = s.blocks[i];
        if (n && ((n.type === "heading" && n.level >= 2 && plain(n.html).length <= 140) || (n.type === "paragraph" && plain(n.html).length <= 320 && !asButton(n)))) {
          leadHtml = (n as { html: string }).html; lead = plain(leadHtml); s.blocks.splice(i, 1);
        }
        const btn = s.blocks[i] ? asButton(s.blocks[i]) : null;
        if (btn) { actions.push(btn); s.blocks.splice(i, 1); }
        break outer;
      }
    }
  }
  sections = sections.filter((s) => s.blocks.length > 0 && !onlyDecor(s));
  return { h1: h1 || plain(page.title.split("|")[0]), lead, leadHtml, actions, sections };
}

const onlyDecor = (s: LegacySection) => s.blocks.every((b) => b.type === "image" && /\.svg$/i.test(b.src) && !/logo/i.test(b.src));

export const hasFaq = (s: LegacySection) => s.blocks.some((b) => b.type === "faq");
export const hasForm = (s: LegacySection) => s.blocks.some((b) => b.type === "form");
export const imageShare = (s: LegacySection) => s.blocks.filter((b) => b.type === "image").length / Math.max(1, s.blocks.length);
export const textOf = (b: Block) => ("html" in b ? plain(b.html) : "");

/** Accent word for a hero: the last word of a short title, or a meaningful keyword. */
export function accentFor(title: string) {
  const words = title.replace(/[?.!]+$/, "").split(/\s+/);
  const key = words.find((w) => /^(Growth|Leads|Brands?|Scale|Success|Results?|Work|Team|Careers?|ScaleAcres|Studio|Stories|Talk)$/i.test(w));
  return key ? [key, `${key}.`, `${key}?`] : [];
}
