import { CheckCircle2, ShieldCheck, TrendingUp, Users, Workflow } from 'lucide-react'
import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'
import ImageAnchor from '../components/ImageAnchor'
import { trackEvent } from '../lib/analytics'

const painSignals = [
  {
    title: 'Teams operate across disconnected systems',
    copy: 'Daily execution gets split across tabs, dashboards, and handoffs that slow momentum.',
  },
  {
    title: 'Costs compound quietly every month',
    copy: 'Stacked subscriptions and extra coordination effort reduce margin and speed.',
  },
  {
    title: 'Risk and quality become hard to control',
    copy: 'When marketing workflows are fragmented, preventable errors are easier to miss.',
  },
]

const solutionPillars = [
  {
    icon: Workflow,
    title: 'One command center',
    copy: 'Run campaigns, operations, and reporting from one platform.',
  },
  {
    icon: TrendingUp,
    title: 'One decision layer',
    copy: 'Turn scattered performance signals into clear, fast decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'One control system',
    copy: 'SYN Engine, powered by Synergair, checks campaigns before launch and supports stronger execution.',
  },
]

const operatingFlow = [
  'Connect your core marketing systems and data sources.',
  'Normalize fragmented metrics into one operating context.',
  'Prioritize actions by ROI, quality, and compliance readiness.',
  'Launch and optimize from one command center.',
]

const marketingSurfaces = [
  {
    title: 'Campaign Operations',
    copy: 'Plan, launch, monitor, and optimize campaigns without switching platforms.',
  },
  {
    title: 'CRM + Pipeline Context',
    copy: 'Align acquisition signals with downstream pipeline and revenue visibility.',
  },
  {
    title: 'Lifecycle Execution',
    copy: 'Coordinate follow-up and retention workflows with live performance signals.',
  },
  {
    title: 'Analytics + Attribution',
    copy: 'Get one cross-channel view for performance, pacing, and contribution.',
  },
  {
    title: 'Lead Quality Control',
    copy: 'Improve intake quality so teams spend less time fixing bad data and routing.',
  },
  {
    title: 'Compliance Readiness',
    copy: 'Use pre-launch checks through SYN Engine to reduce avoidable regulatory risk.',
  },
]

const trustPoints = [
  'Powered by Synergair.',
  'SYN Engine runs pre-launch compliance checks.',
  'Built to replace fragmented tool stacks.',
]

const roleFit = [
  {
    icon: Users,
    title: 'Leadership',
    copy: 'One strategic view across growth, cost efficiency, and operational risk.',
  },
  {
    icon: Workflow,
    title: 'Growth + Marketing Ops',
    copy: 'One control layer for workflows, campaign operations, and reporting.',
  },
  {
    icon: CheckCircle2,
    title: 'Execution Teams',
    copy: 'One daily workspace instead of a fragmented routine across tools.',
  },
]

const stackComparison = [
  {
    topic: 'Decision Context',
    fragmented: 'Scattered dashboards and manual reconciliation.',
    avero: 'One operating view for strategy and execution.',
  },
  {
    topic: 'Execution Speed',
    fragmented: 'Handoffs across tools slow launch cycles.',
    avero: 'Unified workflows accelerate launch and iteration.',
  },
  {
    topic: 'Cost Control',
    fragmented: 'Compounding software and coordination overhead.',
    avero: 'Consolidated workflows reduce stack complexity and waste.',
  },
  {
    topic: 'Compliance Control',
    fragmented: 'Risk checks are inconsistent and often too late.',
    avero: 'SYN Engine checks campaigns before launch.',
  },
]

const proofFramework = [
  {
    metric: 'Tool Consolidation',
    evidence: 'Measure how many disconnected tools and handoffs are replaced by one platform.',
  },
  {
    metric: 'Launch Cycle Speed',
    evidence: 'Measure time from planning to launch after centralizing execution in Avero.',
  },
  {
    metric: 'Compliance Risk Reduction',
    evidence: 'Measure pre-launch checks completed through SYN Engine before campaigns go live.',
  },
]

const pricingTiers = [
  {
    plan: 'Starter',
    fit: 'For lean teams centralizing core marketing execution.',
  },
  {
    plan: 'Growth',
    fit: 'For scaling teams needing deeper workflow and optimization control.',
  },
  {
    plan: 'Scale',
    fit: 'For multi-role teams running full marketing operations in one place.',
  },
]

const faqs = [
  {
    question: 'Is Avero only for paid campaigns?',
    answer:
      'No. Avero is built as an all-in-one marketing command center across campaigns, CRM context, lifecycle, analytics, and control workflows.',
  },
  {
    question: 'Do we need to replace every tool immediately?',
    answer:
      'No. You can replace high-friction workflows first, connect what remains, and consolidate over time.',
  },
  {
    question: 'How does Avero reduce compliance risk?',
    answer:
      'SYN Engine runs campaign checks before launch so teams can catch avoidable issues earlier.',
  },
  {
    question: 'Who is Avero built for?',
    answer:
      'Founders, CMOs, Heads of Growth, operators, and marketing teams that need one reliable system to run everything marketing.',
  },
]

