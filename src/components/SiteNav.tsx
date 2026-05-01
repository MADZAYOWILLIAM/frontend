import { useState } from 'react'
import { navItems } from '../data/siteData'
import type { NavigationProps } from '../types/navigation'

const navIcons = {
  Home: 'home',
  About: 'info',
  Event: 'event',
  Blogs: 'article',
  Impact: 'monitoring',
} as const

function SiteNav({ currentRoute, navigateTo }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const goToPage = (path: (typeof navItems)[number]['path']) => {
    navigateTo(path)
    setIsMenuOpen(false)
  }

  return (
    <nav className={isMenuOpen ? 'site-nav mobile-menu-open' : 'site-nav'} aria-label="Main navigation">
      <a
        className="brand"
        href="/"
        aria-label="Foundation Inc home"
        onClick={(event) => {
          event.preventDefault()
          goToPage('/')
        }}
      >
        <span className="brand-mark">
          <span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
        </span>
        <span className="brand-text">
          <strong>Empoweredge</strong>
          <span>Youth Club</span>
        </span>
      </a>
      <div className="nav-links" aria-label="Pages">
        {navItems.map((item) => (
          <a
            aria-current={currentRoute === item.path ? 'page' : undefined}
            className={currentRoute === item.path ? 'active' : undefined}
            href={item.path}
            key={item.path}
            onClick={(event) => {
              event.preventDefault()
              goToPage(item.path)
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="nav-actions">
        <div className="mobile-social-links" aria-label="Social links">
          <a className="facebook-link" href="https://facebook.com" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a className="instagram-link" href="https://instagram.com" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a className="whatsapp-link" href="https://wa.me/254718548376" aria-label="WhatsApp">
            <WhatsAppIcon />
          </a>
        </div>
        <a
          className="nav-auth-link"
          href="/signin"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/signin')
            setIsMenuOpen(false)
          }}
        >
          Sign in
        </a>
        <a
          className="nav-cta"
          href="/signup"
          onClick={(event) => {
            event.preventDefault()
            navigateTo('/signup')
            setIsMenuOpen(false)
          }}
        >
          Sign up
        </a>
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>
      {isMenuOpen && (
        <button
          className="mobile-nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <div className="mobile-nav-panel" aria-label="Mobile pages">
        <div className="mobile-nav-heading">
          <strong>Sidebar Menu</strong>
          <button type="button" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        {navItems.map((item) => (
          <a
            aria-current={currentRoute === item.path ? 'page' : undefined}
            className={currentRoute === item.path ? 'active' : undefined}
            href={item.path}
            key={item.path}
            onClick={(event) => {
              event.preventDefault()
              goToPage(item.path)
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{navIcons[item.label as keyof typeof navIcons]}</span>
            {item.label}
          </a>
        ))}
        <div className="mobile-nav-auth">
          <a
            href="/signin"
            onClick={(event) => {
              event.preventDefault()
              navigateTo('/signin')
              setIsMenuOpen(false)
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">login</span>
            Sign in
          </a>
          <a
            href="/signup"
            onClick={(event) => {
              event.preventDefault()
              navigateTo('/signup')
              setIsMenuOpen(false)
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">person_add</span>
            Sign up
          </a>
        </div>
        <div className="mobile-nav-socials" aria-label="Social links">
          <a className="facebook-link" href="https://facebook.com" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a className="instagram-link" href="https://instagram.com" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a className="whatsapp-link" href="https://wa.me/254718548376" aria-label="WhatsApp">
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </nav>
  )
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14.4 8.1h2.1V4.5c-.4-.1-1.7-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4v3H4.7v4h3.4v8.9h4.1v-8.9h3.4l.5-4h-3.9v-2.6c0-1.2.3-2 2.2-2Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7.4 2.8h9.2c2.5 0 4.6 2.1 4.6 4.6v9.2c0 2.5-2.1 4.6-4.6 4.6H7.4c-2.5 0-4.6-2.1-4.6-4.6V7.4c0-2.5 2.1-4.6 4.6-4.6Zm0 2A2.6 2.6 0 0 0 4.8 7.4v9.2a2.6 2.6 0 0 0 2.6 2.6h9.2a2.6 2.6 0 0 0 2.6-2.6V7.4a2.6 2.6 0 0 0-2.6-2.6H7.4Zm4.6 3.1a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2Zm0 2a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Zm5.2-2.4a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2.8a9 9 0 0 0-7.7 13.7L3 21.2l4.8-1.2A9 9 0 1 0 12 2.8Zm0 2a7 7 0 0 1 0 14 6.9 6.9 0 0 1-3.6-1l-.4-.2-2.2.6.6-2.1-.3-.4A7 7 0 0 1 12 4.8Zm-3.1 3.8c.2 0 .4 0 .5.4l.7 1.6c.1.3.1.4-.1.6l-.4.5c-.1.2-.2.3-.1.5.3.5.7 1.1 1.2 1.6.6.5 1.2.9 1.9 1.2.2.1.3.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .5-.4 1.4-.9 1.7-.5.4-1.3.5-2.3.2-1.2-.4-2.5-1.1-3.8-2.3-1.2-1.2-2.1-2.6-2.5-3.9-.3-.9-.2-1.7.2-2.2.3-.5.9-.8 1.3-.8Z" />
    </svg>
  )
}

export default SiteNav
