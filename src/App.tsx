import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import { api } from './data/api'
import type { Role } from './data/api'
import { getBlogPosts, routes } from './data/siteData'
import { useApi } from './hooks/useApi'
import { usePersistentState } from './hooks/usePersistentState'
import type { AuthRole, AuthSession } from './types/auth'
import type { RoutePath } from './types/navigation'
import './App.css'

const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'))
const BlogsPage = lazy(() => import('./pages/BlogsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const EventPage = lazy(() => import('./pages/EventPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'))
const SignInPage = lazy(() => import('./pages/SignInPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))

type PageMetadata = {
  title: string
  description: string
  robots?: string
}

const defaultMetadata: PageMetadata = {
  title: 'Empoweredge Youth Club | Community Events and Youth Mentorship',
  description: 'Empoweredge Youth Club connects young people with community events, mentorship, resources, and practical programs for growth.',
}

const routeMetadata: Record<RoutePath, PageMetadata> = {
  '/': defaultMetadata,
  '/about': {
    title: 'About Empoweredge Youth Club | Our Mission and Community Work',
    description: 'Learn how Empoweredge Youth Club supports youth mentorship, volunteer teams, community programs, and practical local care.',
  },
  '/event': {
    title: 'Upcoming Community Events | Empoweredge Youth Club',
    description: 'Explore upcoming Empoweredge events, workshops, care days, partner sessions, and youth development opportunities.',
  },
  '/blogs': {
    title: 'Community Stories and Youth Mentorship Blog | Empoweredge',
    description: 'Read field notes from Empoweredge community events, youth mentorship programs, resource drives, and partner work.',
  },
  '/blog': {
    title: 'Empoweredge Blog | Community Stories and Field Notes',
    description: 'Read an Empoweredge field note about community support, youth development, and practical local impact.',
  },
  '/impact': {
    title: 'Community Impact | Empoweredge Youth Club',
    description: 'See Empoweredge impact stats, youth training progress, volunteer team goals, and community support milestones.',
  },
  '/contact': {
    title: 'Contact Empoweredge Youth Club',
    description: 'Contact Empoweredge Youth Club to ask about events, volunteering, mentorship, partnerships, and community support.',
  },
  '/dashboard': {
    title: 'Member Dashboard | Empoweredge Youth Club',
    description: 'Access your Empoweredge member dashboard.',
    robots: 'noindex,nofollow',
  },
  '/admin': {
    title: 'Admin Dashboard | Empoweredge Youth Club',
    description: 'Access the Empoweredge admin dashboard.',
    robots: 'noindex,nofollow',
  },
  '/signin': {
    title: 'Sign In | Empoweredge Youth Club',
    description: 'Sign in to your Empoweredge Youth Club account.',
    robots: 'noindex,follow',
  },
  '/signup': {
    title: 'Join Empoweredge Youth Club',
    description: 'Create an Empoweredge Youth Club account to join events, programs, mentorship, and community opportunities.',
  },
  '/password-reset': {
    title: 'Reset Password | Empoweredge Youth Club',
    description: 'Reset access to your Empoweredge Youth Club account.',
    robots: 'noindex,follow',
  },
}

const getRoute = (): RoutePath => {
  const path = window.location.pathname
  return routes.includes(path as RoutePath) ? (path as RoutePath) : '/'
}

const getCurrentUrl = () => `${window.location.pathname}${window.location.search}`

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  const element = existing ?? document.createElement('meta')

  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))

  if (!existing) {
    document.head.append(element)
  }
}

const toAuthRole = (role?: Role): AuthRole => (role === 'admin' ? 'admin' : 'member')

const upsertCanonical = (href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const element = existing ?? document.createElement('link')

  element.rel = 'canonical'
  element.href = href

  if (!existing) {
    document.head.append(element)
  }
}

function App() {
  const [route, setRoute] = useState<RoutePath>(getRoute)
  const [currentUrl, setCurrentUrl] = useState(getCurrentUrl)
  const [session, setSession] = usePersistentState<AuthSession | null>('empoweredge-auth-session', null)
  const { data: blogPosts } = useApi(getBlogPosts)
  const { data: backendUser, error: sessionError } = useApi(api.auth.me)
  const isProtectedRouteDenied =
    (route === '/dashboard' && session?.role !== 'member') ||
    (route === '/admin' && session?.role !== 'admin')
  const visibleRoute: RoutePath = isProtectedRouteDenied ? '/signin' : route

  useEffect(() => {
    if (backendUser) {
      setSession({
        email: backendUser.email,
        name: `${backendUser.first_name} ${backendUser.second_name}`.trim() || backendUser.username,
        role: toAuthRole(backendUser.role),
      })
    }
  }, [backendUser, setSession])

  useEffect(() => {
    if (sessionError && !window.localStorage.getItem('access_token')) {
      setSession(null)
    }
  }, [sessionError, setSession])

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRoute())
      setCurrentUrl(getCurrentUrl())
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const navigateTo = (path: RoutePath, url: string = path) => {
    if (path !== route || window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url)
      setRoute(path)
      setCurrentUrl(url)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const metadata = useMemo(() => {
    const fallback = routeMetadata[visibleRoute]

    if (visibleRoute !== '/blog') {
      return fallback
    }

    const queryString = currentUrl.includes('?') ? currentUrl.slice(currentUrl.indexOf('?')) : ''
    const postId = new URLSearchParams(queryString).get('post')
    const post = (blogPosts || []).find((item) => item.id === postId)

    return post
      ? {
          title: `${post.title} | Empoweredge Blog`,
          description: post.excerpt,
        }
      : fallback
  }, [visibleRoute, currentUrl, blogPosts])

  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`
    const robots = metadata.robots ?? 'index,follow'

    document.title = metadata.title
    upsertCanonical(canonicalUrl)
    upsertMeta('meta[name="description"]', { name: 'description', content: metadata.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: visibleRoute === '/blog' ? 'article' : 'website' })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description })
  }, [metadata, visibleRoute])

  const signIn = (role: AuthRole, email: string, name?: string) => {
    const nextSession = {
      email,
      name: name || (role === 'admin' ? 'Admin User' : 'Empoweredge Member'),
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
      <video
        className="app-background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/home-hero.webm" type="video/webm" />
      </video>
      {visibleRoute !== '/dashboard' && visibleRoute !== '/admin' && <SiteNav currentRoute={visibleRoute} navigateTo={navigateTo} />}
      <Suspense fallback={<div className="page-loading" role="status" aria-live="polite">Loading page...</div>}>
        {visibleRoute === '/' && <HomePage navigateTo={navigateTo} />}
        {visibleRoute === '/about' && <AboutPage />}
        {visibleRoute === '/event' && <EventPage navigateTo={navigateTo} />}
        {visibleRoute === '/blogs' && <BlogsPage navigateTo={navigateTo} />}
        {visibleRoute === '/blog' && <BlogDetailPage key={currentUrl} navigateTo={navigateTo} />}
        {visibleRoute === '/impact' && <ImpactPage />}
        {visibleRoute === '/contact' && <ContactPage />}
        {visibleRoute === '/dashboard' && session?.role === 'member' && <DashboardPage navigateTo={navigateTo} session={session} onSignOut={signOut} />}
        {visibleRoute === '/admin' && session?.role === 'admin' && <AdminDashboardPage onSignOut={signOut} />}
        {visibleRoute === '/signin' && <SignInPage navigateTo={navigateTo} onSignIn={signIn} />}
        {visibleRoute === '/signup' && <SignUpPage navigateTo={navigateTo} />}
        {visibleRoute === '/password-reset' && <PasswordResetPage navigateTo={navigateTo} />}
      </Suspense>
      {visibleRoute !== '/dashboard' && visibleRoute !== '/admin' && <SiteFooter navigateTo={navigateTo} />}
    </main>
  )
}

export default App
