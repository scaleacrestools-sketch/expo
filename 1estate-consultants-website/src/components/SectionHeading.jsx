export default function SectionHeading({
  eyebrow,
  title,
  titleAs: TitleTag = 'h2',
  id,
  align = 'left',
  ornament = false,
  children,
  className = '',
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'section-heading--center' : ''} ${className}`.trim()} data-reveal>
      {ornament && <span className="ornament" aria-hidden="true" />}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <TitleTag className="section-heading__title" id={id}>
        {title}
      </TitleTag>
      {children && <p className="section-heading__body">{children}</p>}
    </div>
  );
}
