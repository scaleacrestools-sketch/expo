import { trusted } from '../data/content';
import { Section } from '../components/ui/Section';
import { Icon } from '../components/ui/Icon';

export function TrustedBy() {
  const row = [...trusted.items, ...trusted.items];
  return (
    <Section id="trusted" theme="dark" className="pb-20 pt-4 sm:pb-24" label="Built for the real estate industry">
      <div className="container-x">
        <h2 className="text-center text-[14px] font-medium tracking-[-0.005em] text-white/55">{trusted.heading}</h2>
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" data-testid="marquee">
          <ul className="flex w-max gap-4 [animation:marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
            {row.map((t, i) => (
              <li key={i} aria-hidden={i >= trusted.items.length} className={`flex flex-none items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-[15px] font-medium tracking-[-0.02em] text-white/70 transition hover:border-brand/40 hover:text-white ${i >= trusted.items.length ? 'motion-reduce:hidden' : ''}`}>
                {t.logo ? <img src={t.logo} alt={t.name} className="h-6 w-auto" loading="lazy" /> : <><span className="grid h-8 w-8 place-items-center rounded-full bg-brand/15 text-[var(--brand-accent)]"><Icon name={t.icon} size={16} /></span>{t.name}</>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </Section>
  );
}
