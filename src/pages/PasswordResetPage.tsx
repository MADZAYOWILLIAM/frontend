import AuthPage from '../components/AuthPage'
import type { NavigateTo } from '../types/navigation'

type PasswordResetPageProps = {
  navigateTo: NavigateTo
}

function PasswordResetPage({ navigateTo }: PasswordResetPageProps) {
  return (
    <AuthPage
      eyebrow="Password reset"
      title="Reset your password."
      text="Enter the email linked to your account and we will send instructions for creating a new password."
      footerText="Remembered your password?"
      footerAction="Back to sign in"
      footerPath="/signin"
      navigateTo={navigateTo}
    >
      <form className="auth-form">
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
        </label>
        <button className="primary-button auth-submit" type="submit">Send reset link</button>
      </form>
    </AuthPage>
  )
}

export default PasswordResetPage
