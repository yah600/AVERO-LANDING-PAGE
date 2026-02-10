import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const privacySections = [
  {
    title: 'What We Collect',
    copy:
      'Account details, onboarding inputs, and product-usage signals needed to operate and improve Avero.',
  },
  {
    title: 'How We Use Data',
    copy:
      'To provide platform access, improve product performance, maintain service reliability, and support compliance workflows.',
  },
  {
    title: 'Data Sharing',
    copy:
      'Avero does not sell customer data. Data is shared only with essential service providers that support platform operations.',
  },
  {
    title: 'Retention and Security',
    copy:
      'Data is retained based on operational and legal requirements, with safeguards designed to protect account and workflow information.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Privacy
        </p>
        <h1 className="story-title-md" data-reveal>
          Privacy policy for Avero
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026.
        </p>
      </section>

      <section className="story-section">
        <div className="story-faq-list">
          {privacySections.map((item) => (
            <article key={item.title} className="story-faq-item" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Need account access details?</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and review full legal and operational terms during onboarding.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button rounded large className="cta-primary">
              Get Access
            </Button>
          </Link>
          <Link to="/login">
            <Button rounded large tonal className="cta-secondary">
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

