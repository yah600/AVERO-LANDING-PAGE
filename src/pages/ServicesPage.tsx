import { useState } from 'react'
import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import { trackEvent } from '../lib/analytics'

/* ── Platform Services (Tab 1) ── */

interface ServiceItem {
  title: string
  description: string
  value: string
  capabilities: string[]
}

interface ServiceCategory {
  category: string
  services: ServiceItem[]
}

const platformCategories: ServiceCategory[] = [
  {
    category: 'Marketing Operations',
    services: [
      {
        title: 'Campaigns',
        description:
          'Centralized campaign management across email, social, paid ads, SEO, and SMS — all from one control surface.',
        value: 'Launch faster and iterate in real time without switching between disconnected ad managers and dashboards.',
        capabilities: [
          'Multi-channel campaign orchestration (email, social, ads, SEO, SMS)',
          'Performance monitoring and optimization loops',
          'Budget pacing and spend allocation',
          'A/B testing and variant management',
        ],
      },
      {
        title: 'Content & Creative',
        description:
          'Content calendar, composer, asset library, and approval workflows in one shared creative workspace.',
        value: 'Reduce production bottlenecks and keep creative output aligned with campaign timelines.',
        capabilities: [
          'Visual content calendar with drag-and-drop scheduling',
          'Rich text and visual composer',
          'Asset library with tagging and versioning',
          'Multi-step approval workflows',
        ],
      },
      {
        title: 'Analytics & Reporting',
        description:
          'Unified performance dashboards with cross-channel attribution, custom reports, and scheduled delivery.',
        value: 'Stop rebuilding reports manually — get one cross-channel view for performance, pacing, and contribution.',
        capabilities: [
          'Cross-channel attribution modeling',
          'Custom report builder with templates',
          'Scheduled report delivery (PDF, CSV)',
          'Real-time dashboard with live KPIs',
        ],
      },
      {
        title: 'Email & SMS',
        description:
          'Dedicated email and SMS campaign management with audience segmentation, automation triggers, and delivery tracking.',
        value: 'Coordinate lifecycle messaging with campaign context so follow-ups land at the right time.',
        capabilities: [
          'Drag-and-drop email composer',
          'SMS campaign builder with character counting',
          'Audience segmentation and targeting',
          'Delivery, open rate, and click tracking',
        ],
      },
    ],
  },
  {
    category: 'Growth & Revenue',
    services: [
      {
        title: 'Leads & CRM',
        description:
          'Lead capture, scoring, pipeline visibility, and CRM alignment — connecting acquisition signals to downstream revenue.',
        value: 'Improve intake quality so teams spend less time fixing bad data and more time closing deals.',
        capabilities: [
          'Lead capture forms and landing pages',
          'AI-powered lead scoring',
          'Pipeline visibility and stage tracking',
          'CRM sync and contact management',
        ],
      },
      {
        title: 'SEO Suite',
        description:
          'Keyword research, rank tracking, site audit, backlink monitoring, and content optimization in one SEO workspace.',
        value: 'Drive organic growth with a complete SEO toolkit that connects directly to your content and campaign workflows.',
        capabilities: [
          'Keyword research and opportunity discovery',
          'Daily rank tracking with competitor comparison',
          'Technical site audit with fix recommendations',
          'Backlink monitoring and outreach',
        ],
      },
      {
        title: 'Social Media',
        description:
          'Social listening, publishing, scheduling, and influencer identification across all major platforms.',
        value: 'Manage your entire social presence from one place and spot opportunities before competitors do.',
        capabilities: [
          'Multi-platform publishing and scheduling',
          'Social listening and sentiment analysis',
          'Influencer identification and outreach',
          'Engagement analytics and benchmarking',
        ],
      },
      {
        title: 'Commerce & Payments',
        description:
          'Product management, order tracking, subscription handling, and payment processing for marketing-driven commerce.',
        value: 'Close the loop between marketing campaigns and revenue with integrated commerce workflows.',
        capabilities: [
          'Product catalog management',
          'Order tracking and fulfillment',
          'Subscription and recurring billing',
          'Payment processing integration',
        ],
      },
      {
        title: 'Referral & Loyalty',
        description:
          'Referral program management, rewards configuration, and loyalty tracking to turn customers into growth channels.',
        value: 'Systematize word-of-mouth and retention so growth compounds without proportional ad spend.',
        capabilities: [
          'Referral program builder with link tracking',
          'Reward tiers and points system',
          'Loyalty analytics and retention curves',
          'Automated referral payouts',
        ],
      },
    ],
  },
  {
    category: 'Intelligence & Automation',
    services: [
      {
        title: 'Automation & Workflows',
        description:
          'Visual workflow builder with triggers, conditions, and actions — automate lead scoring, nurturing, and operational tasks.',
        value: 'Remove manual handoffs and let the platform handle repetitive marketing operations automatically.',
        capabilities: [
          'Visual drag-and-drop workflow builder',
          'Event-based triggers and conditions',
          'AI-powered insights and recommendations',
          'Lead scoring and routing automation',
        ],
      },
      {
        title: 'Chatbot Builder',
        description:
          'Build and deploy conversational chatbots for lead qualification, support, and engagement across web and messaging channels.',
        value: 'Capture and qualify leads 24/7 without adding headcount to your front-line team.',
        capabilities: [
          'No-code chatbot builder',
          'Multi-channel deployment (web, messaging)',
          'Lead qualification flows',
          'Handoff to human agents',
        ],
      },
    ],
  },
  {
    category: 'Platform & Infrastructure',
    services: [
      {
        title: 'Team Collaboration',
        description:
          'Shared tasks, projects, approval queues, and team chat — built into the marketing workflow instead of bolted on.',
        value: 'Keep collaboration inside the same system where work happens instead of splitting across Slack, Asana, and email.',
        capabilities: [
          'Task and project management',
          'Approval queues with role-based routing',
          'Team chat and @mentions',
          'Activity feeds and change logs',
        ],
      },
      {
        title: 'Compliance & Security',
        description:
          'Pre-launch compliance checks, audit logs, role-based access control, and security monitoring for regulated marketing workflows.',
        value: 'Reduce avoidable regulatory risk with SYN Engine checks before campaigns go live.',
        capabilities: [
          'SYN Engine pre-launch compliance checks',
          'Full audit trail and change history',
          'Role-based access control',
          'Data security and encryption',
        ],
      },
      {
        title: 'API & Webhooks',
        description:
          'Developer-friendly REST API, webhook configuration, and integration logs for extending Avero into custom workflows.',
        value: 'Build custom integrations and connect Avero to any system in your stack via API.',
        capabilities: [
          'RESTful API with full documentation',
          'Webhook event subscriptions',
          'Integration logs and debugging',
          'API key management and rate limiting',
        ],
      },
    ],
  },
]

