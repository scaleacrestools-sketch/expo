import Link from 'next/link';
import { project } from '@/content/project';
import { site } from '@/content/site';
import { Wordmark } from './Wordmark';
import { Blossom } from './ui/motifs';

export function Footer({ logoSrc }: { logoSrc: string | null }) {
  const adv = site.advertiser;
  return (
    <footer className="relative bg-ink text-ivory/80">
      <div className="container-sora grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-24">
        <div className="flex flex-col gap-6">
          <Wordmark logoSrc={logoSrc} light size="lg" />
          <p className="max-w-sm text-sm leading-relaxed text-ivory/60">{project.descriptor}. {project.address}. {project.locality}.</p>
          <Blossom className="h-8 w-8 text-sora-red/70" />
        </div>
        <div className="text-sm leading-loose">
          <p className="eyebrow mb-3 !text-gold">Sales enquiries</p>
          {site.contact.phone ? <a className="block hover:text-ivory" href={`tel:+${site.contact.phone}`}>+{site.contact.phone}</a> : <p className="text-ivory/50">Phone: to be configured</p>}
          {site.contact.email ? <a className="block hover:text-ivory" href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <p className="text-ivory/50">Email: to be configured</p>}
          <Link href="/privacy" className="mt-4 block underline underline-offset-4 hover:text-ivory">Privacy Policy</Link>
          <a href={project.officialUrl} target="_blank" rel="noopener" className="block underline underline-offset-4 hover:text-ivory">Official project page</a>
        </div>
        <div className="text-sm leading-loose">
          <p className="eyebrow mb-3 !text-gold">RERA</p>
          <p>Project registration: <span className="text-ivory">{project.rera.number}</span></p>
          <p>Dated {project.rera.date}</p>
          <p className="mt-2 text-ivory/60">{project.legal.plot}.</p>
          <p className="text-ivory/60">{project.rera.authority} — <a className="underline" href={project.rera.portal} target="_blank" rel="noopener">haryanarera.gov.in</a></p>
          {!adv.isDeveloper && (
            <p className="mt-4 text-ivory/60">
              {adv.name ? `Marketed by ${adv.name}, an authorised channel partner.` : 'Marketed by an authorised channel partner.'} {adv.rera && `Agent RERA: ${adv.rera}.`} This is not the official website of Godrej Properties Limited. The Godrej Sora name, logo and artwork belong to Godrej Properties Limited and are used with permission for marketing purposes.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-sora grid gap-3 py-8 text-[0.7rem] leading-relaxed text-ivory/45">
          <p>{project.disclaimers.imagery}</p>
          <p>*{project.legal.japanNote} {project.legal.landTitle}.</p>
          <p>{project.disclaimers.pricing}</p>
          <p>{project.disclaimers.general}</p>
          <p>© {new Date().getFullYear()} {adv.isDeveloper ? project.developer : adv.name || 'Advertiser'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
