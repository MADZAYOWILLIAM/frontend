import AuthPage from '../components/AuthPage'
import type { AuthRole } from '../types/auth'
import type { NavigateTo } from '../types/navigation'

type SignInPageProps = {
  onSignIn: (role: AuthRole, email: string) => void
  navigateTo: NavigateTo
}

function SignInPage({ navigateTo, onSignIn }: SignInPageProps) {
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
          const role = form.get('role') === 'admin' ? 'admin' : 'member'
          const email = String(form.get('email') || 'member@empoweredge.example')

          onSignIn(role, email)
        }}
      >
        <label>
          Account type
          <select name="role" defaultValue="member">
            <option value="member">Member dashboard</option>
            <option value="admin">Admin dashboard</option>
          </select>
        </label>
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" required />
        </label>
        <label>
          Password
          <input autoComplete="current-password" name="password" placeholder="Enter your password" type="password" />
        </label>
        <div className="form-row">
          <label className="checkbox-label">
            <input name="remember" type="checkbox" />
            Remember me
          </label>
          <button className="text-button" type="button" onClick={() => navigateTo('/password-reset')}>
            Forgot password?
          </button>
        </div>
        <button className="primary-button auth-submit" type="submit">Sign in</button>
      </form>
    </AuthPage>
  )
}

export default SignInPage
