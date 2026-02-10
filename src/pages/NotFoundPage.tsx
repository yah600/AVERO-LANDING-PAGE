import { Button, Card } from 'konsta/react'
import { Link, useLocation } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="auth-shell">
      <SectionHeading
        eyebrow="404"
        title="Page not available in this project"
        subtitle="The dashboard app is hosted in a separate project."
        center
      />
      <Card className="auth-card">
        <p className="notfound-path">Requested path: {location.pathname}</p>
        <div className="auth-actions auth-actions-stack">
          <Link to="/">
            <Button rounded className="cta-secondary">
              Back to Home
            </Button>
          </Link>
          <Link to="/signup">
            <Button rounded className="cta-primary">
              Get Access
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
