import Link from "next/link";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";
import { Kicker, Magnetic, MaskLines } from "@/components/home/fx";

/** Closing call to action: brand-colour glow, large type, a magnetic "Let's talk" disc and a slow band of the eight services. */
export function FinalCta() {
  return (
    <section id="start" className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="cta-title">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_78%_40%,#142e8c_0%,rgb(20_46_140/0.35)_45%,transparent_75%),radial-gradient(ellipse_50%_45%_at_10%_100%,rgb(29_78_216/0.35)_0%,transparent_70%)]" />
      <div className="container-x mx-auto flex min-h-[80svh] max-w-[120rem] flex-col justify-center py-[var(--section-y)]">
        <Kicker>Start a project</Kicker>
        <MaskLines
          id="cta-title"
          lines={[["Ready", "to", "lead"], ["your", "market?"]]}
          accent={["market?"]}
          accentClassName="text-sky"
          className="mt-8 h-display"
          lineClassName={["", "lg:pl-[12vw]"]}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-3">
            <Magnetic strength={0.4}>
              <Link
                href="/contact-us/"
                className="group grid h-40 w-40 place-items-center rounded-full bg-blue text-center text-[1.125rem] font-semibold tracking-[-0.01em] text-on-accent transition-[background-color,color,transform] duration-500 ease-out-expo hover:scale-105 hover:bg-white hover:text-ink md:h-48 md:w-48"
              >
                <span className="flex flex-col items-center gap-2">
                  <Arrow className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
                  Let&apos;s talk
                </span>
              </Link>
            </Magnetic>
          </div>
          <p className="max-w-[40ch] text-[clamp(1.25rem,1rem+0.7vw,1.75rem)] leading-[1.4] text-white/85 lg:col-span-5">
            Tell us about your project. We&apos;ll come back with a clear plan for branding, launch and lead generation.
          </p>
          <ul className="grid gap-3 text-[1.0625rem] lg:col-span-4 lg:justify-self-end" role="list">
            <li><a href={`mailto:${site.email}`} className="link-u text-white">{site.email}</a></li>
            {site.phones.filter((p) => p.label === "Sales").map((p) => (
              <li key={p.href}><a href={p.href} className="link-u text-white/80 hover:text-white">{p.number}</a></li>
            ))}
            <li className="text-white/50">{site.address.locality} · {site.offices.join(" · ")}</li>
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="overflow-hidden border-t border-white/10 py-6">
        <div className="cta-band flex w-max gap-12 whitespace-nowrap text-[clamp(1.75rem,1rem+2vw,3rem)] font-semibold tracking-[-0.03em] text-white/20">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-12">
              {services.map((x) => (
                <span key={x.slug} className="flex items-center gap-12">{x.title}<span className="text-blue">●</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .cta-band { animation: cta-band 60s linear infinite; }
        @keyframes cta-band { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .cta-band { animation: none; } }
      `}</style>
    </section>
  );
}
