import { SITE } from '../../config/site';
import { useEnquiry } from '../../context/useEnquiry';
import { IconPhone, IconWhatsApp } from '../ui/Icons';

export function MobileActionBar() {
  const { openEnquiry } = useEnquiry();
  const item = 'flex min-h-[52px] items-center justify-center gap-1.5 font-sans text-[12px] font-medium tracking-[0.08em] uppercase';
  return (
    <nav aria-label="Quick contact" className="pb-safe fixed inset-x-0 bottom-0 z-80 grid grid-cols-3 border-t border-champagne/25 bg-brand md:hidden">
      <a href={SITE.phoneTel} className={`${item} border-r border-white/10 text-ivory`}>
        <IconPhone className="text-sm" aria-hidden="true" /> Call
      </a>
      <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${item} border-r border-white/10 text-ivory`}>
        <IconWhatsApp className="text-base" aria-hidden="true" /> WhatsApp
      </a>
      <button type="button" onClick={() => openEnquiry('Enquire Now')} className={`${item} bg-champagne text-ink`}>
        Enquire Now
      </button>
    </nav>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float fixed right-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-90 hidden h-12 w-12 md:flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105 md:right-8 md:bottom-8 md:h-14 md:w-14"
    >
      <span className="whatsapp-float-ping" aria-hidden="true" />
      <span className="whatsapp-float-ping whatsapp-float-ping-delay" aria-hidden="true" />
      <IconWhatsApp className="relative z-10 text-[1.45rem] md:text-3xl" />
    </a>
  );
}

export function SiteVisitTab() {
  const { openEnquiry } = useEnquiry();
  return (
    <button
      type="button"
      onClick={() => openEnquiry('Schedule a Site Visit')}
      className="btn-luxury fixed top-1/2 right-0 z-50 hidden -translate-y-1/2 cursor-pointer rounded-l-xl px-3 py-6 font-sans text-xs font-medium leading-none tracking-[0.2em] text-white uppercase [writing-mode:vertical-rl] md:inline-flex"
    >
      Schedule a Site Visit
    </button>
  );
}
