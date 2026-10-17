import Link from "next/link";
import { services, serviceHref } from "@/content/services";
import { getProject } from "@/content/projects";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

/** Illustrative only — the stages a typical engagement moves through, not a real conversation. */
const FLOW = [
  { when: "Week 1", who: "you", text: "Here's the project, the audience and the launch date." },
  { when: "Week 1", who: "us", text: "Discovery call booked. We'll come back with a strategy and media plan." },
  { when: "Week 2", who: "us", text: "Plan approved. Brand assets, landing page and ad creatives in production." },
  { when: "Week 4", who: "us", text: "Campaign live. Tracking and lead routing tested end to end." },
  { when: "Every week", who: "us", text: "Report shared. Budgets and creatives refined against cost per lead." },
] as const;

/**
 * Section 07 — the ScaleAcres advantage. Asymmetric bento: principle, capabilities,
 * an illustrative delivery flow, and published case-study outcomes (no invented metrics).
 */
export function AdvantageBento() {
  const impact = ["yugen-goa", "one-goa"].map((s) => getProject(s)!).filter(Boolean);
  return (
    <Reveal as="section" id="advantage" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue" data-reveal>The ScaleAcres advantage</p>
            <h2 className="h2 mt-6" data-split-reveal>
              The thinking
              <br />
              <span className="text-blue">behind the work.</span>
            </h2>
          </div>
          <p className="text-[length:var(--fs-lead)] leading-[1.55] text-graphite lg:col-span-5" data-reveal>
            Built to stand out. Designed to scale. Here is how that promise turns into the way we plan, make and deliver.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {/* A — principle */}
          <article className="on-dark relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[18px] bg-ink p-8 text-white md:p-12 lg:col-span-7" data-reveal>
            <p className="label text-grey">(How we think)</p>
            <div className="relative z-[1] max-w-[30rem]">
              <h3 className="text-[clamp(2rem,1rem+2.6vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">
                Creative thinking.
                <br />
                <span className="text-blue">Systematic execution.</span>
              </h3>
              <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-[1.65] text-grey-soft">
                Ideas people remember, delivered through process, data and automation, so results can be repeated and scaled. Scaling with System and Automation.
              </p>
            </div>
            <div aria-hidden="true" className="absolute bottom-0 right-8 hidden h-[72%] w-[38%] items-end gap-[6%] md:right-12 md:flex">
              {[24, 42, 60, 80, 100].map((h) => (
                <span key={h} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%`, background: "var(--grad-rise)", opacity: 0.92 }} />
              ))}
            </div>
          </article>

          {/* B — capabilities */}
          <article className="flex flex-col justify-between gap-10 rounded-[18px] border border-line bg-white p-8 md:p-12 lg:col-span-5" data-reveal>
            <p className="label text-steel">(Full funnel)</p>
            <div>
              <h3 className="text-[clamp(1.75rem,1rem+1.6vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
                One partner.
                <br />
                Multiple possibilities.
              </h3>
              <p className="mt-5 max-w-[44ch] text-[1rem] leading-[1.65] text-steel">
                Branding, development, marketing and production under one roof, planned together and measured against the same goals.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2" role="list">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={serviceHref(s)} className="inline-flex rounded-full border border-line px-3.5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-graphite transition-colors hover:border-blue hover:text-blue">
                      {s.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/our-services/" className="group inline-flex w-fit items-center gap-3 rounded-full bg-blue px-6 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-deep">
              View services <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </article>

          {/* C — brief to delivery (illustrative) */}
          <article className="on-dark relative overflow-hidden rounded-[18px] bg-navy p-8 text-white md:p-10 lg:col-span-5" data-reveal>
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.22),transparent)]" />
            <div className="relative flex items-center justify-between gap-4">
              <h3 className="text-[1.375rem] font-bold">From brief to delivery</h3>
              <p className="label text-grey">(Illustrative)</p>
            </div>
            <ol className="relative mt-7 grid gap-3" role="list" aria-label="How a typical project moves, illustrative">
              {FLOW.map((f, i) => (
                <li key={i} className={`flex flex-col ${f.who === "us" ? "items-end" : "items-start"}`}>
                  <span className="mb-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-grey">{f.when}</span>
                  <span className={`max-w-[85%] rounded-[14px] px-4 py-2.5 text-[0.9375rem] leading-snug ${f.who === "us" ? "rounded-br-[4px] bg-blue text-white" : "rounded-bl-[4px] bg-white text-ink"}`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ol>
          </article>

          {/* D — real impact */}
          <article className="flex flex-col gap-8 rounded-[18px] border border-line bg-white p-8 md:p-12 lg:col-span-7" data-reveal>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[clamp(1.75rem,1rem+1.6vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">Real impact.</h3>
              <p className="label text-steel">(Published case studies)</p>
            </div>
            <ul className="grid gap-0 border-t border-line" role="list">
              {impact.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link href={`/case-studies/${p.slug}/`} className="group grid gap-3 py-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-center md:gap-8">
                    <span>
                      <span className="block text-[1.5rem] font-extrabold uppercase tracking-[-0.02em] transition-colors group-hover:text-blue">{p.title}</span>
                      <span className="label text-blue">{p.location}</span>
                    </span>
                    <span className="text-[1rem] leading-[1.6] text-graphite">{p.summary}</span>
                    <span className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink group-hover:text-blue">
                      Case study <Arrow className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[0.8125rem] text-steel">Outcomes are described as published on scaleacres.com. Figures appear only once each client approves them.</p>
          </article>
        </div>
      </div>
    </Reveal>
  );
}
