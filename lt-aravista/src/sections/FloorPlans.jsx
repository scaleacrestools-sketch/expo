import { useState } from 'react';
import EnquiryButton from '../components/ui/EnquiryButton';
import Lightbox from '../components/ui/Lightbox';
import { IconPlus } from '../components/ui/Icons';
import SectionHeading from '../components/ui/SectionHeading';
import { IMAGES } from '../config/images';
import { RESIDENCES } from '../config/residences';

/**
 * Set to true to blur unit plans and show a "View Plan" enquiry button
 * instead (the previous lead-gated behaviour). The master plan always stays visible.
 */
const GATE_UNIT_PLANS = false;

const TABS = [
  {
    id: 'master',
    label: 'Master Plan',
    image: IMAGES.MasterPlan,
    alt: 'L&T Realty Aravista master layout showing Towers 1, 2 and 3, central greens and clubs',
  },
  ...RESIDENCES.map((r) => ({
    id: r.id,
    label: `${r.bhk} ${r.name}`,
    image: r.plan,
    alt: `L&T Realty Aravista ${r.bhk} ${r.name} unit plan`,
    residence: r,
  })),
];

export default function FloorPlans() {
  const [activeId, setActiveId] = useState('master');
  const [lightbox, setLightbox] = useState(null);
  const tab = TABS.find((t) => t.id === activeId) ?? TABS[0];
  const r = tab.residence;
  const gated = GATE_UNIT_PLANS && !!r;

  return (
    <section id="floor-plan" className="bg-cream py-16 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="Master Plan & Floor Plans"
          title="Your Canvas of Grandeur"
          subtitle="Explore the master layout and unit plans of L&T Realty Aravista. Towers 1 and 2 offer 3 BHK residences and Tower 3 offers 4 BHK residences."
        />
        <div className="mx-auto mt-10 max-w-3xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full gap-1 rounded-full bg-sand p-1.5 ring-1 ring-brand/10">
            {TABS.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={`flex-1 cursor-pointer rounded-full px-4 py-3 font-sans text-xs font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-all duration-300 sm:text-[13px] ${isActive ? 'btn-luxury text-white' : 'bg-transparent text-brand hover:text-brand'}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-sand p-3 ring-1 ring-brand/10 sm:p-5">
            <button
              type="button"
              disabled={gated}
              onClick={() => setLightbox({ src: tab.image, alt: tab.alt, title: tab.label })}
              aria-label={`Enlarge ${tab.label}`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white disabled:cursor-default"
            >
              <img
                key={tab.id}
                src={tab.image}
                alt={tab.alt}
                width={tab.id === 'master' ? 2208 : 2880}
                height={tab.id === 'master' ? 1800 : 1620}
                loading="lazy"
                decoding="async"
                className={`eloria-fade mx-auto h-auto w-full object-contain ${tab.id === 'master' ? 'max-h-[640px]' : 'max-h-120'} ${gated ? 'scale-105 blur-xs' : ''}`}
              />
            </button>
            <span className="glass-dark absolute bottom-6 left-6 rounded-full px-4 py-1.5 font-sans text-[10px] tracking-[0.2em] text-white uppercase sm:bottom-8 sm:left-8">
              {tab.label}
            </span>
            {!gated && (
              <span className="pointer-events-none absolute right-6 bottom-6 flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 font-sans text-[10px] tracking-[0.18em] text-white uppercase shadow-luxury sm:right-8 sm:bottom-8">
                <IconPlus className="text-xs" /> Click to zoom
              </span>
            )}
          </div>
          {gated && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <EnquiryButton title={`View ${tab.label} Plan`} className="pointer-events-auto animate-soft-glow">
                View Plan
              </EnquiryButton>
            </div>
          )}
        </div>

        {r ? (
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <dl className="grid grid-cols-3 overflow-hidden rounded-xl bg-sand text-center ring-1 ring-brand/10">
              {[
                ['Carpet Area', r.carpet],
                ['Balcony Area', r.balcony],
                ['Total Area', r.total],
              ].map(([label, value]) => (
                <div key={label} className="border-r border-brand/10 px-2 py-4 last:border-r-0">
                  <dt className="font-sans text-[10px] tracking-[0.2em] text-bronze uppercase">{label}</dt>
                  <dd className="mt-1 font-serif text-2xl font-semibold text-brand sm:text-3xl">{value}</dd>
                  <dd className="font-body text-[11px] text-bronze">Sq. Ft. approx.</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col items-center gap-3 sm:flex-row md:flex-col md:items-stretch">
              <button
                type="button"
                onClick={() => setLightbox({ src: r.typical.image, alt: r.typical.label, title: r.typical.label })}
                className="cursor-pointer rounded-xl border border-brand/30 px-5 py-3 font-sans text-xs font-medium tracking-[0.12em] text-brand uppercase transition-colors hover:bg-brand hover:text-white"
              >
                View {r.typical.short} Typical Floor
              </button>
              <EnquiryButton title={`Download ${tab.label} Floor Plan`}>Download Floor Plans</EnquiryButton>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['20 Acres', 'Land parcel'],
              ['9.5 Acres', 'Open space'],
              ['5 Acres', 'Central green'],
              ['3.6 Lakh Sq. Ft.', 'Amenity space'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-sand px-3 py-4 text-center ring-1 ring-brand/10">
                <p className="font-serif text-2xl font-semibold text-brand">{v}</p>
                <p className="mt-1 font-sans text-[10px] tracking-[0.2em] text-bronze uppercase">{l}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mx-auto mt-5 max-w-5xl text-center font-body text-xs text-bronze">
          Plans are indicative and taken from the official brochure. Tower 2 also has mirrored Majesta and Regalia variants.
        </p>
      </div>
      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
