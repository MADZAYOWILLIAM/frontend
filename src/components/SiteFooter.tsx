import type { NavigateTo, RoutePath } from '../types/navigation'

type SiteFooterProps = {
  navigateTo: NavigateTo
}

function SiteFooter({ navigateTo }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <h2>Empoweredge Club</h2>
        <p>
          Empowering youth through structured programs and community engagement.
          Join us to build a better future.
        </p>
      </div>

      <div className="footer-column">
        <h2>Products</h2>
        <a
          href="/blog"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/blog')
          }}
        >
          Blogs
        </a>
        <a
          href="/event"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/event')
          }}
        >
          Events
        </a>
      </div>

      <div className="footer-column" aria-label="Footer navigation">
        <h2>Links</h2>
        {[
          { label: 'Home', path: '/' },
          { label: 'Impact', path: '/impact' },
          { label: 'Login', path: '/signin' },
          { label: 'Sign Up', path: '/signup' },
        ].map((item) => (
          <a
            href={item.path}
            key={item.label}
            onClick={(event) => {
              event.preventDefault()
              navigateTo(item.path as RoutePath)
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="footer-contact">
        <h2>Contact</h2>
        <p>
          <span className="material-symbols-outlined" aria-hidden="true">home</span>
          Mtwapa, Kilifi
        </p>
        <a href="mailto:empoweredgeyouthsclub@gmail.com">
          <span className="material-symbols-outlined" aria-hidden="true">mail</span>
          empoweredgeyouthsclub@gmail.com
        </a>
        <a href="tel:+254718548376">
          <span className="material-symbols-outlined" aria-hidden="true">call</span>
          +254 718548376 / +254 704660925
        </a>
      </div>
    </footer>
  )
}

export default SiteFooter
