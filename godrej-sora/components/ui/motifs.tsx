/** Original SVG motifs in the Sora design language (sun rays, blossom, torii lines).
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
