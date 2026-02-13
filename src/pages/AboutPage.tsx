import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'

const principles = [
  {
    title: 'Clarity Over Complexity',
    technical:
      'A single operating surface for campaign execution, analytics, integration health, and controls.',
    plain:
      'Your team should spend time making better marketing decisions, not stitching tools together.',
  },
  {
    title: 'One System Of Action',
    technical:
      'Shared decision context across leadership, growth operations, and execution-level contributors.',
    plain: 'Everyone works from the same truth, so alignment is faster and cleaner.',
  },
  {
    title: 'Operational Trust',
    technical:
      'SYN Engine-powered optimization and compliance checks reduce execution risk before launch.',
    plain: 'You can scale with confidence because quality and control are built into the workflow.',
  },
]

const firstThirtyDays = [
  {
    title: 'Week 1: Align',
    copy: 'Map your current marketing stack and define the highest-impact workflows to centralize first.',
  },
  {
    title: 'Week 2: Connect',
    copy: 'Integrate core systems and establish one operating view for campaign, pipeline, and reporting signals.',
  },
  {
    title: 'Week 3-4: Operate',
    copy: 'Run execution through Avero, apply SYN Engine checks before launch, and tighten decision loops.',
  },
]

const aboutFaq = [
  {
    question: 'Is Avero only for large companies?',
    answer:
      'No. Avero is designed for growing teams that need enterprise-level control without enterprise-level complexity.',
  },
  {
    question: 'What makes Avero different from using many separate tools?',
    answer:
      'Avero is built as one command center, so strategy, execution, analytics, and control happen in the same system.',
  },
  {
    question: 'Can teams adopt Avero without disrupting current operations?',
    answer:
      'Yes. Teams can connect existing systems first and then progressively consolidate workflows in Avero.',
  },
]

export default function AboutPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          About Avero
        </p>
        <h1 className="story-title-lg" data-reveal>
          Built to make marketing operations finally manageable.
        </h1>
        <p className="story-lead" data-reveal>
          Avero exists for one reason: give teams one platform to run everything that matters in
          marketing without depending on fragmented software stacks.
        </p>
      </section>

      <section className="story-section story-center">
        <p className="story-kicker" data-reveal>
          Avero is not another point solution. It is a marketing command center.
        </p>
        <p className="story-lead story-lead-narrow" data-reveal>
          It centralizes execution, visibility, and control so teams move faster with lower waste,
          lower risk, and stronger long-term ROI. Avero also connects teams with vetted contractors
          and influencers through built-in placement and contract management — extending your
          team's capacity without extending your headcount.
        </p>
      </section>

      <section className="story-section">
        <div className="story-center">
          <h2 className="story-title-md" data-reveal>
            Principles behind how Avero is built
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {principles.map((item) => (
            <article key={item.title} className="story-copy-block" data-reveal>
              <h3>{item.title}</h3>
              <p>
                <span className="story-label">Technical</span>
                {item.technical}
              </p>
              <p>
                <span className="story-label">Plain language</span>
                {item.plain}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            First 30 Days
          </p>
          <h2 className="story-title-md" data-reveal>
            What onboarding typically looks like.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {firstThirtyDays.map((item) => (
            <article key={item.title} className="story-copy-block" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            FAQ
          </p>
          <h2 className="story-title-md" data-reveal>
            Common questions about adopting Avero.
          </h2>
        </div>
        <div className="story-faq-list">
          {aboutFaq.map((item) => (
            <article key={item.question} className="story-faq-item" data-reveal>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">One platform for everything marketing.</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and replace fragmented marketing workflows with one command center.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'about_final' })}
            >
              Get Access
            </Button>
          </Link>
          <Link to="/login">
            <Button
              rounded
              large
              tonal
              className="cta-secondary"
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'about_final' })}
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
