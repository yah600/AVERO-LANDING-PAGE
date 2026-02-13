import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'
import ImageAnchor from '../components/ImageAnchor'
import { trackEvent } from '../lib/analytics'

const lanes = [
  'Acquisition Channels',
  'CRM + Pipeline Systems',
  'Lifecycle + Email Infrastructure',
  'Social Operations',
  'Analytics + Attribution Sources',
  'Revenue Reporting Inputs',
  'Lead Capture Infrastructure',
  'Compliance Checkpoints',
]

const integrationFlow = [
  {
    title: 'Connect',
    technical: 'Ingest critical marketing systems into one operating layer.',
    plain: 'Bring your current stack into Avero without breaking momentum.',
  },
  {
    title: 'Normalize',
    technical: 'Standardize structures and metrics for shared decision workflows.',
    plain: 'Turn scattered data into one readable decision context.',
  },
  {
    title: 'Control',
    technical: 'Apply SYN Engine optimization and compliance checks around execution.',
    plain: 'Improve output while reducing avoidable launch risk.',
  },
  {
    title: 'Execute',
    technical: 'Operate campaigns and workflows from one command center.',
    plain: 'Launch faster with fewer handoffs and less platform switching.',
  },
]

const operatingModel = [
  {
    title: 'Replace In Avero',
    copy: 'Move high-friction workflows into Avero for tighter control and faster execution.',
  },
  {
    title: 'Connect What Remains',
    copy: 'Integrate systems you keep so teams still work from one consistent context.',
  },
  {
    title: 'Scale Without Re-Fracturing',
    copy: 'Expand operations without rebuilding process, reporting, and coordination every quarter.',
  },
]

const integrationMatrix = [
  {
    surface: 'Acquisition Data',
    status: 'Live',
    coverage: 'Replace + Connect',
    proof: 'Unified performance and execution context across channels.',
  },
  {
    surface: 'Campaign Data Layer',
    status: 'Live',
    coverage: 'Replace + Connect',
    proof: 'One control plane for launch state, pacing, and optimization.',
  },
  {
    surface: 'CRM + Pipeline Signals',
    status: 'Live',
    coverage: 'Connect',
    proof: 'Marketing decisions linked to downstream pipeline movement.',
  },
  {
    surface: 'Lifecycle + Retention Signals',
    status: 'Live',
    coverage: 'Replace + Connect',
    proof: 'Follow-up workflows synchronized with campaign state.',
  },
  {
    surface: 'Analytics + Attribution',
    status: 'Live',
    coverage: 'Replace + Connect',
    proof: 'Cross-channel decision layer in one operating view.',
  },
  {
    surface: 'Compliance Workflow Layer',
    status: 'Live',
    coverage: 'Replace',
    proof: 'Pre-launch checks through SYN Engine before execution.',
  },
]

const integrationPrinciples = [
  {
    title: 'Operational, Not Cosmetic',
    copy: 'Connections are built to support day-to-day execution, not just reporting sync.',
  },
  {
    title: 'Centralized Decision Logic',
    copy: 'Avero turns fragmented platform signals into one command context for the team.',
  },
  {
    title: 'Scalable by Design',
    copy: 'As teams grow, workflows remain unified instead of becoming more fragmented.',
  },
]

const objections = [
  {
    question: 'Do we need to migrate everything at once?',
    answer: 'No. Most teams connect core systems first and replace workflows in practical phases.',
  },
  {
    question: 'Can Avero support compliance-sensitive workflows?',
    answer:
      'Yes. SYN Engine runs pre-launch checks to help reduce avoidable risk before campaigns go live.',
  },
  {
    question: 'Will teams still have operational flexibility?',
    answer:
      'Yes. Avero centralizes control while keeping execution flexible by role and workflow.',
  },
]

export default function IntegrationsPage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Integrations
        </p>
        <h1 className="story-title-lg" data-reveal>
          Connect your full marketing ecosystem to one command layer.
        </h1>
        <p className="story-lead" data-reveal>
          Avero is built for replacement and connection so teams can centralize operations without
          losing momentum.
        </p>
        <div className="cta-row story-cta-center" data-reveal>
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() =>
                trackEvent('cta_click', { cta: 'get_access', source: 'integrations_hero' })
              }
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'integrations_hero' })}
            >
              Log In
            </Button>
          </Link>
        </div>
        <ImageAnchor
          src="/assets/hero-command-center.webp"
          alt="Avero integrations overview visual"
          className="story-image story-image-wide"
          fallbackLabel="Integrations Placeholder"
          loading="eager"
        />
      </section>

      <section className="story-section story-center story-impact-break">
        <p className="story-kicker" data-reveal>
          Integration in Avero is operational unification, not just data syncing.
        </p>
        <div className="story-chip-cloud">
          {lanes.map((item) => (
            <span key={item} className="story-chip" data-reveal>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Integration Principles
          </p>
          <h2 className="story-title-md" data-reveal>
            How Avero keeps connected systems useful in daily operations.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {integrationPrinciples.map((item) => (
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
            Integration Matrix
          </p>
          <h2 className="story-title-md" data-reveal>
            What is live today and how teams use it.
          </h2>
        </div>
        <div className="story-matrix">
          {integrationMatrix.map((row) => (
            <article key={row.surface} className="story-matrix-row" data-reveal>
              <h3>{row.surface}</h3>
              <p>
                <span className="story-label">Status</span>
                {row.status}
              </p>
              <p>
                <span className="story-label">Coverage</span>
                {row.coverage}
              </p>
              <p>
                <span className="story-label">Proof</span>
                {row.proof}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <h2 className="story-title-md" data-reveal>
            How Avero turns integrations into outcomes
          </h2>
        </div>
        <div className="story-grid-2 story-grid-comfort">
          {integrationFlow.map((step, index) => (
            <article key={step.title} className="story-chapter" data-reveal>
              <p className="story-chapter-index">{String(index + 1).padStart(2, '0')}</p>
              <h3>{step.title}</h3>
              <p>
                <span className="story-label">Technical</span>
                {step.technical}
              </p>
              <p>
                <span className="story-label">Plain language</span>
                {step.plain}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <h2 className="story-title-md" data-reveal>
            The operating model: replace plus connect.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {operatingModel.map((item) => (
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
            Common integration adoption questions.
          </h2>
        </div>
        <div className="story-faq-list">
          {objections.map((item) => (
            <article key={item.question} className="story-faq-item" data-reveal>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Connect everything. Control everything. Scale faster.</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and run your full marketing stack from one platform.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() =>
                trackEvent('cta_click', { cta: 'get_access', source: 'integrations_final' })
              }
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'integrations_final' })}
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