/* ── Agency Services (Tab 2) ── */

const agencyServices = [
  {
    title: 'Videography & Photography',
    copy: 'Professional video and photo production for campaigns, social content, brand assets, and product launches — delivered through vetted creative contractors.',
  },
  {
    title: 'Editing & Post-Production',
    copy: 'End-to-end editing, color grading, motion graphics, and asset formatting — optimized for every channel and platform requirement.',
  },
  {
    title: 'Influencer Placement',
    copy: 'Find, vet, and place influencers at scale. Track deliverables, manage contracts, and measure attribution — all from one operating layer.',
  },
  {
    title: 'Contractor Outsourcing',
    copy: 'Deploy experienced marketing professionals on-demand — from campaign operations and copywriting to paid media and analytics — without building a full in-house team.',
  },
]

const contractorValueProps = [
  {
    title: 'Outsource Creative Production',
    copy: 'Access experienced videographers, photographers, editors, and designers through Avero\'s contractor network. Deploy talent on-demand without building an in-house creative team.',
  },
  {
    title: 'Place Influencers at Scale',
    copy: 'Source, vet, and activate influencers through the platform. Track campaigns, manage deliverables, and measure attribution from one operating layer.',
  },
  {
    title: 'Manage Contracts and Payments',
    copy: 'Handle contractor onboarding, statements of work, milestone tracking, and commission payouts directly inside Avero. No fragmented spreadsheets or third-party tools.',
  },
]