export default function HomePage() {
  return (
    <div className="story-page">
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          All-In-One Marketing Software Platform
        </p>
        <h1 className="story-title-xl" data-reveal>
          One platform for everything marketing.
        </h1>
        <p className="story-kicker story-kicker-promise" data-reveal>
          Never buy another marketing tool again.
        </p>
        <p className="story-lead" data-reveal>
          Avero gives your team one command center to run marketing with less friction, lower cost,
          and stronger control.
        </p>
        <div className="story-meta-line" data-reveal>
          {trustPoints.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="cta-row story-cta-center" data-reveal>
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'home_hero' })}
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'home_hero' })}
            >
              Log In
            </Button>
          </Link>
        </div>
        <ImageAnchor
          src="/assets/integration-control-surface.webp"
          alt="Avero dashboard product mockup"
          className="story-image story-image-hero"
          fallbackLabel="Hero Product Placeholder"
          loading="eager"
        />
      </section>

      <section className="story-section story-center">
        <p className="story-kicker" data-reveal>
          Marketing teams are not failing because of effort.
        </p>
        <h2 className="story-title-lg story-tight" data-reveal>
          They are forced to operate through disconnected systems.
        </h2>
        <div className="story-grid-3 story-grid-comfort">
          {painSignals.map((item) => (
            <article key={item.title} className="story-copy-block" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-impact-break">
        <p className="eyebrow" data-reveal>
          The Shift
        </p>
        <h2 className="story-title-lg story-title-break" data-reveal>
          From data chaos to clear decisions.
        </h2>
      </section>

      <section className="story-section">
        <div className="story-role-layout">
          <div className="story-role-lead" data-reveal>
            <p className="eyebrow">Why Avero</p>
            <h2 className="story-title-md">One system for execution, performance, and control.</h2>
            <p className="story-lead story-lead-narrow">
              Avero replaces fragmentation with one operating model for modern marketing teams.
            </p>
          </div>
          <div className="story-outcome-list">
            {solutionPillars.map((item) => (
              <article key={item.title} className="story-outcome-item" data-reveal>
                <h3>
                  <item.icon size={18} />
                  {item.title}
                </h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Operating Flow
          </p>
          <h2 className="story-title-md" data-reveal>
            A clean path from fragmented inputs to focused execution.
          </h2>
        </div>
        <div className="story-flow story-flow-tight">
          {operatingFlow.map((step, index) => (
            <article key={step} className="story-flow-step" data-reveal>
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
        <ImageAnchor
          src="/assets/flow-decision-system.webp"
          alt="Avero workflow mockup"
          className="story-image story-image-flow"
          fallbackLabel="Workflow Placeholder"
        />
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Marketing Surface Area
          </p>
          <h2 className="story-title-md" data-reveal>
            Everything your team can run in Avero.
          </h2>
        </div>
        <div className="story-surface-list">
          {marketingSurfaces.map((item) => (
            <article key={item.title} className="story-surface-item" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Side-By-Side
          </p>
          <h2 className="story-title-md" data-reveal>
            Fragmented stack versus Avero operating model.
          </h2>
        </div>
        <div className="story-compare-list">
          {stackComparison.map((row) => (
            <article key={row.topic} className="story-compare-row" data-reveal>
              <h3>{row.topic}</h3>
              <p>
                <span className="story-label">Fragmented stack</span>
                {row.fragmented}
              </p>
              <p>
                <span className="story-label">Avero</span>
                {row.avero}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Who It Serves
          </p>
          <h2 className="story-title-md" data-reveal>
            Built for every role responsible for marketing growth.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {roleFit.map((item) => (
            <article key={item.title} className="story-copy-block story-copy-icon" data-reveal>
              <item.icon size={20} />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Proof Framework
          </p>
          <h2 className="story-title-md" data-reveal>
            Outcomes teams can track after consolidating in Avero.
          </h2>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {proofFramework.map((item) => (
            <article key={item.metric} className="story-copy-block" data-reveal>
              <h3>{item.metric}</h3>
              <p>{item.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            Pricing Structure
          </p>
          <h2 className="story-title-md" data-reveal>
            Plans designed for each stage of growth.
          </h2>
          <p className="story-lead story-lead-narrow" data-reveal>
            Avero offers Starter, Growth, and Scale plans. Final billing is selected during
            account provisioning.
          </p>
        </div>
        <div className="story-grid-3 story-grid-comfort">
          {pricingTiers.map((item) => (
            <article key={item.plan} className="story-copy-block" data-reveal>
              <h3>{item.plan}</h3>
              <p>{item.fit}</p>
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
            Answers to key adoption questions.
          </h2>
        </div>
        <div className="story-faq-list">
          {faqs.map((item) => (
            <article key={item.question} className="story-faq-item" data-reveal>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">Run your full marketing operation from one platform.</h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and replace fragmented workflows with one command center.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'home_final' })}
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'home_final' })}
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
