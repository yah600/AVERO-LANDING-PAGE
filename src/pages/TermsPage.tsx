import { Button } from 'konsta/react'
import { Link } from 'react-router-dom'

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    copy: 'By accessing or using Avero, you agree to be bound by these Terms of Service. If you are using Avero on behalf of an organization, you represent that you have authority to bind that organization to these terms. If you do not agree, you may not access or use the platform.',
  },
  {
    title: '2. Account Registration and Access',
    copy: 'To use Avero, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Account access is provided based on your selected plan and completion of the onboarding process. You must notify us immediately if you suspect unauthorized access.',
  },
  {
    title: '3. Acceptable Use',
    copy: 'You agree to use Avero only for lawful purposes and in accordance with these terms. You are responsible for all campaigns, content, and workflow actions executed through the platform. You may not use Avero to distribute spam, malware, or content that violates applicable laws. You may not attempt to reverse-engineer, disrupt, or gain unauthorized access to any part of the platform.',
  },
  {
    title: '4. Your Content and Data',
    copy: 'You retain ownership of all content and data you upload or create in Avero. By using the platform, you grant us a limited license to process your data solely to provide and improve our services. We will not use your data for purposes unrelated to operating the platform. You may export or delete your data at any time through your account settings.',
  },
  {
    title: '5. Billing and Plans',
    copy: 'Plan selection, billing setup, and renewal terms are confirmed during account provisioning. Subscription fees are billed in advance on a monthly or annual basis depending on your plan. If payment fails, we may suspend access until the balance is resolved. Refund eligibility is determined by the terms of your specific plan agreement.',
  },
  {
    title: '6. Service Availability',
    copy: 'We strive to maintain high availability but do not guarantee uninterrupted access. We may perform scheduled maintenance with reasonable advance notice. In the event of unplanned downtime, we will work to restore service as quickly as possible and communicate status updates through our standard channels.',
  },
  {
    title: '7. Intellectual Property',
    copy: 'Avero, including its design, code, features, and branding, is the property of Avero and its licensors. These terms do not grant you any rights to our intellectual property except the limited right to use the platform as intended. You may not copy, modify, or distribute any part of the platform without written permission.',
  },
  {
    title: '8. Limitation of Liability',
    copy: 'To the maximum extent permitted by law, Avero and its team shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability for any claim shall not exceed the amount you paid for the service in the twelve months preceding the claim.',
  },
  {
    title: '9. Termination',
    copy: 'Either party may terminate this agreement at any time. You may close your account through your account settings or by contacting support. We may suspend or terminate your access if you violate these terms, with notice where practicable. Upon termination, your right to use the platform ceases and we may delete your data after a 30-day grace period.',
  },
  {
    title: '10. Changes to Terms',
    copy: 'We may update these terms from time to time. We will notify you of material changes via email or through the platform at least 14 days before they take effect. Your continued use of Avero after changes take effect constitutes acceptance of the updated terms.',
  },
  {
    title: '11. Governing Law',
    copy: 'These terms are governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of Avero shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.',
  },
  {
    title: '12. Contact',
    copy: 'If you have questions about these terms, contact us at legal@averocloud.com or reach out through our contact page.',
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
          Terms of Service
        </h1>
        <p className="story-lead story-lead-narrow" data-reveal>
          Last updated: February 10, 2026. Please read these terms carefully before using Avero.
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
        <h2 className="story-title-md">Questions about these terms?</h2>
        <p className="story-lead story-lead-narrow">
          Contact us at{' '}
          <a href="mailto:legal@averocloud.com">legal@averocloud.com</a> or visit our contact page.
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
