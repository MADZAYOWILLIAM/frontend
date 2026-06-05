import AuthPage from '../components/AuthPage'
import { api } from '../data/api'
import { useMutation } from '../hooks/useApi'
import type { NavigateTo } from '../types/navigation'

type PasswordResetPageProps = {
  navigateTo: NavigateTo
}

function PasswordResetPage({ navigateTo }: PasswordResetPageProps) {
  const { mutate: requestReset, isLoading, isSuccess, error } = useMutation(api.auth.requestPasswordReset)

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
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          requestReset({ email: String(form.get('email') || '') })
        }}
      >
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" required disabled={isLoading} />
        </label>
        {error && <p className="form-error">{error}</p>}
        {isSuccess && <p className="form-success">Reset instructions sent if the email exists.</p>}
        <button className="primary-button auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </AuthPage>
  )
}

export default PasswordResetPage
