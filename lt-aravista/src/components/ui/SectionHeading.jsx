export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  subtitlePlacement = 'afterRule',
  light = false,
  align = 'center',
}) {
  const center = align === 'center';
  const sub = subtitle ? (
    <p
      className={`max-w-2xl font-body text-[15px] leading-7 sm:text-lg sm:leading-8 ${center ? 'mx-auto' : ''} ${light ? 'text-white/90' : 'text-brand'}`}
    >
      {subtitle}
    </p>
  ) : null;
  return (
    <div className={center ? 'text-center' : 'text-left'}>
      <p
        className={`font-sans text-[11px] font-medium tracking-[0.3em] uppercase sm:text-xs ${light ? 'text-champagne/80' : 'text-bronze'}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-serif text-[2rem] leading-[1.1] font-semibold sm:text-[2.5rem] md:text-5xl ${light ? 'text-white' : 'text-brand'}`}
      >
        {title}
      </h2>
      {subtitlePlacement === 'afterTitle' && sub ? <div className="mt-3">{sub}</div> : null}
      <div className={`mt-5 flex items-center gap-2 ${center ? 'justify-center' : ''}`} aria-hidden="true">
        <span className={`h-px w-16 ${light ? 'bg-champagne/50' : 'bg-brand/30'}`} />
      </div>
      {subtitlePlacement === 'afterRule' && sub ? <div className="mt-5">{sub}</div> : null}
    </div>
  );
}
