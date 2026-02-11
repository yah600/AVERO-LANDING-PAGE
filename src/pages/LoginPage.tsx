import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

const API_BASE_URL = 'https://api.averocloud.com/api/v1'
const APP_URL = 'https://app.averocloud.com'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    trackEvent('login_submit', { source: 'login_page' })

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Invalid credentials')
      }

      // Redirect to app with SSO tokens
      const params = new URLSearchParams({
        sso_token: data.access_token,
      })

      if (data.refresh_token) {
        params.set('sso_refresh', data.refresh_token)
      }

      window.location.href = `${APP_URL}?${params.toString()}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <SectionHeading
        eyebrow="Log In"
        title="Welcome back"
        subtitle="Use your email and password to access your Avero workspace."
        center
      />
      <Card className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </label>
          <Button rounded large className="cta-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Log In'}
          </Button>
        </form>
        <p className="auth-footnote">
          Need an account? <Link to="/signup">Get Access</Link>
        </p>
      </Card>
    </div>
  )
}
