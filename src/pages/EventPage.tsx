import { getUpcomingEvents } from '../data/siteData'
import type { NavigateTo } from '../types/navigation'
import { api } from '../data/api'
import { useApi, useMutation } from '../hooks/useApi'

type EventPageProps = {
  navigateTo: NavigateTo
}

function EventPage({ navigateTo }: EventPageProps) {
  const { mutate: joinEvent, isLoading: isJoining, error: joinError } = useMutation(api.events.join, {
    onSuccess: () => {
      window.localStorage.setItem('empoweredge-member-active-tab', JSON.stringify('Events'))
      navigateTo('/dashboard')
    },
  })

  const { data: events, isLoading, error } = useApi(getUpcomingEvents)

  if (isLoading) return <div className="p-20 text-center">Loading events...</div>
  if (error) return <div className="p-20 text-center form-error">Unable to load events: {error}</div>

  const firstEventImage = events?.[0]?.image || ''

  return (
    <>
      <section
        className="page-hero page-hero-with-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${firstEventImage})`,
        }}
      >
        <div className="page-hero-copy">
          <p className="eyebrow">Event</p>
          <h1>Upcoming gatherings with clear community outcomes.</h1>
          <p className="hero-text">
            Each event is planned around practical support, trusted local partners,
            and follow-up that keeps help moving after the day ends.
          </p>
          {joinError && <p className="form-error">Sign in to register for an event.</p>}
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
          {(events || []).map((event) => (
            <article className="event-row" key={event.name}>
              <img className="event-row-image" src={event.image} alt={event.imageAlt} loading="lazy" decoding="async" />
              <div className="blog-meta event-meta">
                <time>{event.date}</time>
                <span>{event.location}</span>
              </div>
              <div className="event-card-copy">
                <h3>{event.name}</h3>
                <p>{event.detail}</p>
              </div>
              <button
                className="table-action-button"
                type="button"
                disabled={isJoining}
                onClick={() => joinEvent(event.id).catch(() => navigateTo('/signin'))}
              >
                {isJoining ? 'Registering...' : 'Register'}
              </button>
            </article>
          ))}
          {joinError && <p className="form-error">Sign in to register for an event.</p>}
        </div>
      </section>
    </>
  )
}

export default EventPage
