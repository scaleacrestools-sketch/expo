'use client';
import { site, telLink, whatsappLink } from '@/content/site';
import { useLeadDrawer } from './forms/LeadDrawerContext';
import { track } from '@/lib/analytics';

/** Compact sticky action bar for phones. */
export function MobileBar() {
  const { open } = useLeadDrawer();
  const wa = whatsappLink('Hello, I would like to know more about Godrej Sora, Sector 53.');
  const tel = telLink();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t border-sand bg-ivory/95 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <button className="flex h-14 items-center justify-center text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-ivory bg-sora-red" onClick={() => { track('cta_click', { magnet: 'priceSheet', source: 'mobile-bar' }); open('priceSheet', 'mobile-bar'); }}>Get Price</button>
      {wa ? (
        <a href={wa} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { source: 'mobile-bar' })} className="flex h-14 items-center justify-center text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-ink">WhatsApp</a>
      ) : tel ? (
        <a href={tel} onClick={() => track('call_click', { source: 'mobile-bar' })} className="flex h-14 items-center justify-center text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-ink">Call</a>
      ) : (
        <button className="flex h-14 items-center justify-center text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-ink" onClick={() => open('enquiry', 'mobile-bar')}>{site.contact.phone ? 'Call' : 'Enquire'}</button>
      )}
    </div>
  );
}
