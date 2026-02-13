import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

const API_BASE_URL = 'https://api.averocloud.com/api/v1'
const CONTACT_API_URL = 'https://1c4qpl8nob.execute-api.us-east-1.amazonaws.com/contact'

interface AccessRequestData {
  name: string
  email: string
  company: string
  role: string
  priority: string
  _honeypot: string
}

const emptyForm: AccessRequestData = {
  name: '',
  email: '',
  company: '',
  role: '',
  priority: '',
  _honeypot: '',
}

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<AccessRequestData>(emptyForm)

  const updateField = (field: keyof AccessRequestData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    trackEvent('signup_request_submit', {
      source: 'signup_page_quick',
      has_role: form.role.trim().length > 0,
      has_priority: form.priority.trim().length > 0,
    })

    try {
      // Fire-and-forget email notification via Lambda
      fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signup',
          name: form.name,
          email: form.email,
          company: form.company,
          role: form.role || undefined,
          _honeypot: form._honeypot || undefined,
        }),
      }).catch(() => {})

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          role: form.role || undefined,
          priority: form.priority || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || data?.message || 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <SectionHeading
        eyebrow="Get Access"
        title="Get access to Avero"
        subtitle="Quick request form. Share a few details and we will send your access path."
        center
      />

      <Card className="auth-card auth-card-wide">
        {submitted ? (
          <div className="submitted-state">
            <h3>Access request received.</h3>
            <p>
              Thanks. We will follow up at <strong>{form.email}</strong> with next steps.
            </p>
            <p>
              Prefer direct contact? <a href="mailto:info@averocloud.com">info@averocloud.com</a>
            </p>
            <Button
              rounded
              className="cta-primary"
              onClick={() => {
                setSubmitted(false)
                setForm(emptyForm)
              }}
            >
              Submit another request
            </Button>
          </div>
        ) : (
          <>
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              <input
                type="text"
                name="website"
                value={form._honeypot}
                onChange={(event) => updateField('_honeypot', event.target.value)}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <label>
                Full Name
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  disabled={isLoading}
                />
              </label>
              <label>
                Work Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  placeholder="Company name"
                  autoComplete="organization"
                  disabled={isLoading}
                />
              </label>
              <label>
                Role (optional)
                <input
                  type="text"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  placeholder="CMO, Head of Growth, Founder, etc."
                  disabled={isLoading}
                />
              </label>
              <label>
                Top marketing priority (optional)
                <textarea
                  value={form.priority}
                  onChange={(event) => updateField('priority', event.target.value)}
                  placeholder="What are you trying to improve first?"
                  rows={4}
                  disabled={isLoading}
                />
              </label>
              <Button rounded large className="cta-primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Request Access'}
              </Button>
            </form>

            <p className="auth-footnote">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
