import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const privacySections = [
  {
    title: '1. Information We Collect',
    copy: 'We collect information you provide directly when creating an account or requesting access, including your name, email address, company name, and role. We also collect usage data such as pages viewed, features used, and session duration to improve platform performance and reliability.',
  },
  {
    title: '2. How We Use Your Information',
    copy: 'We use your information to provide and maintain platform access, personalize your experience, improve our services, communicate important updates about your account, and ensure the security and integrity of the platform. We may also use aggregated, anonymized data for analytics and product development.',
  },
  {
    title: '3. Data Sharing and Third Parties',
    copy: 'Avero does not sell, rent, or trade your personal information. We share data only with essential service providers that support platform operations, such as cloud hosting (AWS), email delivery, and analytics. All third-party providers are contractually required to protect your data and use it only for the services they provide to us.',
  },
  {
    title: '4. Data Security',
    copy: 'We implement industry-standard security measures including encryption in transit (TLS) and at rest, secure authentication with JWT tokens, and regular security reviews. Access to personal data is restricted to authorized personnel who need it to operate and maintain the platform.',
  },
  {
    title: '5. Data Retention',
    copy: 'We retain your account information for as long as your account is active or as needed to provide services. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.',
  },
  {
    title: '6. Your Rights',
    copy: 'You have the right to access, correct, or delete your personal information at any time. You may also request a copy of the data we hold about you or ask us to restrict processing. To exercise any of these rights, contact us at privacy@averocloud.com.',
  },
  {
    title: '7. Changes to This Policy',
    copy: 'We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of material changes via email or through the platform. Your continued use of Avero after changes take effect constitutes acceptance of the updated policy.',
  },
  {
    title: '8. Contact',
    copy: 'If you have questions about this privacy policy or how we handle your data, contact us at privacy@averocloud.com or write to us at Avero, info@averocloud.com.',
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
          Privacy Policy
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026. This policy describes how Avero collects, uses, and
          protects your information.
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
        <h2 className="story-title-md">Questions about your data?</h2>
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
