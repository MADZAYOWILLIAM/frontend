import AuthPage from '../components/AuthPage'
import type { NavigateTo } from '../types/navigation'
import { api } from '../data/api'
import { useMutation } from '../hooks/useApi'
import type { AuthRole } from '../types/auth'

type SignInPageProps = {
  navigateTo: NavigateTo
  onSignIn: (role: AuthRole, email: string, name?: string) => void
}

function SignInPage({ navigateTo, onSignIn }: SignInPageProps) {
  const { mutate: login, isLoading, error: apiError } = useMutation(api.auth.login, {
    onSuccess: async (response) => {
      const user = await api.auth.me()
      const role: AuthRole = user.role === 'admin' ? 'admin' : 'member'
      const name = `${user.first_name} ${user.second_name}`.trim() || user.username
      onSignIn(role, user.email || response.user.email, name)
    }
  })

  return (
    <AuthPage
      eyebrow="Welcome back"
      title="Sign in to manage your Foundation Inc activity."
      text="Access event registrations, volunteer updates, and partner resources from one secure place."
      footerText="New to Foundation Inc?"
      footerAction="Create an account"
      footerPath="/signup"
      navigateTo={navigateTo}
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          const email = String(form.get('email') || '')
          const password = String(form.get('password') || '')

          void login({ email, password }).catch(() => undefined)
        }}
      >
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" required disabled={isLoading} />
        </label>
        <label>
          Password
          <input autoComplete="current-password" name="password" placeholder="Enter your password" type="password" required disabled={isLoading} />
        </label>
        {apiError && <p className="form-error" style={{ color: 'var(--error-color, #ef4444)', fontSize: '0.875rem' }}>{apiError}</p>}
        <div className="form-row">
          <label className="checkbox-label">
            <input name="remember" type="checkbox" disabled={isLoading} />
            Remember me
          </label>
          <button className="text-button" type="button" onClick={() => navigateTo('/password-reset')}>
            Forgot password?
          </button>
        </div>
        <button className="primary-button auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthPage>
  )
}

export default SignInPage
