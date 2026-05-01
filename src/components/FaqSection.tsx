import { faqs } from '../data/siteData'

function FaqSection() {
  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-heading">
        <h2 id="faq-title">Frequently Asked Questions</h2>
        <p>Quick answers about joining, volunteering, and getting involved.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>
              <span>{faq.question}</span>
              <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FaqSection
