import { useRef, useState } from 'react';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { goToThankYou, submitLead } from '../lib/leads';
import { sanitizeName, sanitizePhone, validateEmail, validateName, validatePhone } from '../lib/validation';

const EMPTY = { name: '', email: '', phone: '' };

export default function HeroEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = { name: validateName(values.name), email: validateEmail(values.email), phone: validatePhone(values.phone) };
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
        form_name: 'Hero Enquiry Form',
      });
      goToThankYou();
    } catch (err) {
      console.error('Lead submit failed:', err);
      busy.current = false;
      setSubmitting(false);
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  const setName = (raw) => {
    const v = sanitizeName(raw);
    setValues((s) => ({ ...s, name: v }));
    if (errors.name) setErrors((s) => ({ ...s, name: validateName(v) }));
  };
  const setPhone = (raw) => {
    const v = sanitizePhone(raw);
    setValues((s) => ({ ...s, phone: v }));
    if (errors.phone) setErrors((s) => ({ ...s, phone: validatePhone(v) }));
  };
  const setEmail = (v) => {
    setValues((s) => ({ ...s, email: v }));
    if (errors.email) setErrors((s) => ({ ...s, email: validateEmail(v) }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full rounded-2xl border border-white/10 bg-brand p-6 shadow-[0_24px_50px_rgba(74,59,55,0.25)] sm:p-7 md:border-white/20 md:bg-ink/55 md:shadow-[0_30px_70px_rgba(40,30,26,0.35)] md:backdrop-blur-xl"
    >
      <h2 className="font-serif text-3xl leading-tight font-medium text-white sm:text-[2.1rem]">Get the Price List</h2>
      <p className="mt-1.5 font-sans text-xs leading-5 text-white/90">
        Share your details to receive the Aravista price list, floor plans and brochure.
      </p>
      <div className="mt-5 space-y-3">
        <FormField
          id="hero-name"
          name="name"
          autoComplete="name"
          type="text"
          label="Full Name"
          required
          variant="overlay"
          value={values.name}
          error={errors.name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setErrors((s) => ({ ...s, name: validateName(values.name) }))}
          placeholder="Your name"
        />
        <FormField
          id="hero-email"
          name="email"
          autoComplete="email"
          inputMode="email"
          type="email"
          label="Email"
          required
          variant="overlay"
          value={values.email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setErrors((s) => ({ ...s, email: validateEmail(values.email) }))}
          placeholder="you@email.com"
        />
        <FormField
          id="hero-phone"
          name="phone"
          autoComplete="tel-national"
          phone
          label="Mobile"
          required
          variant="overlay"
          value={values.phone}
          error={errors.phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setErrors((s) => ({ ...s, phone: validatePhone(values.phone) }))}
          placeholder="Mobile number"
        />
      </div>
      {submitError && <p className="mt-3 font-sans text-[10px] text-red-200">{submitError}</p>}
      <Button type="submit" disabled={submitting} fullWidth showArrow className="mt-5">
        {submitting ? 'Submitting…' : 'Submit Enquiry'}
      </Button>
      <p className="mt-3 text-center font-sans text-[11px] leading-4 text-white/80">By submitting, you agree to be contacted about this project by call, SMS, email or WhatsApp. Your details stay private.</p>
    </form>
  );
}
