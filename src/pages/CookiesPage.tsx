import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const cookieSections = [
  {
    title: 'Essential Cookies',
    copy: 'Used for core platform functionality such as session continuity and account access stability.',
  },
  {
    title: 'Performance Cookies',
    copy:
      'Used to understand page behavior and improve experience quality, speed, and conversion paths.',
  },
  {
    title: 'Preference Cookies',
    copy:
      'Used to remember user choices that improve usability and reduce repeated interaction friction.',
  },
  {
    title: 'Cookie Controls',
    copy:
      'Users can manage cookie behavior through browser controls and account-level preferences where available.',
  },
]

export default function CookiesPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Cookies
        </p>
        <h1 className="story-title-md" data-reveal>
          Cookie policy for Avero
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026.
        </p>
      </section>

      <section className="story-section">
        <div className="story-faq-list">
          {cookieSections.map((item) => (
            <article key={item.title} className="story-faq-item" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Start with one unified marketing platform.</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and configure your workspace with clear privacy and preference controls.
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

