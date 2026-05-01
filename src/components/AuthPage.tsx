import type { ReactNode } from 'react'
import type { NavigateTo, RoutePath } from '../types/navigation'

type AuthPageProps = {
  eyebrow: string
  title: string
  text: string
  footerText: string
  footerAction: string
  footerPath: RoutePath
  navigateTo: NavigateTo
  children: ReactNode
}

function AuthPage({
  eyebrow,
  title,
  text,
  footerText,
  footerAction,
  footerPath,
  navigateTo,
  children,
}: AuthPageProps) {
  return (
    <section className="auth-page">
      <div className="auth-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-text">{text}</p>
        <div className="auth-proof" aria-label="Foundation account benefits">
          <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
          <div>
            <strong>Secure access</strong>
            <p>Built for members, volunteers, and partners coordinating community work.</p>
          </div>
        </div>
      </div>
      <div className="auth-card">
        {children}
        <p className="auth-footer">
          {footerText}{' '}
          <button className="text-button" type="button" onClick={() => navigateTo(footerPath)}>
            {footerAction}
          </button>
        </p>
      </div>
    </section>
  )
}

export default AuthPage
