import AuthPage from '../components/AuthPage'
import type { NavigateTo } from '../types/navigation'

type SignUpPageProps = {
  navigateTo: NavigateTo
}

function SignUpPage({ navigateTo }: SignUpPageProps) {
  return (
    <AuthPage
      eyebrow="Join the network"
      title="Create your Foundation Inc account."
      text="Register for events, coordinate volunteer shifts, and stay connected to local impact work."
      footerText="Already have an account?"
      footerAction="Sign in"
      footerPath="/signin"
      navigateTo={navigateTo}
    >
      <form className="auth-form">
        <label>
          Full name
          <input autoComplete="name" name="name" placeholder="Your name" type="text" />
        </label>
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
        </label>
        <label>
          Password
          <input autoComplete="new-password" name="password" placeholder="Create a password" type="password" />
        </label>
        <label className="checkbox-label consent-label">
          <input name="updates" type="checkbox" />
          Send me event updates and volunteer opportunities.
        </label>
        <button className="primary-button auth-submit" type="submit">Sign up</button>
      </form>
    </AuthPage>
  )
}

export default SignUpPage
