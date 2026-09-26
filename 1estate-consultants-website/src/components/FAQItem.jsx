export default function FAQItem({ index, q, a, open, onToggle }) {
  const id = `faq-${index}`;
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <h3 className="faq-item__heading">
        <button
          type="button"
          className="faq-item__btn"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
        >
          <span className="faq-item__num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="faq-item__q">{q}</span>
          <span className="faq-item__icon" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq-item__panel" id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`}>
        <div className="faq-item__inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}
