import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { api } from '../data/api'

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'mentor' | 'user'
  children?: ReactNode
}

export const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const { data: user, isLoading, error } = useApi(api.auth.me)

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      window.history.replaceState({}, '', '/signin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }

    if (!isLoading && user && requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      window.history.replaceState({}, '', '/dashboard')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [error, isLoading, requiredRole, user])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !user || (requiredRole && user.role !== requiredRole && user.role !== 'admin')) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
