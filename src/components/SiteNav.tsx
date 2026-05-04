import { useEffect, useState } from 'react'
import facebookIcon from '../assets/facebook-icon.webp'
import instagramIcon from '../assets/instagram-icon.webp'
import logoImage from '../assets/logo-mark.webp'
import whatsappIcon from '../assets/whatsapp-icon.webp'
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
  const [isPhoneViewport, setIsPhoneViewport] = useState(() => window.matchMedia('(max-width: 560px)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 560px)')
    const syncViewport = () => {
      setIsPhoneViewport(mediaQuery.matches)

      if (!mediaQuery.matches) {
        setIsMenuOpen(false)
      }
    }

    mediaQuery.addEventListener('change', syncViewport)

    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMenuOpen])

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
          <img src={logoImage} alt="" aria-hidden="true" decoding="async" />
        </span>
        <span className="brand-text">
          <strong>Empoweredge</strong>
          <span> Club</span>
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
        {isPhoneViewport && <SocialLinks className="mobile-social-links" />}
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
        {isPhoneViewport && (
          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        )}
      </div>
      {isPhoneViewport && isMenuOpen && (
        <button
          className="mobile-nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      {isPhoneViewport && (
        <div className="mobile-nav-panel" aria-hidden={!isMenuOpen} aria-label="Mobile pages">
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
          <SocialLinks className="mobile-nav-socials" />
        </div>
      )}
    </nav>
  )
}

function SocialLinks({ className }: { className: string }) {
  return (
    <div className={className} aria-label="Social links">
      <a className="facebook-link" href="https://facebook.com" aria-label="Facebook">
        <img className="social-icon" src={facebookIcon} alt="" aria-hidden="true" decoding="async" />
      </a>
      <a className="instagram-link" href="https://instagram.com" aria-label="Instagram">
        <img className="social-icon" src={instagramIcon} alt="" aria-hidden="true" decoding="async" />
      </a>
      <a className="whatsapp-link" href="https://wa.me/254718548376" aria-label="WhatsApp">
        <img className="social-icon" src={whatsappIcon} alt="" aria-hidden="true" decoding="async" />
      </a>
    </div>
  )
}

export default SiteNav
