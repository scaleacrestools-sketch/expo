import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { themeOptions, proposalLogo, contrast, verdict, type ThemeOption } from "@/content/themes";
import { brand } from "@/content/brand";
import { ArrowLink } from "@/components/ui/ArrowLink";

/**
 * Colour exploration comparison — PREVIEW ONLY. Not linked from the site, not in the
 * sitemap, noindex, and switched off entirely with THEME_LAB=off (do this before launch).
 */
export const metadata: Metadata = {
  title: "Colour exploration — preview only",
  robots: { index: false, follow: false },
};

const [baseline, red, midnight] = themeOptions;
const options = [red, midnight];

export default function ThemeLabPage() {
  if (process.env.THEME_LAB === "off") notFound();
  return (
    <div className="bg-[#f2f2f2] text-[#141414] print:bg-white">
      {/* Intro */}
      <section className="bg-[#141414] text-white">
        <div className="container-x mx-auto max-w-[110rem] pb-16 pt-[calc(var(--header-h)+4rem)] md:pb-20">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/55">ScaleAcres · Colour exploration · Not approved</p>
          <h1 className="mt-6 max-w-[18ch] text-[clamp(2.5rem,1rem+5vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">Two colour directions, one real website.</h1>
          <p className="mt-8 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-white/75">
            Both options re-map the same design tokens across the live layout: every section, hover, divider, menu and CTA. Content, section order, video,
            SEO and links are untouched. The approved black-and-blue baseline stays the default and is the only version that can appear on scaleacres.com.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {themeOptions.map((t) => (
              <a key={t.id} href={`/?theme=${t.id}`} className="group flex items-center justify-between gap-4 rounded-md border border-white/15 p-5 transition-colors hover:border-white/60">
                <span>
                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">Preview full homepage</span>
                  <span className="mt-1 block text-lg font-bold">{t.label}</span>
                </span>
                <span className="flex">
                  {t.swatches.map((s) => (
                    <span key={s.hex} className="-ml-2 h-7 w-7 rounded-full ring-2 ring-[#141414]" style={{ background: s.hex }} />
                  ))}
                </span>
              </a>
            ))}
          </div>
          <ol className="mt-10 grid gap-x-10 gap-y-3 text-[0.9375rem] leading-[1.6] text-white/70 md:grid-cols-2">
            <li><b className="text-white">1.</b> Open any preview above, or use the <b className="text-white">Preview</b> bar at the bottom of every page to switch instantly. The video keeps playing.</li>
            <li><b className="text-white">2.</b> <b className="text-white">Logo: Official / Proposal</b> shows the recoloured logo proposal for that option. Official is the default.</li>
            <li><b className="text-white">3.</b> Direct links: <code>/?theme=reddash</code>, <code>/?theme=midnight</code>, <code>/?theme=baseline</code>, add <code>&amp;logo=proposal</code>.</li>
            <li><b className="text-white">4.</b> The choice is remembered per browser; it is ignored on scaleacres.com.</li>
          </ol>
        </div>
      </section>

      {options.map((o, i) => (
        <OptionSection key={o.id} option={o} index={i + 1} />
      ))}

      <Comparison />
      <Recommendation />
    </div>
  );
}

