import { IconArrowRight } from './Icons';

const BASE =
  'btn-shine group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-sans text-[13px] leading-none font-medium tracking-[0.14em] uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60';
const LUXURY = 'btn-luxury';
const VARIANTS = {
  primary: LUXURY,
  outline:
    'border border-brand/40 bg-white/70 text-brand backdrop-blur-sm hover:border-brand hover:bg-brand hover:text-white',
  ghost: 'border border-white/30 bg-white/10 text-white backdrop-blur-md hover:border-champagne hover:bg-white/20',
  inverse: LUXURY,
  whatsapp: 'bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.3)] hover:bg-[#1da851]',
  header: LUXURY,
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  showArrow = false,
  className = '',
  children,
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : 'w-fit'} ${className}`;
  const content = (
    <>
      {children}
      {showArrow ? (
        <IconArrowRight className="text-sm transition-transform group-hover:translate-x-1" aria-hidden="true" />
      ) : null}
    </>
  );
  if (props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  const { type = 'button', ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
