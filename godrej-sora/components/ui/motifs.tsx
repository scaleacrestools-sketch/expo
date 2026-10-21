/** Original SVG motifs in the Sora design language (sun rays, blossom, torii lines, tiered roof).
 *  These are not reproductions of the official logo; the official artwork slots in via the asset manifest. */

export function SunRays({ className = '', rays = 8, color = 'currentColor', title }: { className?: string; rays?: number; color?: string; title?: string }) {
  const r = 100;
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
    return { x1: 120 + Math.cos(a) * 46, y1: 120 + Math.sin(a) * 46, x2: 120 + Math.cos(a) * r, y2: 120 + Math.sin(a) * r };
  });
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} fill="none">
      {title && <title>{title}</title>}
      <circle cx="120" cy="120" r="34" fill={color} />
      <circle cx="120" cy="120" r="40" stroke={color} strokeOpacity="0.35" />
      {lines.map((l, i) => (
        <line key={i} {...l} stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      ))}
      <circle cx="120" cy="120" r="108" stroke={color} strokeOpacity="0.18" strokeDasharray="2 6" />
    </svg>
  );
}

export function Blossom({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  const petals = Array.from({ length: 5 }, (_, i) => (i / 5) * 360);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill={color}>
      {petals.map((deg) => (
        <path key={deg} transform={`rotate(${deg} 50 50)`} d="M50 50 C 44 36, 40 24, 50 12 C 60 24, 56 36, 50 50 Z" opacity="0.9" />
      ))}
      <circle cx="50" cy="50" r="4" fill={color} opacity="0.6" />
    </svg>
  );
}

export function ToriiLines({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 140" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M20 30 Q200 10 380 30" />
      <path d="M50 58 H350" />
      <path d="M95 58 V135 M305 58 V135" />
      <path d="M90 30 V58 M310 30 V58" />
    </svg>
  );
}

/** Japanese tiered-roof silhouette, used in the Shiki Clubhouse section. */
export function TieredRoof({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M40 110 Q200 70 360 110" />
      <path d="M70 80 Q200 42 330 80" />
      <path d="M105 52 Q200 18 295 52" />
      <path d="M150 28 Q200 4 250 28" />
      <path d="M200 4 V110" strokeOpacity="0.35" />
    </svg>
  );
}

/** Horizon line with a rising sun — scroll-driven in the hero. */
export function Horizon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={className} aria-hidden="true" fill="none">
      <line x1="0" y1="100" x2="1200" y2="100" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="0" y1="108" x2="1200" y2="108" stroke="currentColor" strokeOpacity="0.12" />
    </svg>
  );
}