function OptionSection({ option: o, index }: { option: ThemeOption; index: number }) {
  const g = o.ground;
  const theme = o.id as "reddash" | "midnight";
  return (
    <section className="border-b border-black/10 py-20 md:py-28 print:break-before-page" aria-labelledby={`opt-${o.id}`}>
      <div className="container-x mx-auto max-w-[110rem]">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-black/50">Option {index}</p>
        <h2 id={`opt-${o.id}`} className="mt-3 text-[clamp(2rem,1rem+3vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]">{o.label.replace(/^Option \d — /, "")}</h2>
        <p className="mt-5 max-w-[70ch] text-[1.0625rem] leading-[1.7] text-black/70">{o.concept}</p>
        <a href={`/?theme=${o.id}`} className="mt-6 inline-flex items-center gap-2 border-b-2 border-current pb-0.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em]">Preview the full homepage in this option ↗</a>

        {/* Swatches */}
        <h3 className="mt-14 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-black/55">Palette</h3>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4" role="list">
          {o.swatches.map((s) => (
            <li key={s.hex} className="overflow-hidden rounded-md border border-black/10 bg-white">
              <div className="h-28 md:h-36" style={{ background: s.hex }} />
              <div className="p-4">
                <p className="font-bold">{s.name}</p>
                <p className="mt-0.5 font-mono text-sm">{s.hex}</p>
                <p className="mt-2 text-[0.8125rem] leading-snug text-black/60">{s.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="mt-3 flex flex-wrap gap-3" role="list" aria-label="Supporting tokens">
          {o.support.map((s) => (
            <li key={s.hex} className="flex items-center gap-3 rounded-md border border-black/10 bg-white py-2 pl-2 pr-4 text-[0.8125rem]">
              <span className="h-8 w-8 rounded" style={{ background: s.hex }} />
              <span><b>{s.name}</b> <span className="font-mono">{s.hex}</span> · <span className="text-black/60">{s.role}</span></span>
            </li>
          ))}
        </ul>

        {/* In context — real site classes, scoped to this theme */}
        <h3 className="mt-16 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-black/55">In context · typography, grounds and CTAs</h3>
        <div data-theme={o.id} className="mt-5 grid overflow-hidden rounded-md border border-black/10 lg:grid-cols-3">
          <div className="bg-ink p-8 text-white md:p-10">
            <p className="eyebrow text-blue">Dark section</p>
            <p className="mt-6 text-[clamp(2rem,1rem+2.2vw,3.25rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.035em]">Big ideas. <span className="text-blue">Built into action.</span></p>
            <p className="mt-5 text-[0.975rem] leading-[1.7] text-grey-soft">Body copy on the dark ground, with supporting text in the muted tone.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ArrowLink href={`/?theme=${o.id}`} variant="blue">Let&apos;s Talk</ArrowLink>
              <ArrowLink href={`/?theme=${o.id}`} variant="outline" className="text-white">View Work</ArrowLink>
            </div>
          </div>
          <div className="bg-white p-8 text-ink md:p-10">
            <p className="eyebrow text-blue-deep">Light section</p>
            <p className="mt-6 text-[clamp(2rem,1rem+2.2vw,3.25rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.035em]">Our work. <span className="text-blue-deep">Our signature.</span></p>
            <p className="mt-5 text-[0.975rem] leading-[1.7] text-grey-dark">Body copy on white, accent text in the deep accent for accessible contrast.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ArrowLink href={`/?theme=${o.id}`} variant="offwhite">View All Our Work</ArrowLink>
              <ArrowLink href={`/?theme=${o.id}`} variant="ghost" className="text-ink">Read more</ArrowLink>
            </div>
          </div>
          <div className="footer-cta bg-ink p-8 text-white md:p-10">
            <p className="eyebrow text-blue">Closing band</p>
            <p className="mt-6 text-[clamp(2rem,1rem+2.2vw,3.25rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">Let&apos;s build something that <span className="text-blue">matters.</span></p>
            <a href={`/?theme=${o.id}`} className="footer-cta__btn mt-8 inline-flex items-center gap-3 rounded-full bg-blue px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-on-accent transition-colors hover:bg-white hover:text-ink">Let&apos;s Talk ↗</a>
          </div>
        </div>
        <div data-theme={o.id} className="mt-3 grid overflow-hidden rounded-md border border-black/10 md:grid-cols-4">
          {[
            { bg: g.dark, fg: g.text, accent: g.accentSmallDark, name: "Dark" },
            { bg: g.light, fg: "#141414", accent: g.accentDeep, name: "White" },
            { bg: g.alt, fg: "#141414", accent: g.accentDeep, name: "Alt light" },
            { bg: g.accent, fg: g.onAccent, accent: g.onAccent, name: "Accent" },
          ].map((c) => (
            <div key={c.name} className="p-6" style={{ background: c.bg, color: c.fg }}>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em]" style={{ color: c.accent }}>{c.name} ground</p>
              <p className="mt-3 text-3xl font-extrabold uppercase tracking-[-0.03em]">Aa Scale</p>
              <p className="mt-2 text-sm leading-relaxed opacity-90">Outfit 400 body, 800 headings.</p>
            </div>
          ))}
        </div>

        {/* Service row + portfolio filter, as on the homepage */}
        <div data-theme={o.id} className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-md bg-ink p-6 text-white">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50">Service accordion — hover / open</p>
            <div className="mt-4 flex items-center justify-between bg-blue px-4 py-4 text-on-accent">
              <span className="text-xl font-extrabold uppercase">02 Search Engine Optimization</span><span>+</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-4">
              <span className="text-xl font-extrabold uppercase text-blue">01 Website Design</span>
              <span className="grid h-8 w-8 rotate-45 place-items-center rounded-full bg-blue text-on-accent">+</span>
            </div>
          </div>
          <div className="rounded-md bg-white p-6 text-ink">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/50">Portfolio filters + card</p>
            <div className="mt-4 flex gap-6 border-y border-ink/10 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
              <span className="relative text-ink">All Work<span className="absolute -bottom-3 left-0 h-[2px] w-full bg-blue" /></span>
              <span className="text-ink/55">Websites</span><span className="text-ink/55">Real Estate</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span><span className="label text-blue-deep">Real Estate Campaigns</span><span className="block text-2xl font-extrabold uppercase">Yugen</span></span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-blue text-on-accent">↗</span>
            </div>
          </div>
        </div>

        {/* Logo */}
        <h3 className="mt-16 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-black/55">Logo treatment</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <LogoTile src={brand.logo.reversed} bg={g.dark} label="Official logo on dark" note="Approved artwork — default in this option" />
          <LogoTile src={brand.logo.primary} bg={g.light} label="Official logo on light" note="Approved artwork" border />
          <LogoTile src={proposalLogo(theme, "dark")} bg={g.dark} label="Proposal on dark" note={theme === "reddash" ? "Symbol + strapline in Creative Red" : "Symbol + strapline in Electric Cyan"} proposal />
          <LogoTile src={proposalLogo(theme, "light")} bg={g.light} label="Proposal on light" note={theme === "reddash" ? "Black wordmark, red symbol" : "Navy wordmark, official blue symbol (cyan is too light on white)"} proposal border />
        </div>

        {/* Contrast */}
        <h3 className="mt-16 text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-black/55">Contrast and accessibility (WCAG 2.2)</h3>
        <ContrastTable option={o} />
      </div>
    </section>
  );
}

function LogoTile({ src, bg, label, note, proposal, border }: { src: string; bg: string; label: string; note: string; proposal?: boolean; border?: boolean }) {
  return (
    <figure className={`relative overflow-hidden rounded-md ${border ? "border border-black/10" : ""}`}>
      <div className="grid h-40 place-items-center px-8" style={{ background: bg }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} width={brand.logo.width} height={brand.logo.height} className="h-12 w-auto" />
      </div>
      {proposal ? <span className="absolute right-2 top-2 rounded-sm bg-[#ffd400] px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-black">Proposal — not approved</span> : null}
      <figcaption className="bg-white p-4 text-[0.8125rem]">
        <b>{label}</b>
        <span className="mt-1 block text-black/60">{note}</span>
      </figcaption>
    </figure>
  );
}

function ContrastTable({ option: o }: { option: ThemeOption }) {
  const g = o.ground;
  const rows = [
    ["Body text on dark", g.text, g.dark],
    ["Muted text on dark", g.muted, g.dark],
    ["Accent text on dark", g.accentSmallDark, g.dark],
    ["Accent fill vs dark ground (buttons, rules — graphic, needs 3:1)", g.accent, g.dark],
    ["Dark text on white", g.dark, g.light],
    ["Body text on light", g.mutedLight, g.alt],
    ["Accent text on white", g.accentDeep, g.light],
    ["Accent text on alt light", g.accentDeep, g.alt],
    ["Button label on accent fill", g.onAccent, g.accent],
    ["Raw accent on white (not used for text)", g.accent, g.light],
  ] as const;
  return (
    <div className="mt-5 overflow-x-auto rounded-md border border-black/10 bg-white">
      <table className="w-full min-w-[36rem] text-left text-[0.875rem]">
        <thead className="bg-black/[0.04] text-[0.6875rem] uppercase tracking-[0.14em] text-black/55">
          <tr><th className="p-3">Pair</th><th className="p-3">Sample</th><th className="p-3">Ratio</th><th className="p-3">WCAG</th></tr>
        </thead>
        <tbody>
          {rows.map(([name, fg, bg]) => {
            const r = contrast(fg, bg);
            const v = name.includes("graphic") ? (r >= 3 ? "Pass (graphic 3:1)" : "Fail") : verdict(r);
            return (
              <tr key={name} className="border-t border-black/5">
                <td className="p-3">{name}<span className="block font-mono text-[0.75rem] text-black/50">{fg} on {bg}</span></td>
                <td className="p-3"><span className="inline-block rounded px-3 py-1 font-semibold" style={{ color: fg, background: bg }}>Aa Text</span></td>
                <td className="p-3 font-mono">{r.toFixed(2)}:1</td>
                <td className="p-3"><span className={`rounded-sm px-2 py-0.5 text-[0.75rem] font-bold ${v === "Fail" ? "bg-red-100 text-red-800" : v.startsWith("AA large") ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>{v}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Comparison() {
  const rows: [string, string, string][] = [
    ["Personality", "Loud, confident, creative-agency attitude", "Calm authority: premium, international, technical"],
    ["Fit with the official logo", "Clashes with the blue symbol unless the logo is recoloured (a brand change)", "Same blue family; the official logo works unchanged"],
    ["Real estate audience", "Red reads as urgency/offer in property advertising", "Navy and cyan read as trust, architecture and technology"],
    ["Distinctiveness", "Close to the reference agency's identity; risk of looking derivative", "Original to ScaleAcres; uncommon among Indian agencies"],
    ["Accessibility", "Red needs a deeper shade for text on white (#C8191C) and a brighter one for text on black (#F2383B)", "Cyan is excellent on navy (9.5:1); deep cyan used on light grounds"],
    ["Photography and video", "Strong with high-contrast black footage; competes with warm interiors", "Complements blue-hour architecture and the Higgsfield showreel grade"],
  ];
  return (
    <section className="py-20 md:py-28 print:break-before-page" aria-labelledby="compare">
      <div className="container-x mx-auto max-w-[110rem]">
        <h2 id="compare" className="text-[clamp(2rem,1rem+3vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Side by side</h2>
        <div className="mt-10 overflow-x-auto rounded-md border border-black/10 bg-white">
          <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
            <thead className="text-[0.6875rem] uppercase tracking-[0.14em] text-black/55">
              <tr className="bg-black/[0.04]"><th className="w-1/5 p-4" /><th className="p-4">Option 1 · Red Dash Inspired</th><th className="p-4">Option 2 · Midnight Electric</th></tr>
            </thead>
            <tbody>
              {rows.map(([k, a, b]) => (
                <tr key={k} className="border-t border-black/5 align-top"><th className="p-4 font-semibold">{k}</th><td className="p-4 text-black/75">{a}</td><td className="p-4 text-black/75">{b}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[0.875rem] text-black/55">
          Baseline for reference: {baseline.swatches.map((s) => `${s.name} ${s.hex}`).join(" · ")}.
        </p>
      </div>
    </section>
  );
}

function Recommendation() {
  return (
    <section className="bg-[#0a1421] py-20 text-[#f7f9fa] md:py-28" aria-labelledby="rec">
      <div className="container-x mx-auto max-w-[110rem]">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#36c8f5]">Recommendation</p>
        <h2 id="rec" className="mt-4 max-w-[20ch] text-[clamp(2rem,1rem+3vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Option 2: Midnight Electric</h2>
        <ol className="mt-10 grid gap-8 text-[1rem] leading-[1.7] text-[#f7f9fa]/80 md:grid-cols-2">
          <li><b className="text-white">It keeps the logo you already own.</b> Electric Cyan sits beside the official blue symbol, so no logo change is needed. Option 1 only looks resolved with a recoloured logo, which is a brand change, not a website change.</li>
          <li><b className="text-white">It is unmistakably ScaleAcres.</b> Option 1 is deliberately close to the Red Dash reference; for an agency whose product is originality, that resemblance is a reputational risk.</li>
          <li><b className="text-white">It suits the buyers you market to.</b> Navy and cyan signal trust, architecture and technology. Red is the colour of offers and urgency in property advertising.</li>
          <li><b className="text-white">It is the more accessible system.</b> Accent on dark scores 9.5:1. Red needs three shades to stay compliant across grounds.</li>
        </ol>
        <p className="mt-10 max-w-[70ch] text-[0.9375rem] leading-[1.7] text-[#aab8c4]">
          Keep Option 1&apos;s best idea: the bold, full-bleed closing band. It can be carried into Midnight Electric in cyan if you want more energy. Nothing is applied until
          you choose; the approved baseline remains live.
        </p>
      </div>
    </section>
  );
}
