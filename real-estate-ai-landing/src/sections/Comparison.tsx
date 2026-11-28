import { useState } from 'react';
import { Check, Minus, Settings2, User, Wrench } from 'lucide-react';
import { comparison } from '../data/content';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/ui/Reveal';
import { LogoMark } from '../components/ui/Logo';

/** Maps each cell value to an icon + tone so status reads at a glance (and not by color alone). */
function cell(v: string, ours: boolean) {
  const supported = ['Supported by design', 'Planned integrations'].includes(v);
  const config = ['Configurable', 'Infrastructure dependent', 'Possible'].includes(v);
  const human = ['Staff dependent', 'Human conversations', 'Manual'].includes(v);
  const Icon = supported ? Check : config ? Settings2 : human ? User : v === 'Limited' ? Minus : Wrench;
  const tone = supported && ours ? 'bg-[var(--brand-solid)] text-white' : supported ? 'bg-emerald-100 text-emerald-700' : config ? 'bg-sky-100 text-sky-700' : human ? 'bg-zinc-100 text-zinc-600' : 'bg-amber-50 text-amber-700';
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid h-6 w-6 flex-none place-items-center rounded-full ${tone}`} aria-hidden="true"><Icon size={13} strokeWidth={2.6} /></span>
      <span className={`text-[14px] ${ours ? 'font-medium text-[var(--c-head)]' : 'text-[var(--c-text)]'}`}>{v}</span>
    </span>
  );
}

export function Comparison() {
  const [vs, setVs] = useState(1);
  return (
    <Section id="compare" theme="light" label="Feature comparison">
      <div className="container-x section-y">
        <SectionHeader eyebrow={comparison.eyebrow} title={comparison.title} description={comparison.description} />
        <Reveal className="mx-auto mt-12 max-w-[640px] lg:hidden" variant="up">
          {/* Mobile: our platform vs one alternative at a time — no clipped horizontal table */}
          <div className="mx-auto flex w-full max-w-[360px] rounded-full border border-[var(--c-line)] bg-white p-1 shadow-[0_6px_20px_-12px_rgba(13,20,36,.25)]" role="tablist" aria-label="Compare with">
            {comparison.columns.slice(1).map((c, i) => (
              <button key={c} type="button" role="tab" aria-selected={vs === i + 1} data-testid={`compare-vs-${i + 1}`} onClick={() => setVs(i + 1)}
                className={`flex-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${vs === i + 1 ? 'bg-[var(--c-head)] text-white' : 'text-[var(--c-text)]'}`}>vs {c}</button>
            ))}
          </div>
          <div className="card mt-4 overflow-hidden" data-testid="comparison-mobile">
            <div className="grid grid-cols-[1fr_1fr] border-b border-[var(--c-line)] text-[12px] font-semibold">
              <span className="flex items-center gap-2 bg-[#f6f2ff] px-3 py-3 text-[var(--c-head)]"><LogoMark size={20} />Our planned platform</span>
              <span className="flex items-center gap-2 px-3 py-3 text-[var(--c-text)]">{vs === 1 ? <User size={14} /> : <Settings2 size={14} />}{comparison.columns[vs]}</span>
            </div>
            <ul>
              {comparison.rows.map((r, ri) => (
                <li key={r[0] + vs} className={ri ? 'border-t border-[var(--c-line)]' : ''} style={{ animation: `rise .35s ${ri * 35}ms var(--ease-out) both` }}>
                  <p className="px-3 pt-3 text-[13.5px] font-semibold text-[var(--c-head)]">{r[0]}</p>
                  <div className="grid grid-cols-2 gap-2 px-3 pb-3 pt-2 [&_span]:!text-[12.5px]">
                    <div className="rounded-lg bg-[#f6f2ff] px-2 py-1.5">{cell(r[1], true)}</div>
                    <div className="rounded-lg bg-[#f7f8fb] px-2 py-1.5">{cell(r[1 + vs], false)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal className="mt-14 hidden lg:block" variant="tilt">
          <div className="card relative overflow-hidden">
            <div className="thin-scroll overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table, scroll horizontally on small screens">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left" data-testid="comparison-table">
                <caption className="sr-only">Comparison of the planned AI platform with a manual sales team and a basic IVR system</caption>
                <thead>
                  <tr>
                    <th scope="col" className="sticky left-0 z-[2] w-[26%] border-b border-[var(--c-line)] bg-white px-5 py-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--c-muted)]">Features</th>
                    {comparison.columns.map((c, i) => (
                      <th key={c} scope="col" className={`border-b px-5 py-5 text-[15px] font-semibold ${i === 0 ? 'relative border-brand/30 bg-[#f6f2ff] text-[var(--c-head)]' : 'border-[var(--c-line)] text-[var(--c-head)]'}`}>
                        {i === 0 ? <span className="flex items-center gap-2.5"><LogoMark size={24} />{c}</span> : <span className="flex items-center gap-2 text-[var(--c-text)]">{i === 1 ? <User size={16} /> : <Settings2 size={16} />}{c}</span>}
                        {i === 0 && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#7c3aed] to-[#c4b5fd]" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((r, ri) => (
                    <tr key={r[0]} className="group cmp-row" style={{ animationDelay: `${ri * 50}ms` }}>
                      <th scope="row" className={`sticky left-0 z-[1] bg-white px-5 py-4 text-[14.5px] font-medium text-[var(--c-head)] transition-colors group-hover:bg-[#fafafa] ${ri < comparison.rows.length - 1 ? 'border-b border-[var(--c-line)]' : ''}`}>{r[0]}</th>
                      {r.slice(1).map((v, i) => (
                        <td key={i} className={`px-5 py-4 transition-colors ${i === 0 ? 'bg-[#f6f2ff] group-hover:bg-[#f1ebff]' : 'group-hover:bg-[#fafafa]'} ${ri < comparison.rows.length - 1 ? (i === 0 ? 'border-b border-brand/15' : 'border-b border-[var(--c-line)]') : ''}`}>{cell(v, i === 0)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--c-muted)]">
            <span className="flex items-center gap-1.5"><Check size={13} className="text-emerald-600" />Supported or planned</span>
            <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-sky-600" />Depends on configuration</span>
            <span className="flex items-center gap-1.5"><User size={13} />Depends on people</span>
            <span className="flex items-center gap-1.5"><Minus size={13} className="text-amber-600" />Limited</span>
          </div>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-[12.5px] text-[var(--c-muted)]">This comparison describes intended capabilities by design. It is not a performance or cost claim.</p>
      </div>
    </Section>
  );
}
