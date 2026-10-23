import { processSteps } from "@/content/process";
import { Kicker, MaskLines } from "@/components/home/fx";

/**
 * How we work — four steps as oversized editorial rows. On hover a Royal band sweeps in
 * from the left behind the row (CSS only).
 */
export function HowWeWork2() {
  return (
    <section id="how-we-work" className="relative bg-ink text-white" aria-labelledby="process-title">
      <div className="container-x mx-auto max-w-[120rem] py-[var(--section-y)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Kicker>Process</Kicker>
            <div className="relative mt-6 inline-block">
              <MaskLines
                id="process-title"
                lines={[["How", "we"], ["work."]]}
                className=" h-display"
                lineClassName={["", "lg:pl-[12vw]"]}
              />
              <span aria-hidden="true" className="absolute -right-10 top-2 text-[clamp(1rem,1.6vw,1.75rem)] font-medium text-sky md:-right-16">(04)</span>
            </div>
          </div>
          <p className="text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] text-grey-soft lg:col-span-4 lg:pb-5">
            A clear, collaborative way of working, from the first conversation to continuous growth.
          </p>
        </div>

        <ol className="mt-[clamp(3rem,6vw,6rem)] border-b border-white/15" role="list">
          {processSteps.map((s) => (
            <li key={s.number} className="hw-row group relative isolate grid gap-3 overflow-hidden border-t border-white/15 py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10">
              <span className="text-[1rem] tabular-nums text-sky transition-colors duration-500 group-hover:text-white md:col-span-1">{s.number}</span>
              <h3 className="text-[clamp(2.5rem,1.4rem+4.6vw,6.25rem)] font-semibold leading-[0.95] tracking-[-0.05em] transition-transform duration-700 ease-out-expo group-hover:translate-x-4 md:col-span-6">
                {s.title}
              </h3>
              <p className="max-w-[40ch] text-[1.0625rem] leading-[1.6] text-grey-soft transition-colors duration-500 group-hover:text-white md:col-span-5">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .hw-row::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--color-blue); transform: scaleX(0); transform-origin: left; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); margin-inline: calc(var(--gutter) * -1); }
        @media (hover: hover) { .hw-row:hover::before { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .hw-row::before { transition: none; } }
      `}</style>
    </section>
  );
}