const servicesFaq = [
  {
    question: 'Can we use just the platform or just the agency services?',
    answer:
      'Yes. The platform and agency services work independently. You can use Avero as a pure SaaS tool, engage creative and contractor services separately, or combine both for a full-service operating model.',
  },
  {
    question: 'How does contractor outsourcing work?',
    answer:
      'Avero connects your team with vetted marketing professionals and creative talent. You define the scope, we source and manage the contractor — including contracts, deliverables, and payments — through the platform.',
  },
  {
    question: 'What types of influencers can Avero place?',
    answer:
      'We work across social platforms including Instagram, TikTok, YouTube, LinkedIn, and Twitter. Placements range from micro-influencers for niche campaigns to larger creators for brand awareness.',
  },
  {
    question: 'How do platform services integrate with each other?',
    answer:
      'Every module shares the same data layer. Campaign performance flows into analytics, lead scoring feeds CRM, content assets connect to campaigns, and compliance checks run before launch — all without manual data transfer.',
  },
  {
    question: 'Can adoption happen in phases?',
    answer:
      'Yes. Most teams start with the highest-impact workflows and expand over time. The platform is modular by design — start with campaigns and analytics, then layer in automation, SEO, or contractor services as needs grow.',
  },
]

/* ── Component ── */

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'platform' | 'agency'>('platform')

  const categoryOffsets = platformCategories.reduce<number[]>(
    (acc, _cat, i) => {
      acc.push(i === 0 ? 0 : acc[i - 1] + platformCategories[i - 1].services.length)
      return acc
    },
    [],
  )

  return (
    <div className="story-page">
      {/* Hero */}
      <section className="story-section story-center">
        <p className="eyebrow" data-reveal>
          Services
        </p>
        <h1 className="story-title-lg" data-reveal>
          Everything your team needs to run, grow, and scale marketing.
        </h1>
        <p className="story-lead" data-reveal>
          Avero combines a full marketing platform with done-for-you creative production, contractor
          outsourcing, and influencer placement — so you can operate at scale without scaling
          complexity.
        </p>
        <div className="cta-row story-cta-center" data-reveal>
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'services_hero' })}
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'services_hero' })}
            >
              Log In
            </Button>
          </Link>
        </div>
        <VideoPlayer
          src="/assets/videos/services-reel-1.mp4"
          poster="/assets/videos/services-reel-1-poster.jpg"
          className="video-player-hero"
          loading="eager"
        />
      </section>

      {/* Tab Switcher */}
      <section className="story-section story-center">
        <div className="services-tab-row" data-reveal>
          <button
            type="button"
            className={`services-tab ${activeTab === 'platform' ? 'active' : ''}`}
            onClick={() => setActiveTab('platform')}
          >
            Platform
          </button>
          <button
            type="button"
            className={`services-tab ${activeTab === 'agency' ? 'active' : ''}`}
            onClick={() => setActiveTab('agency')}
          >
            Agency
          </button>
        </div>
      </section>

      {/* Platform Tab */}
      {activeTab === 'platform' && (
        <div className="services-tab-content" key="platform">
          <section className="story-section story-center story-impact-break">
            <p className="eyebrow" data-reveal>
              Platform Capabilities
            </p>
            <h2 className="story-title-md story-title-break" data-reveal>
              15 integrated modules across 4 operating categories.
            </h2>
            <div className="story-chip-cloud">
              {platformCategories.map((cat) => (
                <span key={cat.category} className="story-chip" data-reveal>
                  {cat.category}
                </span>
              ))}
            </div>
          </section>

          {platformCategories.map((cat, catIdx) => (
            <section key={cat.category} className="story-section">
              <div className="story-center">
                <p className="eyebrow" data-reveal>
                  {cat.category}
                </p>
              </div>
              <div className="story-accordion-list">
                {cat.services.map((service, svcIdx) => {
                  const globalIdx = categoryOffsets[catIdx] + svcIdx + 1
                  return (
                    <details
                      key={service.title}
                      className="story-accordion-item"
                      data-reveal
                      open={globalIdx === 1}
                    >
                      <summary>
                        <span>{String(globalIdx).padStart(2, '0')}</span>
                        <strong>{service.title}</strong>
                      </summary>
                      <div className="story-accordion-content">
                        <p>
                          <span className="story-label">What it does</span>
                          {service.description}
                        </p>
                        <p>
                          <span className="story-label">Why it matters</span>
                          {service.value}
                        </p>
                        <ul className="story-bullet-list">
                          {service.capabilities.map((cap) => (
                            <li key={cap}>{cap}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Agency Tab */}
      {activeTab === 'agency' && (
        <div className="services-tab-content" key="agency">
          <section className="story-section story-center">
            <p className="eyebrow" data-reveal>
              Done-For-You Services
            </p>
            <h2 className="story-title-md" data-reveal>
              Creative production, contractor talent, and influencer placement — managed through
              Avero.
            </h2>
            <p className="story-lead story-lead-narrow" data-reveal>
              Extend your team without extending your headcount. Avero connects you with a curated
              network of marketing professionals, creative talent, and influencers — ready to deploy
              through built-in contracts, onboarding, and management workflows.
            </p>
          </section>

          <section className="story-section">
            <div className="story-center">
              <p className="eyebrow" data-reveal>
                What We Deliver
              </p>
            </div>
            <div className="story-grid-2 story-grid-comfort">
              {agencyServices.map((item) => (
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
                Creative Reel
              </p>
              <h2 className="story-title-md" data-reveal>
                Work produced through our contractor network.
              </h2>
            </div>
            <div className="video-scroll" data-reveal>
              {[
                {
                  src: '/assets/videos/services-reel-1.mp4',
                  poster: '/assets/videos/services-reel-1-poster.jpg',
                },
                {
                  src: '/assets/videos/services-reel-2.mp4',
                  poster: '/assets/videos/services-reel-2-poster.jpg',
                },
                {
                  src: '/assets/videos/hero-reel.mp4',
                  poster: '/assets/videos/hero-reel-poster.jpg',
                },
                {
                  src: '/assets/videos/services-clip-1.mp4',
                  poster: '/assets/videos/services-clip-1-poster.jpg',
                },
              ].map((video) => (
                <div key={video.src} className="video-scroll-item">
                  <video
                    src={video.src}
                    poster={video.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="story-section">
            <div className="story-center">
              <p className="eyebrow" data-reveal>
                Contractor & Influencer Network
              </p>
              <h2 className="story-title-md" data-reveal>
                Access vetted contractors and influencers through the platform.
              </h2>
            </div>
            <div className="story-grid-3 story-grid-comfort">
              {contractorValueProps.map((item) => (
                <article key={item.title} className="story-copy-block" data-reveal>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="story-section story-center" data-reveal>
            <p className="story-kicker">
              Need creative production or contractor support for your next campaign?
            </p>
            <div className="cta-row story-cta-center">
              <Link to="/contact">
                <Button
                  rounded
                  large
                  className="cta-primary"
                  onClick={() =>
                    trackEvent('cta_click', { cta: 'contact', source: 'services_agency' })
                  }
                >
                  Talk to Our Team
                </Button>
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Shared: FAQ */}
      <section className="story-section">
        <div className="story-center">
          <p className="eyebrow" data-reveal>
            FAQ
          </p>
          <h2 className="story-title-md" data-reveal>
            Common questions about Avero services.
          </h2>
        </div>
        <div className="story-faq-list">
          {servicesFaq.map((item) => (
            <article key={item.question} className="story-faq-item" data-reveal>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Shared: Final CTA */}
      <section className="story-section story-center story-final" data-reveal>
        <h2 className="story-title-md">
          Run your full marketing operation and creative production from one platform.
        </h2>
        <p className="story-lead story-lead-narrow">
          Get access to Avero and replace fragmented workflows with one command center.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/signup">
            <Button
              rounded
              large
              className="cta-primary"
              onClick={() =>
                trackEvent('cta_click', { cta: 'get_access', source: 'services_final' })
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
              onClick={() => trackEvent('cta_click', { cta: 'log_in', source: 'services_final' })}
            >
              Log In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
