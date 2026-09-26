import { useState } from 'react';
import { CONTACT, telHref, whatsappHref } from '../data/content.js';
import { ArrowRight } from './Icons.jsx';

const EMPTY = { name: '', email: '', mobile: '', message: '' };

const validate = (v) => {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid e-mail address.';
  const digits = v.mobile.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) e.mobile = 'Please enter a valid mobile number.';
  return e;
};

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

function Field({ id, label, error, textarea, ...props }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <Tag
        id={id}
        className="field__input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      <span className="field__line" aria-hidden="true" />
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function VisitForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`visit-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      // Netlify Forms endpoint (form is registered via the static copy in index.html).
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'site-visit', 'bot-field': '', ...values }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="visit-form">
      <span className="visit-form__accent" aria-hidden="true" />
      <h2 className="visit-form__title" id="visit-title">
        Request a
        <br />
        Visit
      </h2>

      {status === 'sent' ? (
        <div className="visit-form__done" role="status">
          <p className="visit-form__done-title">Thank you.</p>
          <p>Our team will connect with you shortly to coordinate your site visit.</p>
          <button type="button" className="text-link" onClick={() => setStatus('idle')}>
            Send another enquiry
          </button>
        </div>
      ) : (
        <form name="site-visit" method="POST" noValidate onSubmit={onSubmit} aria-labelledby="visit-title">
          <input type="hidden" name="form-name" value="site-visit" />
          <Field id="visit-name" name="name" label="Full Name" autoComplete="name" value={values.name} onChange={onChange} error={errors.name} />
          <Field id="visit-email" name="email" type="email" label="E-mail" autoComplete="email" value={values.email} onChange={onChange} error={errors.email} />
          <Field id="visit-mobile" name="mobile" type="tel" label="Mobile" autoComplete="tel" inputMode="tel" value={values.mobile} onChange={onChange} error={errors.mobile} />
          <Field id="visit-message" name="message" label="Message" textarea rows={3} value={values.message} onChange={onChange} />

          <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
            <span>{status === 'sending' ? 'Sending…' : 'Contact'}</span>
            <ArrowRight className="btn__arrow" width={16} height={16} />
          </button>

          {status === 'error' && (
            <p className="visit-form__error" role="alert">
              We couldn’t send your enquiry right now. Please call{' '}
              <a href={telHref(CONTACT.phones[0])}>{CONTACT.phones[0]}</a> or{' '}
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                message us on WhatsApp
              </a>
              .
            </p>
          )}
        </form>
      )}
    </div>
  );
}
