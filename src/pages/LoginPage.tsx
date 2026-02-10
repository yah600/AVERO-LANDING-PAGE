import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    trackEvent('login_submit', { source: 'login_page' })
    navigate('/dashboard')
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
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
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
            />
          </label>
          <Button rounded large className="cta-primary" type="submit">
            Log In
          </Button>
        </form>
        <p className="auth-footnote">
          Need an account? <Link to="/signup">Get Access</Link>
        </p>
      </Card>
    </div>
  )
}
