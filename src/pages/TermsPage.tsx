import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const termsSections = [
  {
    title: 'Service Access',
    copy:
      'Avero account access is provided based on selected plan and onboarding completion requirements.',
  },
  {
    title: 'Acceptable Use',
    copy:
      'Users must operate the platform lawfully and are responsible for the campaigns and workflow actions they execute.',
  },
  {
    title: 'Billing and Plans',
    copy:
      'Plan selection, billing setup, and renewal terms are confirmed during account provisioning.',
  },
  {
    title: 'Platform Updates',
    copy:
      'Avero may improve features and workflows over time to maintain reliability, security, and product performance.',
  },
]

export default function TermsPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Terms
        </p>
        <h1 className="story-title-md" data-reveal>
          Terms of service for Avero
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026.
        </p>
      </section>

      <section className="story-section">
        <div className="story-faq-list">
          {termsSections.map((item) => (
            <article key={item.title} className="story-faq-item" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Ready to activate your workspace?</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and complete account setup with full plan and usage terms.
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

