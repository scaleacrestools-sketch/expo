import Link from "next/link";
import { clip } from "@/content/media";
import { posters } from "@/content/home";
import { site } from "@/content/site";
import { Arrow } from "@/components/ui/Arrow";
import { InViewVideo, Kicker, Magnetic, MaskLines } from "@/components/home/fx";

/** Closing call to action over the "Light sweep" concept film. */
export function FinalCta() {
  return (
    <section id="start" className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="cta-title">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <InViewVideo src={clip("finale").landscape} poster={posters.finale} className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--ink-rgb)/0.92)_0%,rgb(var(--ink-rgb)/0.55)_60%,rgb(var(--ink-rgb)/0.35))]" />
      </div>
      <div className="container-x mx-auto flex min-h-[92svh] max-w-[120rem] flex-col justify-center py-[var(--section-y)]">
        <Kicker>Start a project</Kicker>
        <MaskLines
          id="cta-title"
          lines={[["Ready", "to", "lead"], ["your", "market?"]]}
          accent={["market?"]}
          accentClassName="text-sky"
          className="mt-8 text-[clamp(3.5rem,15vw,7rem)] font-semibold leading-[0.88] tracking-[-0.055em] lg:text-[clamp(6rem,10.5vw,14rem)]"
          lineClassName={["", "lg:pl-[12vw]"]}
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-3">
            <Magnetic strength={0.4}>
              <Link
                href="/contact-us/"
                className="group grid h-40 w-40 place-items-center rounded-full bg-blue text-center text-[0.8125rem] font-semibold uppercase tracking-[0.18em] text-on-accent transition-[background-color,color,transform] duration-500 ease-out-expo hover:scale-105 hover:bg-white hover:text-ink md:h-48 md:w-48"
              >
                <span className="flex flex-col items-center gap-2">
                  <Arrow className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
                  Let&apos;s talk
                </span>
              </Link>
            </Magnetic>
          </div>
          <p className="max-w-[44ch] text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] text-grey-soft lg:col-span-5">
            Tell us about your project. We&apos;ll come back with a clear plan for branding, launch and lead generation.
          </p>
          <ul className="grid gap-3 text-[0.9375rem] lg:col-span-4 lg:justify-self-end" role="list">
            <li><a href={`mailto:${site.email}`} className="link-u text-white">{site.email}</a></li>
            {site.phones.filter((p) => p.label === "Sales").map((p) => (
              <li key={p.href}><a href={p.href} className="link-u text-white/80 hover:text-white">{p.number}</a></li>
            ))}
            <li className="text-white/50">{site.address.locality} · {site.offices.join(" · ")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
