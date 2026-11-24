import { useState } from 'react';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { goToThankYou, submitLead } from '../lib/leads';
import { sanitizeName, sanitizePhone, validateEmail, validateName, validatePhone } from '../lib/validation';

const EMPTY = { name: '', email: '', phone: '' };

export default function HeroEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = { name: validateName(values.name), email: validateEmail(values.email), phone: validatePhone(values.phone) };
    setErrors(next);
    setSubmitError('');
    if (Object.values(next).some(Boolean)) return;
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
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
      className="eloria-fade w-full rounded-2xl border border-white/10 bg-brand p-6 shadow-[0_24px_50px_rgba(47,42,36,0.25)] sm:p-7 md:border-white/20 md:bg-black/35 md:shadow-[0_30px_70px_rgba(0,0,0,0.35)] md:backdrop-blur-xl"
      style={{ animationDelay: '1200ms' }}
    >
      <h3 className="font-serif text-3xl leading-tight font-medium text-white sm:text-[2.1rem]">Get the Price List</h3>
      <p className="mt-1.5 font-sans text-xs leading-5 text-white/90">
        Share your details to receive the Aravista price list, floor plans and brochure.
      </p>
      <div className="mt-5 space-y-3">
        <FormField
          id="hero-name"
          name="name"
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
        {submitting ? 'Submitting...' : 'Submit Enquiry'}
      </Button>
      <p className="mt-3 text-center font-sans text-[10px] tracking-wide text-white/80">Your details stay private. No spam.</p>
    </form>
  );
}
