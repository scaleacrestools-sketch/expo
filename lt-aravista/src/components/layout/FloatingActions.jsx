import { SITE } from '../../config/site';
import { useEnquiry } from '../../context/useEnquiry';
import { IconWhatsApp } from '../ui/Icons';

export function MobileActionBar() {
  const { openEnquiry } = useEnquiry();
  return (
    <div className="fixed inset-x-0 bottom-0 z-80 grid grid-cols-3 border-t border-champagne/20 bg-brand md:hidden">
      <button
        type="button"
        onClick={() => openEnquiry('Enquire Now')}
        className="bg-champagne py-3.5 font-sans text-[11px] font-medium tracking-[0.14em] text-brand uppercase"
      >
        Enquire Now
      </button>
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-r border-white/10 py-3.5 text-center font-sans text-[11px] font-medium tracking-wide text-white uppercase"
      >
        WhatsApp
      </a>
      <a href={SITE.phoneTel} className="py-3.5 text-center font-sans text-[11px] font-medium tracking-wide text-white uppercase">
        Call Now
      </a>
    </div>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={SITE.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float fixed right-3 bottom-16 z-90 flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_rgba(37,211,102,0.4)] transition-transform duration-300 hover:scale-105 sm:right-8 sm:bottom-8 sm:h-14 sm:w-14"
    >
      <span className="whatsapp-float-ping" aria-hidden="true" />
      <span className="whatsapp-float-ping whatsapp-float-ping-delay" aria-hidden="true" />
      <IconWhatsApp className="relative z-10 text-[1.35rem] sm:text-3xl" />
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
