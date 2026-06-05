import { useEffect, useState } from 'react'
import facebookIcon from '../assets/facebook-icon.webp'
import instagramIcon from '../assets/instagram-icon.webp'
import logoImage from '../assets/logo-mark.webp'
import whatsappIcon from '../assets/whatsapp-icon.webp'
import { navItems } from '../data/siteData'
import { useApi } from '../hooks/useApi'
import { api } from '../data/api'
import type { NavigationProps, RoutePath } from '../types/navigation'

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
  
  const { data: user, isLoading, refetch } = useApi(api.auth.me)

  const handleLogout = async () => {
    await api.auth.logout()
    refetch()
    navigateTo('/signin')
  }

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

  const goToPage = (path: RoutePath) => {
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
          <span>c Club</span>
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
        {!isLoading && (
          user ? (
            <div className="nav-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="nav-user-avatar"
                type="button"
                onClick={() => goToPage('/dashboard')}
                title="Go to dashboard"
              >
                {user.first_name[0]}{user.second_name[0]}
              </button>
              <button className="text-button nav-logout-btn" type="button" onClick={handleLogout} title="Log out">
                <span className="material-symbols-outlined" aria-hidden="true">logout</span>
              </button>
            </div>
          ) : (
            <>
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
            </>
          )
        )}
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
            {!isLoading && (
              user ? (
                <div className="mobile-user-info">
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('/dashboard')
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">account_circle</span>
                    {user.first_name} {user.second_name}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">logout</span>
                    Log out
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )
            )}
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
