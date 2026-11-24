import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { IconCheck, IconPhone, IconWhatsApp } from '../components/ui/Icons';
import { ROUTES } from '../config/routes';
import { SITE } from '../config/site';

function pushThankYouEvent() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'lead_thank_you', page_path: window.location.pathname });
}

export default function ThankYou() {
  const navigate = useNavigate();
  useEffect(() => {
    pushThankYouEvent();
  }, []);
  return (
    <section className="flex min-h-[calc(100vh-5.5rem)] items-center bg-white pt-24 pb-16 sm:pb-20 md:pt-36">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border border-brand/40 bg-brand/10">
            <IconCheck className="text-3xl text-brand" aria-hidden="true" />
          </div>
          <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.42em] text-brand sm:text-xs">Thank You</p>
          <h1 className="mt-3 font-serif text-3xl font-light leading-tight tracking-wide text-neutral-900 sm:text-4xl">
            We&apos;ve received your enquiry
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-brand" />
          <p className="mt-5 font-sans text-sm leading-7 text-neutral-600 sm:text-base">
            Thank you for your interest in {SITE.name} at {SITE.location}. Our team will review your details and get in touch
            with you shortly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href={SITE.phoneTel} variant="outline">
              <IconPhone className="text-base" aria-hidden="true" />
              Call Now
            </Button>
            <Button variant="whatsapp" href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
              <IconWhatsApp className="text-base" aria-hidden="true" />
              WhatsApp
            </Button>
            <Button onClick={() => navigate(ROUTES.home)}>Back to Home</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
