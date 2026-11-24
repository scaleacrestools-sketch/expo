import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IMAGES } from '../../config/images';
import Img from '../ui/Img';
import { SITE } from '../../config/site';
import { goToThankYou, submitLead } from '../../lib/leads';
import { sanitizeName, sanitizePhone, validateEmail, validateName, validatePhone } from '../../lib/validation';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { IconClose } from '../ui/Icons';

const POPUP_STATS = [
  { value: '20', label: 'Acres' },
  { value: '9.5', label: 'Acres Open' },
  { value: '3 & 4', label: 'BHK' },
];

export default function EnquiryModal({ isOpen, onClose, title = 'Register Your Interest' }) {
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const [values, setValues] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [submitError, setSubmitError] = useState('');
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
    };
    setErrors(next);
    setSubmitError('');
    if (Object.values(next).some(Boolean)) return;
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    try {
      await submitLead({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        form_name: title,
      });
      goToThankYou();
      close();
    } catch (err) {
      console.error('Lead submit failed:', err);
      busy.current = false;
      setSubmitting(false);
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex animate-popup-backdrop items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button type="button" aria-label="Close popup" onClick={close} className="absolute inset-0 cursor-default" />
      <div className="relative z-10 my-auto w-full max-w-4xl animate-popup-panel overflow-hidden rounded-[1.75rem] bg-cream shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-brand/10">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="group absolute top-3 right-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand/20 bg-white text-brand shadow-md transition-all duration-300 hover:bg-brand hover:text-white sm:top-4 sm:right-4"
        >
          <IconClose className="text-xl transition-transform duration-300 group-hover:rotate-90" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
          <div className="relative hidden overflow-hidden md:block md:h-auto md:min-h-auto">
            <Img
              image={IMAGES.CentralClub}
              sizes="460px"
              alt={`The Central Social Club at ${SITE.name}, ${SITE.location} (artistic impression)`}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
              <p className="inline-flex rounded-full bg-brand/90 px-3.5 py-1.5 font-sans text-[10px] font-semibold tracking-[0.24em] text-cream uppercase">
                {SITE.tagline}
              </p>
              <p className="mt-3 font-serif text-4xl leading-none font-semibold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
                {SITE.name}
              </p>
              <p className="mt-2 font-sans text-xs font-semibold tracking-[0.16em] text-white uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
                {SITE.location}
              </p>
              <p className="mt-4 inline-flex rounded-full bg-cream px-4 py-1.5 font-sans text-xs font-semibold tracking-[0.1em] text-brand uppercase">
                From <span className="mx-1">{SITE.startingPrice}</span>
              </p>
              <div className="mt-4 hidden grid-cols-3 gap-2 md:grid">
                {POPUP_STATS.map((s) => (
                  <div key={s.label} className="rounded-xl bg-brand/90 px-2 py-2.5 text-center">
                    <p className="font-serif text-2xl leading-none font-semibold text-cream">{s.value}</p>
                    <p className="mt-1 font-sans text-[10px] font-semibold tracking-[0.14em] text-cream uppercase">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="h-px w-12 bg-brand/40" />
            <h3 className="mt-4 pr-8 font-serif text-3xl font-semibold text-ink sm:text-4xl">{title}</h3>
            <p className="mt-2 font-sans text-xs leading-5 text-bronze">
              Share your details and our team will connect with you shortly.
            </p>
            <div className="mt-5 space-y-3">
              <FormField
                id="popup-name"
                name="name"
                autoComplete="name"
                type="text"
                label="Full Name"
                required
                placeholder="Your name"
                value={values.name}
                onChange={(e) => {
                  const v = sanitizeName(e.target.value);
                  setValues((s) => ({ ...s, name: v }));
                  if (errors.name) setErrors((s) => ({ ...s, name: validateName(v) }));
                }}
                onBlur={() => setErrors((s) => ({ ...s, name: validateName(values.name) }))}
              />
              <FormField
                id="popup-email"
                name="email"
                autoComplete="email"
                inputMode="email"
                type="email"
                label="Email"
                required
                placeholder="you@email.com"
                value={values.email}
                onChange={(e) => {
                  setValues((s) => ({ ...s, email: e.target.value }));
                  if (errors.email) setErrors((s) => ({ ...s, email: validateEmail(e.target.value) }));
                }}
                onBlur={() => setErrors((s) => ({ ...s, email: validateEmail(values.email) }))}
              />
              <FormField
                id="popup-phone"
                name="phone"
                autoComplete="tel-national"
                phone
                label="Mobile"
                required
                placeholder="Mobile number"
                error={errors.phone}
                value={values.phone}
                onChange={(e) => {
                  const v = sanitizePhone(e.target.value);
                  setValues((s) => ({ ...s, phone: v }));
                  if (errors.phone) setErrors((s) => ({ ...s, phone: validatePhone(v) }));
                }}
                onBlur={() => setErrors((s) => ({ ...s, phone: validatePhone(values.phone) }))}
              />
            </div>
            {submitError && <p className="mt-3 font-sans text-[10px] text-red-500">{submitError}</p>}
            <Button
              type="submit"
              disabled={submitting}
              fullWidth
              showArrow
              className="mt-5 bg-brand! text-white! hover:bg-brand/80! hover:text-white!"
            >
              {submitting ? 'Submitting…' : 'Submit Enquiry'}
            </Button>
            <p className="mt-3 text-center font-sans text-[11px] leading-4 text-umber">
              By submitting, you agree to be contacted about this project by call, SMS, email or WhatsApp. Your details stay private.
            </p>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
