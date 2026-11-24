import { sanitizePhone } from '../../lib/validation';

const PHONE_WRAP = {
  default:
    'rounded-xl border-brand/20 bg-cream text-brand placeholder:text-[13px] placeholder:text-umber/70 focus-within:border-bronze focus-within:bg-white focus-within:ring-4 focus-within:ring-bronze/10',
  overlay:
    'rounded-xl border-white/20 bg-white/8 text-white placeholder:text-[13px] placeholder:text-white/75 focus-within:border-champagne/80 focus-within:bg-white/12',
};
const INPUT = {
  default:
    'rounded-xl border-brand/20 bg-cream text-brand placeholder:text-[13px] placeholder:text-umber/70 focus:border-bronze focus:bg-white focus:ring-4 focus:ring-bronze/10',
  overlay:
    'rounded-xl border-white/20 bg-white/8 text-white placeholder:text-[13px] placeholder:text-white/75 focus:border-champagne/80 focus:bg-white/12',
};
const PREFIX = {
  default: 'border-r border-brand/20 text-brand',
  overlay: 'border-r border-white/20 text-white',
};
const ERROR_BORDER = {
  default: 'border-red-400 focus:border-red-400 focus-within:border-red-400',
  overlay: 'border-red-300 focus:border-red-300 focus-within:border-red-300',
};
const ERROR_TEXT = { default: 'text-red-500', overlay: 'text-red-200' };
const INPUT_BASE =
  'box-border h-12 w-full border px-4 font-sans text-[13px] leading-none outline-none transition-colors duration-200';

function ErrorText({ variant, children }) {
  return children ? <p className={`mt-1 font-sans text-[10px] ${ERROR_TEXT[variant]}`}>{children}</p> : null;
}

export default function FormField({
  variant = 'default',
  error,
  label,
  className = '',
  multiline,
  phone,
  ...props
}) {
  const labelEl = label ? (
    <label
      htmlFor={props.id}
      className={`mb-1.5 block font-sans text-[11px] tracking-[0.16em] uppercase ${variant === 'overlay' ? 'text-white/90' : 'text-brand'}`}
    >
      {label}
    </label>
  ) : null;

  if (multiline) {
    const cls =
      `box-border w-full border px-4 py-3 font-sans text-[13px] outline-none transition-colors duration-200 ${INPUT[variant]} ${error ? ERROR_BORDER[variant] : ''} ${className}`.trim();
    return (
      <div>
        {labelEl}
        <textarea {...props} aria-invalid={!!error} rows={props.rows ?? 4} className={`${cls} min-h-24 resize-none leading-5`} />
        <ErrorText variant={variant}>{error}</ErrorText>
      </div>
    );
  }

  if (phone) {
    const { onChange, value, ...rest } = props;
    const handleChange = (e) => {
      const v = sanitizePhone(e.target.value);
      onChange?.({ ...e, target: { ...e.target, value: v }, currentTarget: { ...e.currentTarget, value: v } });
    };
    const wrap =
      `box-border flex h-12 w-full items-center overflow-hidden border font-sans text-[13px] transition-colors duration-200 ${PHONE_WRAP[variant]} ${error ? ERROR_BORDER[variant] : ''} ${className}`.trim();
    return (
      <div>
        {labelEl}
        <div className={wrap}>
          <span
            className={`flex h-full shrink-0 items-center gap-1.5 px-3 font-sans text-[13px] leading-none ${PREFIX[variant]}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 21 15" className="h-3 w-[17px] shrink-0 overflow-hidden border border-black/10">
              <rect width="21" height="5" y="0" fill="#FF9933" />
              <rect width="21" height="5" y="5" fill="#FFFFFF" />
              <rect width="21" height="5" y="10" fill="#138808" />
              <circle cx="10.5" cy="7.5" r="1.6" fill="#000080" />
            </svg>
            +91
          </span>
          <input
            {...rest}
            type="tel"
            inputMode="numeric"
            value={value}
            aria-invalid={!!error}
            onChange={handleChange}
            className="box-border h-full min-w-0 flex-1 border-0 bg-transparent px-3 font-sans text-[13px] leading-none text-inherit outline-none placeholder:text-[13px] placeholder:text-inherit placeholder:opacity-70"
          />
        </div>
        <ErrorText variant={variant}>{error}</ErrorText>
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        {...props}
        aria-invalid={!!error}
        className={`${INPUT_BASE} ${INPUT[variant]} ${error ? ERROR_BORDER[variant] : ''} ${className}`.trim()}
      />
      <ErrorText variant={variant}>{error}</ErrorText>
    </div>
  );
}
