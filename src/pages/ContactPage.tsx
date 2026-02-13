import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

const API_BASE_URL = 'https://api.averocloud.com/api/v1'
const CONTACT_API_URL = 'https://1c4qpl8nob.execute-api.us-east-1.amazonaws.com/contact'

interface ContactData {
  name: string
  email: string
  company: string
  role: string
  message: string
  _honeypot: string
}

const emptyForm: ContactData = {
  name: '',
  email: '',
  company: '',
  role: '',
  message: '',
  _honeypot: '',
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<ContactData>(emptyForm)

  const updateField = (field: keyof ContactData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    trackEvent('contact_submit', {
      source: 'contact_page',
      has_role: form.role.trim().length > 0,
    })

    try {
      // Fire-and-forget email notification via Lambda
      fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: form.name,
          email: form.email,
          company: form.company,
          role: form.role || undefined,
          message: form.message || undefined,
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
          priority: form.message || undefined,
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
    <div className="page-stack">
      <SectionHeading
        eyebrow="Contact"
        title="Talk to our team"
        subtitle="Tell us about your marketing setup and we will follow up with the right next steps."
      />

      <Card className="contact-card">
        <p className="contact-direct-line">
          Prefer email? Reach us directly at{' '}
          <a href="mailto:info@averocloud.com">info@averocloud.com</a>.
        </p>
        {submitted ? (
          <div className="submitted-state">
            <h3>Message received.</h3>
            <p>
              Thanks, {form.name.split(' ')[0]}. We will follow up at{' '}
              <strong>{form.email}</strong> with next steps.
            </p>
            <Button
              rounded
              className="cta-primary"
              onClick={() => {
                setSubmitted(false)
                setForm(emptyForm)
              }}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <>
            <form className="demo-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              <input
                type="text"
                name="website"
                value={form._honeypot}
                onChange={(e) => updateField('_honeypot', e.target.value)}
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
                  onChange={(e) => updateField('name', e.target.value)}
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
                  onChange={(e) => updateField('email', e.target.value)}
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
                  onChange={(e) => updateField('company', e.target.value)}
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
                  onChange={(e) => updateField('role', e.target.value)}
                  placeholder="CMO, VP Marketing, Director, etc."
                  disabled={isLoading}
                />
              </label>
              <label>
                How can we help?
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Tell us about your marketing stack and what you are looking to improve."
                  disabled={isLoading}
                />
              </label>
              <Button rounded large className="cta-primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            <p className="auth-footnote">
              Ready to get started? <Link to="/signup">Request access</Link> instead.
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
