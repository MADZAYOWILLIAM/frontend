import { testimonials } from '../data/siteData'

function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="testimonials-heading">
        <h2 id="testimonials-title">What People Say</h2>
        <p>Stories from our community members.</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <div className="testimonial-person">
              <span className="testimonial-avatar" aria-hidden="true">{testimonial.avatar}</span>
              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role}</p>
              </div>
            </div>
            <blockquote>"{testimonial.quote}"</blockquote>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
