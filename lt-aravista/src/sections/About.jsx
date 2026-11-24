import SectionHeading from '../components/ui/SectionHeading';

const STATS = [
  { value: '65.5 Mn', unit: 'Sq. Ft.', label: 'Residential development' },
  { value: '32.5 Mn', unit: 'Sq. Ft.', label: 'Commercial & retail development' },
  { value: '16,000+', unit: 'Families', label: 'Happy families' },
  { value: '20+', unit: 'Communities', label: 'Mixed-use & gated communities' },
];

const PARTNERS = [
  ['Architecture', 'Hafeez Contractor'],
  ['Structure', 'Thornton Tomasetti'],
  ['MEP', 'AECOM'],
  ['Interiors', 'Bobby Mukherji Architects'],
  ['Landscape', 'WATG'],
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-sand py-20 sm:py-24 md:py-28">
      <span
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[9rem] leading-none font-bold whitespace-nowrap text-brand/[0.04] select-none sm:text-[16rem]"
        aria-hidden="true"
      >
        L&amp;T
      </span>
      <div className="relative container mx-auto max-w-5xl px-6 text-center md:px-10">
        <SectionHeading eyebrow="About L&T Realty" title="A Legacy of Trust and Engineering Excellence" />
        <div className="mt-10 rounded-xl bg-cream px-6 py-10 sm:px-12">
          <p className="mx-auto max-w-3xl font-body text-[15px] leading-8 text-brand sm:text-lg">
            Backed by Larsen &amp; Toubro&apos;s engineering legacy spanning more than eight decades, L&amp;T Realty brings its
            expertise in design, construction and development to premium residential, commercial and mixed-use communities
            across India.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="luxury-card px-3 py-6">
                <p className="gradient-text font-serif text-3xl font-bold sm:text-4xl">{s.value}</p>
                <p className="mt-1 font-sans text-[10px] font-medium tracking-[0.2em] text-ink uppercase">{s.unit}</p>
                <p className="mt-1 font-body text-xs leading-5 text-brand sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-brand/15 pt-8">
            <p className="font-sans text-[10px] font-medium tracking-[0.3em] text-bronze uppercase">Aravista design partners</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {PARTNERS.map(([role, name]) => (
                <li key={role} className="rounded-full bg-sand px-4 py-2 font-body text-sm text-brand">
                  <span className="text-bronze">{role}:</span> {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
