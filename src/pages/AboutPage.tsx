const aboutValues = [
  {
    title: 'Practical support',
    text: 'We design events around clear local needs, useful follow-up, and respectful access to support.',
    icon: 'volunteer_activism',
  },
  {
    title: 'Youth confidence',
    text: 'We help young people build skills, direction, and relationships that strengthen their next steps.',
    icon: 'psychology',
  },
  {
    title: 'Community ownership',
    text: 'We work with volunteers and local leaders so every gathering reflects the people it serves.',
    icon: 'groups',
  },
]

function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>Empowering youth through community-led action.</h1>
        <p className="hero-text">
          Empoweredge Youth Club brings young people, mentors, volunteers, and
          local supporters together through events, mentorship, and practical
          community engagement.
        </p>
      </section>

      <section className="about-story-section">
        <div className="about-story-card">
          <p className="eyebrow">Our story</p>
          <h2>Built for young people who need access, confidence, and opportunity.</h2>
          <p>
            We started with a simple belief: when young people are surrounded by
            guidance, useful programs, and a community that shows up consistently,
            they can take bold steps toward a stronger future.
          </p>
        </div>
        <div className="about-highlight-card">
          <strong>180+</strong>
          <span>community events and youth activities coordinated</span>
        </div>
      </section>

      <section className="about-values-section" aria-labelledby="about-values-title">
        <div className="section-heading">
          <p className="eyebrow">What guides us</p>
          <h2 id="about-values-title">Values behind the work.</h2>
        </div>
        <div className="about-values-grid">
          {aboutValues.map((value) => (
            <article className="about-value-card" key={value.title}>
              <span className="material-symbols-outlined" aria-hidden="true">{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default AboutPage
