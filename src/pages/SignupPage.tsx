import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { trackEvent } from '../lib/analytics'

interface AccessRequestData {
  name: string
  email: string
  company: string
  role: string
  priority: string
}

const emptyForm: AccessRequestData = {
  name: '',
  email: '',
  company: '',
  role: '',
  priority: '',
}

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<AccessRequestData>(emptyForm)

  const updateField = (field: keyof AccessRequestData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    trackEvent('signup_request_submit', {
      source: 'signup_page_quick',
      has_role: form.role.trim().length > 0,
      has_priority: form.priority.trim().length > 0,
    })
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
              <label>
                Full Name
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
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
                />
              </label>
              <label>
                Role (optional)
                <input
                  type="text"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  placeholder="CMO, Head of Growth, Founder, etc."
                />
              </label>
              <label>
                Top marketing priority (optional)
                <textarea
                  value={form.priority}
                  onChange={(event) => updateField('priority', event.target.value)}
                  placeholder="What are you trying to improve first?"
                  rows={4}
                />
              </label>
              <Button rounded large className="cta-primary" type="submit">
                Request Access
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
