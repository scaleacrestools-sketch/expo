import { ArrowRight } from './Icons.jsx';

/**
 * variant: primary (burgundy) | secondary (gold) | outline (burgundy line) | outline-light (on dark)
 */
export default function Button({
  as,
  href,
  variant = 'primary',
  arrow = true,
  size,
  className = '',
  children,
  ...rest
}) {
  const Tag = as || (href ? 'a' : 'button');
  const classes = ['btn', `btn--${variant}`, size ? `btn--${size}` : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={classes} href={href} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowRight className="btn__arrow" width={16} height={16} />}
    </Tag>
  );
}
