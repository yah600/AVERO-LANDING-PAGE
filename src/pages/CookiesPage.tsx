import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const cookieSections = [
  {
    title: '1. What Are Cookies',
    copy: 'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, understand how you use it, and improve your experience. Avero uses cookies and similar technologies to provide a reliable, secure platform experience.',
  },
  {
    title: '2. Essential Cookies',
    copy: 'These cookies are required for the platform to function properly. They handle session continuity, account authentication, security tokens, and basic navigation. Without these cookies, core features like logging in and accessing your workspace would not work. These cookies cannot be disabled.',
  },
  {
    title: '3. Performance and Analytics Cookies',
    copy: 'These cookies help us understand how visitors use the marketing site and platform. They collect information such as pages visited, time on page, and navigation patterns. This data is aggregated and anonymized to help us improve page performance, identify usability issues, and optimize conversion paths.',
  },
  {
    title: '4. Preference Cookies',
    copy: 'These cookies remember choices you make to improve your experience, such as preferred language, display settings, or previously dismissed notifications. They reduce repeated interaction friction so you do not have to reconfigure the same settings on every visit.',
  },
  {
    title: '5. Third-Party Cookies',
    copy: 'We may use third-party services that set their own cookies, such as analytics providers or embedded content. These cookies are governed by the respective third party\'s privacy policy. We do not allow third-party advertising cookies on Avero.',
  },
  {
    title: '6. Cookie Duration',
    copy: 'Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. Authentication cookies typically expire after 24 hours of inactivity, and preference cookies are retained for up to 12 months.',
  },
  {
    title: '7. Managing Cookies',
    copy: 'You can manage cookie preferences through your browser settings. Most browsers allow you to block or delete cookies, though this may affect platform functionality. You can also clear cookies at any time. For detailed instructions, refer to your browser\'s help documentation.',
  },
  {
    title: '8. Changes to This Policy',
    copy: 'We may update this cookie policy to reflect changes in our practices or applicable regulations. Updates will be posted on this page with a revised date. We encourage you to review this policy periodically.',
  },
  {
    title: '9. Contact',
    copy: 'If you have questions about how Avero uses cookies, contact us at privacy@averocloud.com.',
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
          Cookie Policy
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026. This policy explains how Avero uses cookies and similar
          technologies.
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
        <h2 className="story-title-md">Questions about cookies?</h2>
        <p className="story-lead story-lead-narrow">
          Contact us at{' '}
          <a href="mailto:privacy@averocloud.com">privacy@averocloud.com</a> or visit our contact
          page.
        </p>
        <div className="cta-row story-cta-center">
          <Link to="/contact">
            <Button rounded large className="cta-primary">
              Contact Us
            </Button>
          </Link>
          <Link to="/">
            <Button rounded large tonal className="cta-secondary">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
