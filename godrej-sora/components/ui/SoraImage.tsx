import Image from 'next/image';
import type { ResolvedAsset } from '@/lib/assets.server';
import { SunRays } from './motifs';

type Props = {
  asset: ResolvedAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** render a small disclosure caption under the image */
  caption?: boolean;
  fill?: boolean;
};

/** Renders an approved project image, or a branded placeholder when the file has not been supplied.
 *  It never substitutes an image of another project. */
export function SoraImage({ asset, className = '', sizes = '100vw', priority, caption, fill = true }: Props) {
  const style = asset.focal ? { objectPosition: asset.focal } : undefined;
  return (
    <figure className={`relative overflow-hidden bg-washi ${className}`}>
      {asset.src ? (
        fill ? (
          <Image src={asset.src} alt={asset.alt} fill sizes={sizes} priority={priority} className="object-cover" style={style} />
        ) : (
          <Image src={asset.src} alt={asset.alt} width={asset.width ?? 1600} height={asset.height ?? 1000} sizes={sizes} priority={priority} className="h-auto w-full" />
        )
      ) : (
        <Placeholder asset={asset} />
      )}
      {caption && (
        <figcaption className="pointer-events-none absolute bottom-0 left-0 z-10 m-3 rounded-full bg-ink/55 px-3 py-1 text-[0.62rem] tracking-[0.12em] text-ivory uppercase backdrop-blur-sm">
          {asset.kindLabel}
        </figcaption>
      )}
    </figure>
  );
}

function Placeholder({ asset }: { asset: ResolvedAsset }) {
  return (
    <div className="absolute inset-0 washi grain @container" role="img" aria-label={`${asset.title} (official artwork pending approval)`}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <SunRays className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-gold @[24rem]:h-20 @[24rem]:w-20" />
      <div className="absolute bottom-3 right-3 z-10 max-w-[60%] text-right">
        <p className="text-[0.56rem] tracking-[0.22em] uppercase text-ink-mute">{asset.title}</p>
        <p className="mt-1 hidden text-[0.62rem] leading-snug text-ink-mute/80 @[18rem]:block">Official artwork pending approval — {asset.source}</p>
      </div>
    </div>
  );
}
