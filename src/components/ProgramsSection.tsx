import { programCards } from '../data/siteData'

function ProgramsSection() {
  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">What we do</p>
        <h2>Programs built for community momentum.</h2>
      </div>
      <div className="program-grid">
        {programCards.map((program) => (
          <article className="program-card" key={program.title}>
            <span className="material-symbols-outlined" aria-hidden="true">{program.icon}</span>
            <h3>{program.title}</h3>
            <p>{program.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProgramsSection
