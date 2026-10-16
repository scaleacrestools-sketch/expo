import { clients } from "@/content/clients";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ClientLogoShowcase() {
  // Only approved logo files are shown. Until they exist the section is omitted (see docs/launch-readiness.md).
  const withLogos = clients.filter((c) => c.logo);
  if (withLogos.length < 3) return null;
  // Repeat the set so the marquee track is long enough to loop seamlessly.
  const loop = [...clients, ...clients, ...clients];
  return (
    <Reveal as="section" id="clients" className="section-y bg-offwhite text-ink">
      <div className="container-x mx-auto max-w-[110rem]">
        <SectionHeading
          tone="light"
          eyebrow="The brands behind the work"
          title={<>Brands that trust<br />our work.</>}
          description="We've had the opportunity to collaborate with ambitious brands and businesses to bring meaningful digital experiences and creative ideas to life."
        />
      </div>

      {/* Desktop: slow marquee (pauses on hover/focus). Mobile: grid. */}
      <div className="mt-16 hidden md:block" data-reveal>
        <div className="marquee border-y border-ink/10 py-10" style={{ "--marquee-duration": `${clients.length * 9}s` } as React.CSSProperties}>
          <ul className="marquee__track items-center" role="list" aria-label="Client logos">
            {loop.map((c, i) => (
              <li key={`${c.name}-${i}`} aria-hidden={i >= clients.length} className="shrink-0">
                <ClientMark name={c.name} logo={c.logo} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="container-x mt-12 grid grid-cols-2 gap-px bg-ink/10 md:hidden" role="list" aria-label="Client logos" data-reveal>
        {clients.map((c) => (
          <li key={c.name} className="grid place-items-center bg-offwhite px-4 py-10">
            <ClientMark name={c.name} logo={c.logo} />
          </li>
        ))}
      </ul>
      <p className="container-x mx-auto mt-6 max-w-[110rem] text-xs text-ink/50">
        Logos shown as monochrome wordmarks until approved logo files are added. Client names are as published on scaleacres.com.
      </p>
    </Reveal>
  );
}

function ClientMark({ name, logo }: { name: string; logo?: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={name} className="h-9 w-auto opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100" loading="lazy" />;
  }
  return (
    <span
      className="text-balance text-center text-[clamp(1.0625rem,1.6vw,1.75rem)] font-bold uppercase leading-tight tracking-[0.06em] text-ink/55 transition-colors duration-500 hover:text-ink md:whitespace-nowrap"
      title={name}
    >
      {name}
    </span>
  );
}
