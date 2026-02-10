import { useState, type FormEvent } from 'react'
import { Button, Card } from 'konsta/react'
import SectionHeading from '../components/SectionHeading'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="page-stack">
      <SectionHeading
        eyebrow="Get Access"
        title="Get access to Avero"
        subtitle="Tell us your marketing setup and we’ll provision the right access path for your team."
      />

      <Card className="contact-card">
        {submitted ? (
          <div className="submitted-state">
            <h3>Access request received.</h3>
            <p>
              Thanks for reaching out. We’ll follow up with next steps to get your team started.
            </p>
            <Button rounded className="cta-primary" onClick={() => setSubmitted(false)}>
              Submit another access request
            </Button>
          </div>
        ) : (
          <form className="demo-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input type="text" required />
            </label>
            <label>
              Work Email
              <input type="email" required />
            </label>
            <label>
              Company
              <input type="text" required />
            </label>
            <label>
              Role
              <input type="text" placeholder="CMO, VP Marketing, Director, etc." />
            </label>
            <label>
              Biggest Marketing Priority
              <textarea rows={5} required />
            </label>
            <Button rounded large className="cta-primary" type="submit">
              Get Access
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
