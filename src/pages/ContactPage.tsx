import { useState } from 'react'
import heroImage from '../assets/hero.png'

function ContactPage() {
  const [messageSent, setMessageSent] = useState(false)

  return (
    <>
      <section
        className="page-hero page-hero-with-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${heroImage})`,
        }}
      >
        <div className="page-hero-copy">
          <p className="eyebrow">Contact</p>
          <h1>Talk to the Foundation Inc team.</h1>
          <p className="hero-text">
            Reach out about events, mentorship, sponsorships, volunteering, or
            community partnerships.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-panel">
          <p className="eyebrow">Get in touch</p>
          <h2>Send us a message.</h2>
          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault()
              event.currentTarget.reset()
              setMessageSent(true)
            }}
          >
            <label>
              Full name
              <input autoComplete="name" name="name" placeholder="Your name" type="text" />
            </label>
            <label>
              Email address
              <input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
            </label>
            <label>
              Message
              <textarea name="message" placeholder="How can we help?" rows={5} />
            </label>
            <button className="primary-button" type="submit">Send message</button>
            {messageSent && <p className="form-success">Message sent. The team will get back to you soon.</p>}
          </form>
        </div>

        <aside className="contact-details" aria-label="Contact details">
          <article>
            <span className="material-symbols-outlined" aria-hidden="true">mail</span>
            <div>
              <h3>Email</h3>
              <a href="mailto:empoweredgeyouthsclub@gmail.com">empoweredgeyouthsclub@gmail.com</a>
            </div>
          </article>
          <article>
            <span className="material-symbols-outlined" aria-hidden="true">call</span>
            <div>
              <h3>Phone</h3>
              <a href="tel:+254718548376">+254 718548376</a>
              <a href="tel:+254704660925">+254 704660925</a>
            </div>
          </article>
          <article>
            <span className="material-symbols-outlined" aria-hidden="true">home</span>
            <div>
              <h3>Location</h3>
              <p>Mtwapa, Kilifi</p>
            </div>
          </article>
        </aside>
      </section>
    </>
  )
}

export default ContactPage
