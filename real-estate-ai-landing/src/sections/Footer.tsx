import { Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { brand } from '../config/brand';
import { footer } from '../data/content';
import { Logo } from '../components/ui/Logo';
import { useApp } from '../components/ui/AppContext';

export function Footer({ onLegal }: { onLegal: (k: 'privacy' | 'terms') => void }) {
  const { openDemo } = useApp();
  const socials = [
    { k: 'linkedin', I: Linkedin, l: 'LinkedIn' }, { k: 'x', I: Twitter, l: 'X' }, { k: 'instagram', I: Instagram, l: 'Instagram' }, { k: 'youtube', I: Youtube, l: 'YouTube' },
  ].filter((s) => brand.social[s.k as keyof typeof brand.social]);

  const click = (href: string, tab?: string) => (e: React.MouseEvent) => {
    if (href === '#demo') { e.preventDefault(); openDemo(); }
    if (href === '#privacy' || href === '#terms') { e.preventDefault(); onLegal(href === '#privacy' ? 'privacy' : 'terms'); }
    if (tab) window.dispatchEvent(new CustomEvent('usecase:select', { detail: tab }));
  };

  return (
    <footer className="theme-dark relative" data-testid="footer">
      <div className="container-x"><div className="divider-orb" aria-hidden="true" /></div>
      <div className="container-x grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-[300px] text-[14.5px] leading-relaxed">{brand.shortDescription}</p>
          {(brand.contactEmail || brand.contactPhone) && (
            <div className="mt-5 space-y-2 text-[14px]">
              {brand.contactEmail && <a className="flex items-center gap-2 hover:text-white" href={`mailto:${brand.contactEmail}`}><Mail size={15} />{brand.contactEmail}</a>}
              {brand.contactPhone && <a className="flex items-center gap-2 hover:text-white" href={`tel:${brand.contactPhone}`}><Phone size={15} />{brand.contactPhone}</a>}
            </div>
          )}
        </div>
        {footer.columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-[13px] font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => <li key={l.label}><a href={l.href} onClick={click(l.href, 'tab' in l ? (l as { tab?: string }).tab : undefined)} className="text-[14.5px] text-white/55 transition hover:text-white">{l.label}</a></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-[13px] text-white/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {brand.companyName}. All rights reserved. Product preview; features described as planned are not yet generally available.</p>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map(({ k, I, l }) => <a key={k} href={brand.social[k as keyof typeof brand.social]} target="_blank" rel="noopener noreferrer" aria-label={l} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-[var(--brand-primary)] hover:text-white"><I size={15} /></a>)}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
