import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'
import ImageAnchor from '../components/ImageAnchor'
import { trackEvent } from '../lib/analytics'

const modules = [
  {
    title: 'Command Center Dashboard',
    technical:
      'A unified operations layer for performance, pacing, and priority visibility across the marketing stack.',
    plain: 'See what matters right now in one place and decide faster.',
    capabilities: [
      'Cross-channel KPI monitoring',
      'Priority and exception visibility',
      'Shared context for leadership and operators',
    ],
  },
  {
    title: 'Campaign Operations',
    technical:
      'Centralized campaign orchestration for launch, status control, and optimization across connected channels.',
    plain: 'Run campaigns from one workflow instead of jumping between ad managers.',
    capabilities: [
      'Launch and status management',
      'Performance-aware iteration loops',
      'Operational control in one workflow',
    ],
  },
  {
    title: 'Analytics + Attribution',
    technical:
      'Unified reporting surfaces that combine performance, spend, and outcome signals for faster decision cycles.',
    plain: 'Stop rebuilding reports manually and read the full picture in one view.',
    capabilities: [
      'Unified performance snapshots',
      'Cross-funnel analysis',
      'Clear channel-level contribution context',
    ],
  },
  {
    title: 'Lead Quality Layer',
    technical:
      'Lead intake and validation controls that increase downstream routing quality and conversion confidence.',
    plain: 'Capture better leads so teams spend less time fixing poor inputs.',
    capabilities: [
      'Intake quality controls',
      'Cleaner handoff to pipeline workflows',
      'Higher-confidence downstream execution',
    ],
  },
  {
    title: 'CRM + Pipeline Alignment',
    technical:
      'Operational linkage between marketing execution signals and pipeline progression visibility.',
    plain: 'Connect marketing activity to pipeline reality without blind spots.',
    capabilities: [
      'Marketing-to-pipeline context',
      'Shared visibility across teams',
      'Revenue-aware marketing decisions',
    ],
  },
  {
    title: 'Lifecycle Execution',
    technical:
      'Audience progression and lifecycle workflows synchronized with campaign states and performance outcomes.',
    plain: 'Keep follow-up and retention workflows aligned with what is happening now.',
    capabilities: [
      'Lifecycle stage orchestration',
      'Context-aware follow-up sequences',
      'Consistent customer journey execution',
    ],
  },
  {
    title: 'Integration Control Layer',
    technical:
      'Connection and synchronization controls that keep external systems operationally aligned inside Avero.',
    plain: 'Bring current systems in, keep them coordinated, and reduce operational drift.',
    capabilities: [
      'Connected system visibility',
      'Operational synchronization flow',
      'Replace-plus-connect adoption support',
    ],
  },
  {
    title: 'SYN Engine Compliance Layer',
    technical:
      'SYN Engine, powered by Synergair, runs optimization and pre-launch compliance checks before execution.',
    plain: 'Launch with stronger quality control and lower avoidable compliance risk.',
    capabilities: [
      'Pre-launch compliance checks',
      'Execution quality safeguards',
      'Risk-aware launch readiness',
    ],
  },
]

const workflowValue = [
  'Centralize daily marketing execution in one place',
  'Reduce friction between strategy and implementation',
  'Move from insight to action with less delay',
  'Scale output without scaling tool complexity',
]

const roleViews = [
  {
    title: 'For Leadership',
    copy: 'One strategic layer for growth, cost control, and risk visibility.',
  },
  {
    title: 'For Marketing Ops',
    copy: 'One control plane for workflows, campaign operations, and reporting integrity.',
  },
  {
    title: 'For Execution Teams',
    copy: 'One workspace to launch, optimize, and report with less operational drag.',
  },
]

const featureFaq = [
  {
    question: 'Are these modules live or roadmap placeholders?',
    answer:
      'These are positioned as active operating capabilities in Avero, built to run as one connected system.',
  },
  {
    question: 'Can non-technical teams use Avero effectively?',
    answer:
      'Yes. Every module is designed with both technical depth and plain-language workflows so teams can operate without unnecessary complexity.',
  },
  {
    question: 'Can adoption happen in phases?',
    answer:
      'Yes. Teams usually start with high-impact workflows first, then expand across the full marketing operation.',
  },
]

export default function FeaturesPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Features
        </p>
        <h1 className="story-title-lg" data-reveal>
          The full marketing operating system, in one platform.
        </h1>
        <p className="story-lead" data-reveal>
          Avero unifies day-to-day execution, decision context, and control workflows so teams can
          move faster with less complexity.
        </p>
        <div className="cta-row story-cta-center" data-reveal>
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'features_hero' })}
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'features_hero' })}
            >
              Log In
            </Button>
          </Link>
        </div>
        <ImageAnchor
          src="/assets/features-modules-overview.webp"
          alt="Avero feature modules visual"
          className="story-image story-image-wide"
          fallbackLabel="Features Placeholder"
          loading="eager"
        />
      </section>

      <section className="story-section story-center story-impact-break">
        <p className="eyebrow" data-reveal>
          Module Architecture
        </p>
        <h2 className="story-title-md story-title-break" data-reveal>
          Each module works on its own and gets stronger together.
        </h2>
        <div className="story-chip-cloud">
          {modules.map((module) => (
            <span key={module.title} className="story-chip" data-reveal>
              {module.title}
            </span>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <h2 className="story-title-md" data-reveal>
            Feature details by module
          </h2>
        </div>
        <div className="story-accordion-list">
          {modules.map((module, index) => (
            <details key={module.title} className="story-accordion-item" data-reveal open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{module.title}</strong>
              </summary>
              <div className="story-accordion-content">
                <p>
                  <span className="story-label">Technical</span>
                  {module.technical}
                </p>
                <p>
                  <span className="story-label">Plain language</span>
                  {module.plain}
                </p>
                <ul className="story-bullet-list">
                  {module.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <h2 className="story-title-md" data-reveal>
            Workflow impact across the full marketing operation
          </h2>
        </div>
        <div className="story-grid-2 story-grid-comfort">
          {workflowValue.map((item) => (
            <article key={item} className="story-copy-block" data-reveal>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            By Role
          </p>
          <h2 className="story-title-md" data-reveal>
            One platform, different outcomes by team.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {roleViews.map((item) => (
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
            Common feature adoption questions.
          </h2>
        </div>
        <div className="story-faq-list">
          {featureFaq.map((item) => (
            <article key={item.question} className="story-faq-item" data-reveal>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Replace fragmented marketing software with one system.</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and run your full marketing operation from one unified platform.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'features_final' })}
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'features_final' })}
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
