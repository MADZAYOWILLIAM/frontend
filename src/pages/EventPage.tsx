import { usePersistentState } from '../hooks/usePersistentState'
import { upcomingEvents } from '../data/siteData'

function EventPage() {
  const [registeredEvents, setRegisteredEvents] = usePersistentState<string[]>('empoweredge-registered-events', [])

  const toggleRegistration = (eventName: string) => {
    setRegisteredEvents((current) =>
      current.includes(eventName) ? current.filter((name) => name !== eventName) : [...current, eventName],
    )
  }

  return (
    <>
      <section
        className="page-hero page-hero-with-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${upcomingEvents[0].image})`,
        }}
      >
        <div className="page-hero-copy">
          <p className="eyebrow">Event</p>
          <h1>Upcoming gatherings with clear community outcomes.</h1>
          <p className="hero-text">
            Each event is planned around practical support, trusted local partners,
            and follow-up that keeps help moving after the day ends.
          </p>
        </div>
      </section>

      <section className="events-section">
        <div className="events-panel">
          <p className="eyebrow">Upcoming</p>
          <h2>Meet us at the next gathering.</h2>
          <p>
            Volunteers, mentors, and partners work together so every event is
            accessible, useful, and connected to a clear next step.
          </p>
          <a className="primary-button" href="mailto:hello@foundation.example">Become a volunteer</a>
        </div>
        <div className="event-list" aria-label="Upcoming events">
          {upcomingEvents.map((event) => (
            <article className="event-row" key={event.name}>
              <img className="event-row-image" src={event.image} alt={event.imageAlt} loading="lazy" decoding="async" />
              <time>{event.date}</time>
              <div>
                <h3>{event.name}</h3>
                <p>{event.location}</p>
                <span>{event.detail}</span>
              </div>
              <button
                className={registeredEvents.includes(event.name) ? 'table-action-button registered' : 'table-action-button'}
                type="button"
                onClick={() => toggleRegistration(event.name)}
              >
                {registeredEvents.includes(event.name) ? 'Cancel' : 'Register'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default EventPage
