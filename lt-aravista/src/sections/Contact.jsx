import { useRef, useState } from 'react';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { IconLocation, IconPhone, IconWhatsAppSolid } from '../components/ui/Icons';
import { SITE } from '../config/site';
import { goToThankYou, submitLead } from '../lib/leads';
import { sanitizeName, sanitizePhone, validateEmail, validateName, validatePhone } from '../lib/validation';

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const [consent, setConsent] = useState(true);
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', consent: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      consent: consent ? '' : 'Please authorize us to contact you',
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
        message: values.message.trim(),
        form_name: 'Contact Us Form',
      });
      goToThankYou();
    } catch (err) {
      console.error('Lead submit failed:', err);
      busy.current = false;
      setSubmitting(false);
      setSubmitError('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="bg-cream py-16 sm:py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid overflow-hidden rounded-[2rem] shadow-luxury ring-1 ring-brand/10 lg:grid-cols-2">
          <div className="bg-luxury-dark relative overflow-hidden px-6 py-10 text-white sm:px-10 sm:py-12">
            <span className="glass-effect relative inline-flex items-center gap-2 rounded-full px-5 py-2 font-sans text-[10px] font-medium tracking-[0.32em] text-champagne uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
              Contact
            </span>
            <h2 className="relative mt-5 font-serif text-4xl font-semibold sm:text-5xl">
              Get In Touch <span className="text-gold-gradient italic">With Us</span>
            </h2>
            <div className="mt-5 h-px w-20 bg-champagne/40" />
            <p className="relative mt-5 max-w-md font-body text-[15px] leading-7 text-white/90">
              Share your details to receive the price list, floor plans and brochure for {SITE.name} at {SITE.location}. 3 &amp;
              4 BHK residences starting at {SITE.startingPrice}.
            </p>
            <div className="relative mt-8 space-y-3">
              <a
                href={SITE.phoneTel}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 font-sans text-sm text-white transition-colors hover:border-champagne/40 hover:bg-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-champagne text-brand">
                  <IconPhone className="text-lg" />
                </span>
                {SITE.phoneDisplay}
              </a>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 font-sans text-sm text-white transition-colors hover:border-[#25D366]/50 hover:bg-white/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <IconWhatsAppSolid className="text-lg" />
                </span>
                {SITE.whatsappDisplay}
              </a>
              <p className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 font-sans text-sm text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-champagne text-brand">
                  <IconLocation className="text-lg" />
                </span>
                {SITE.location}
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate className="bg-sand p-6 sm:p-10">
            <p className="font-serif text-3xl font-semibold text-ink md:text-4xl">Register Your Interest</p>
            <p className="mt-2 font-body text-sm text-brand">We will get back to you shortly.</p>
            <div className="mt-5 space-y-2.5">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4">
                <FormField
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  label="Full name"
                  placeholder="Enter your name"
                  value={values.name}
                  error={errors.name}
                  onChange={(e) => {
                    const v = sanitizeName(e.target.value);
                    setValues((s) => ({ ...s, name: v }));
                  }}
                />
                <FormField
                  id="contact-phone"
                  name="phone"
                  autoComplete="tel-national"
                  phone
                  label="Mobile number"
                  placeholder="Enter your number"
                  value={values.phone}
                  error={errors.phone}
                  onChange={(e) => {
                    const v = sanitizePhone(e.target.value);
                    setValues((s) => ({ ...s, phone: v }));
                  }}
                />
              </div>
              <FormField
                id="contact-email"
                name="email"
                autoComplete="email"
                inputMode="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                error={errors.email}
                onChange={(e) => setValues((s) => ({ ...s, email: e.target.value }))}
              />
              <FormField
                id="contact-message"
                name="message"
                multiline
                label="Message"
                placeholder="Write your message"
                value={values.message}
                onChange={(e) => setValues((s) => ({ ...s, message: e.target.value }))}
              />
            </div>
            <label className="mt-2 flex items-start gap-2 font-sans text-[11px] leading-5 text-umber">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-brand" />
              I authorize company representatives to call, SMS, email or WhatsApp me about this project and its offers. This
              consent overrides any registration for DNC/NDNC.
            </label>
            {errors.consent ? <p className="mt-1 font-sans text-[10px] text-red-500">{errors.consent}</p> : null}
            {submitError ? <p className="mt-2 font-sans text-[10px] text-red-500">{submitError}</p> : null}
            <Button type="submit" disabled={submitting} className="mt-5">
              {submitting ? 'Submitting…' : 'Submit Now'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
