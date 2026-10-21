import Image from 'next/image';
import { SunRays } from './ui/motifs';

/** Uses the official logo when supplied as a vector (brand/godrej-sora-logo.svg); raster brochure crops are artwork, not a logo, so the typeset wordmark is used otherwise. */
export function Wordmark({ logoSrc, light = false, size = 'sm' }: { logoSrc: string | null; light?: boolean; size?: 'sm' | 'lg' }) {
  if (logoSrc && logoSrc.endsWith('.svg')) {
    return <Image src={logoSrc} alt="Godrej Sora" width={size === 'lg' ? 220 : 140} height={size === 'lg' ? 64 : 40} className={`h-auto ${size === 'lg' ? 'w-56' : 'w-32 md:w-36'} ${light ? 'brightness-0 invert' : ''}`} priority />;
  }
  return (
    <span className={`flex items-center gap-3 ${light ? 'text-ivory' : 'text-ink'}`}>
      <SunRays className={`${size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'} ${light ? 'text-gold' : 'text-sora-red'}`} />
      <span className="flex flex-col leading-none">
        <span className={`${size === 'lg' ? 'text-[0.7rem]' : 'text-[0.55rem]'} tracking-[0.34em] uppercase opacity-80`}>Godrej</span>
        <span className={`${size === 'lg' ? 'text-2xl' : 'text-lg'} font-light tracking-[0.42em] uppercase`}>Sora</span>
      </span>
    </span>
  );
}
