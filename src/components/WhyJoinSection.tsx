import { joinBenefits } from '../data/siteData'

function WhyJoinSection() {
  return (
    <section className="why-join-section" aria-labelledby="why-join-title">
      <div className="why-join-heading">
        <h2 id="why-join-title">Why Join Us?</h2>
        <p>Discover the benefits of being part of our community.</p>
      </div>
      <div className="benefit-grid">
        {joinBenefits.map((benefit) => (
          <article className="benefit-item" key={benefit.title}>
            <span className="benefit-icon material-symbols-outlined" aria-hidden="true">
              {benefit.icon}
            </span>
            <div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyJoinSection
