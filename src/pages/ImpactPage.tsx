import { useState } from 'react'
import heroImage from '../assets/hero.png'
import { impactFocus, impactGoals, impactStats, impactTimeline } from '../data/siteData'

const impactCategories = ['All', ...Array.from(new Set(impactFocus.map((item) => item.category)))]

function ImpactPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredFocus =
    selectedCategory === 'All'
      ? impactFocus
      : impactFocus.filter((item) => item.category === selectedCategory)

  return (
    <>
      <section
        className="page-hero page-hero-with-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${heroImage})`,
        }}
      >
        <div className="page-hero-copy">
          <p className="eyebrow">Impact</p>
          <h1>Clear outcomes from every gathering.</h1>
          <p className="hero-text">
            Foundation Inc measures community reach, event delivery, volunteer
            activity, and follow-up so programs stay useful and accountable.
          </p>
        </div>
      </section>

      <section className="impact-strip" aria-label="Foundation impact statistics">
        {impactStats.map((stat) => (
          <article className="impact-item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="impact-page" aria-labelledby="impact-title">
        <div className="section-heading">
          <p className="eyebrow">Focus areas</p>
          <h2 id="impact-title">Where the work is creating momentum.</h2>
          <div className="impact-filter" aria-label="Impact focus filters">
            {impactCategories.map((category) => (
              <button
                className={category === selectedCategory ? 'active' : undefined}
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="impact-focus-grid">
          {filteredFocus.map((item) => (
            <article className="impact-focus-card" key={item.title}>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.metric}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-goals-section" aria-labelledby="impact-goals-title">
        <div className="section-heading">
          <p className="eyebrow">Progress</p>
          <h2 id="impact-goals-title">Annual goals in motion.</h2>
        </div>
        <div className="impact-goals-grid">
          {impactGoals.map((goal) => (
            <article className="impact-goal-card" key={goal.label}>
              <div>
                <h3>{goal.label}</h3>
                <span>{goal.target}</span>
              </div>
              <strong>{goal.value}%</strong>
              <div className="impact-progress-track" aria-label={`${goal.label} ${goal.value} percent complete`}>
                <span style={{ width: `${goal.value}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-timeline-section" aria-labelledby="impact-timeline-title">
        <div className="section-heading">
          <p className="eyebrow">Timeline</p>
          <h2 id="impact-timeline-title">Recent milestones.</h2>
        </div>
        <div className="impact-timeline">
          {impactTimeline.map((item) => (
            <article className="impact-timeline-item" key={item.title}>
              <time>{item.period}</time>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default ImpactPage
