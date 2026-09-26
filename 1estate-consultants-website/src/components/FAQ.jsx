import { useState } from 'react';
import { FAQS } from '../data/content.js';
import FAQItem from './FAQItem.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq__inner">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          id="faq-title"
          title={
            <>
              Frequently Asked
              <br />
              Questions
            </>
          }
        />
        <div className="faq__list" data-reveal style={{ '--delay': '120ms' }}>
          {FAQS.map((f, i) => (
            <FAQItem
              key={f.q}
              index={i}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
