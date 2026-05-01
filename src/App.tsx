import { useEffect, useState } from 'react'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import { routes } from './data/siteData'
import { usePersistentState } from './hooks/usePersistentState'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AboutPage from './pages/AboutPage'
import BlogDetailPage from './pages/BlogDetailPage'
import BlogsPage from './pages/BlogsPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import EventPage from './pages/EventPage'
import HomePage from './pages/HomePage'
import ImpactPage from './pages/ImpactPage'
import PasswordResetPage from './pages/PasswordResetPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import type { AuthRole, AuthSession } from './types/auth'
import type { RoutePath } from './types/navigation'
import './App.css'

const getRoute = (): RoutePath => {
  const path = window.location.pathname
  return routes.includes(path as RoutePath) ? (path as RoutePath) : '/'
}

function App() {
  const [route, setRoute] = useState<RoutePath>(getRoute)
  const [session, setSession] = usePersistentState<AuthSession | null>('empoweredge-auth-session', null)

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute())

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const navigateTo = (path: RoutePath, url: string = path) => {
    if (path !== route || window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url)
      setRoute(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (route === '/dashboard' && session?.role !== 'member') {
      navigateTo('/signin')
    }

    if (route === '/admin' && session?.role !== 'admin') {
      navigateTo('/signin')
    }
  }, [route, session])

  const signIn = (role: AuthRole, email: string) => {
    const nextSession = {
      email,
      name: role === 'admin' ? 'Admin User' : 'Empoweredge Member',
      role,
    }

    setSession(nextSession)
    navigateTo(role === 'admin' ? '/admin' : '/dashboard')
  }

  const signOut = () => {
    setSession(null)
    window.localStorage.removeItem('empoweredge-auth-session')
    navigateTo('/')
  }

  return (
    <main className="home-page">
      {route !== '/dashboard' && route !== '/admin' && <SiteNav currentRoute={route} navigateTo={navigateTo} />}
      {route === '/' && <HomePage navigateTo={navigateTo} />}
      {route === '/about' && <AboutPage />}
      {route === '/event' && <EventPage />}
      {route === '/blogs' && <BlogsPage navigateTo={navigateTo} />}
      {route === '/blog' && <BlogDetailPage navigateTo={navigateTo} />}
      {route === '/impact' && <ImpactPage />}
      {route === '/contact' && <ContactPage />}
      {route === '/dashboard' && session?.role === 'member' && <DashboardPage navigateTo={navigateTo} session={session} onSignOut={signOut} />}
      {route === '/admin' && session?.role === 'admin' && <AdminDashboardPage onSignOut={signOut} />}
      {route === '/signin' && <SignInPage navigateTo={navigateTo} onSignIn={signIn} />}
      {route === '/signup' && <SignUpPage navigateTo={navigateTo} />}
      {route === '/password-reset' && <PasswordResetPage navigateTo={navigateTo} />}
      {route !== '/dashboard' && route !== '/admin' && <SiteFooter navigateTo={navigateTo} />}
    </main>
  )
}

export default App
