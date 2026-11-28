import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { faq } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { useApp } from '../components/ui/AppContext';

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { openDemo } = useApp();
  return (
    <Section id="faq" theme="dark" label="Frequently asked questions">
      <div className="container-x section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeader align="left" eyebrow={faq.eyebrow} title={faq.title} />
            <Reveal delay={0.1} className="mt-8 hidden rounded-2xl border border-[var(--c-line)] bg-white/[0.02] p-5 lg:block">
              <p className="text-[15px] font-medium text-white">Have a different question?</p>
              <p className="mt-1 text-[14px]">Book a walkthrough and we will answer it against your own sales workflow.</p>
              <button onClick={openDemo} className="btn btn-secondary mt-4">Book a Demo</button>
            </Reveal>
          </div>
          <Reveal>
            <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]" data-testid="faq">
              {faq.items.map((f, i) => {
                const on = open === i;
                return (
                  <li key={f.q}>
                    <h3>
                      <button type="button" id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? null : i)} data-testid={`faq-q-${i}`}
                        className="group flex w-full items-center justify-between gap-6 py-5 text-left">
                        <span className={`text-[17px] font-medium tracking-[-0.02em] transition-colors sm:text-[18px] ${on ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{f.q}</span>
                        <span className={`grid h-9 w-9 flex-none place-items-center rounded-full border transition-all duration-300 ${on ? 'rotate-45 border-[var(--brand-primary)] bg-[var(--brand-solid)] text-white' : 'border-white/15 text-white/70 group-hover:border-white/30'}`} aria-hidden="true"><Plus size={16} /></span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <p className="max-w-[640px] pb-6 pr-12 text-[15.5px] leading-relaxed">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
