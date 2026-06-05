import AuthPage from '../components/AuthPage'
import type { NavigateTo } from '../types/navigation'
import { api } from '../data/api'
import { useMutation } from '../hooks/useApi'

type SignUpPageProps = {
  navigateTo: NavigateTo
}

function SignUpPage({ navigateTo }: SignUpPageProps) {
  const { mutate: signup, isLoading, error: apiError } = useMutation(api.auth.signup, {
    onSuccess: () => {
      // After signup, send them to sign in
      navigateTo('/signin')
    }
  })

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
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          const nameParts = String(form.get('name')).split(' ')
          
          signup({
            username: String(form.get('email')).split('@')[0],
            email: String(form.get('email')),
            password: String(form.get('password')),
            first_name: nameParts[0] || 'User',
            second_name: nameParts.slice(1).join(' ') || 'Member',
          })
        }}
      >
        <label>
          Full name
          <input autoComplete="name" name="name" placeholder="Your name" type="text" required disabled={isLoading} />
        </label>
        <label>
          Email address
          <input autoComplete="email" name="email" placeholder="you@example.com" type="email" required disabled={isLoading} />
        </label>
        <label>
          Password
          <input autoComplete="new-password" name="password" placeholder="Create a password" type="password" required disabled={isLoading} minLength={6} />
        </label>
        
        {apiError && <p className="form-error" style={{ color: '#ef4444', fontSize: '0.875rem' }}>{apiError}</p>}

        <button className="primary-button auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </AuthPage>
  )
}

export default SignUpPage
