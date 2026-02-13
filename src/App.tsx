import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { App as KonstaApp, Button } from 'konsta/react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import ServicesPage from './pages/ServicesPage'
import IntegrationsPage from './pages/IntegrationsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'
import GlobalGrainBackground from './components/branding/GlobalGrainBackground'
import LiquidWordmarkLogo from './components/branding/LiquidWordmarkLogo'
import LiquidIconLogo from './components/branding/LiquidIconLogo'
import AveroChatWidget from './components/AveroChatWidget'
import RevealOnScroll from './components/RevealOnScroll'
import ScrollProgress from './components/ScrollProgress'
import PageAnalytics from './components/PageAnalytics'
import RouteMeta from './components/RouteMeta'
import { trackEvent } from './lib/analytics'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/services', label: 'Services' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/about', label: 'About' },
]

function SiteHeader() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const mobileMenuId = 'primary-mobile-nav'

  useEffect(() => {
    const getScrollTop = () => {
      return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }

    const updateCompact = () => {
      const threshold = location.pathname === '/' ? 24 : 12
      const next = getScrollTop() > threshold
      setIsCompact((current) => (current === next ? current : next))
    }

    const rafId = window.requestAnimationFrame(updateCompact)
    window.addEventListener('scroll', updateCompact, { passive: true })
    window.addEventListener('resize', updateCompact)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateCompact)
      window.removeEventListener('resize', updateCompact)
    }
  }, [location.pathname])

  return (
    <header className={isCompact ? 'site-header is-compact' : 'site-header'}>
      <div className="wrap">
        <div className="header-row">
          <Link to="/" className="brand header-brand">
            <span className="header-brand-wordmark-wrap" aria-hidden={isCompact}>
              <LiquidWordmarkLogo
                width={170}
                height={50}
                zoom={0.09}
                offsetX={0}
                offsetY={0}
                className="brand-logo-wordmark header-wordmark"
              />
            </span>
            <span className="header-brand-icon-wrap" aria-hidden={!isCompact}>
              <LiquidIconLogo size={34} className="brand-logo-icon header-logo-icon" />
            </span>
            <span className="visually-hidden">Avero</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <div className="header-cta-group">
              <Link to="/login" className="desktop-cta">
                <Button
                  rounded
                  tonal
                  className="cta-secondary"
                  onClick={() =>
                    trackEvent('cta_click', { cta: 'log_in', source: 'header_desktop' })
                  }
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup" className="desktop-cta">
                <Button
                  rounded
                  className="cta-primary"
                  onClick={() =>
                    trackEvent('cta_click', { cta: 'get_access', source: 'header_desktop' })
                  }
                >
                  Get Access
                </Button>
              </Link>
            </div>
            <button
              type="button"
              className="mobile-menu-button"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls={mobileMenuId}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className={isCompact ? 'quick-nav' : 'mobile-nav'}
          id={mobileMenuId}
          aria-label={isCompact ? 'Quick navigation' : 'Mobile navigation'}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="mobile-link"
            onClick={() => {
              trackEvent('cta_click', { cta: 'log_in', source: 'header_mobile' })
              setOpen(false)
            }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="mobile-link active"
            onClick={() => {
              trackEvent('cta_click', { cta: 'get_access', source: 'header_mobile' })
              setOpen(false)
            }}
          >
            Get Access
          </Link>
        </div>
      ) : null}
    </header>
  )
}

function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand-stack">
          <div className="brand footer-brand">
            <LiquidIconLogo size={36} className="brand-logo-icon footer-logo-icon" />
            <span className="visually-hidden">Avero</span>
          </div>
          <p className="footer-copy">A unified command center for marketing operations.</p>
          <p className="footer-legal">© {year} Avero. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <Link to="/features">Features</Link>
          <Link to="/services">Services</Link>
          <Link to="/integrations">Integrations</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="mailto:info@averocloud.com">info@averocloud.com</a>
          <a href="https://synergair.ai/" target="_blank" rel="noreferrer">
            Synergair
          </a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/login">Log In</Link>
          <Link
            to="/signup"
            onClick={() => trackEvent('cta_click', { cta: 'get_access', source: 'footer' })}
          >
            Get Access
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <KonstaApp theme="ios" dark className="site-shell">
        <GlobalGrainBackground />
        <ScrollProgress />
        <RevealOnScroll />
        <PageAnalytics />
        <RouteMeta />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main className="wrap main-content" id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <AveroChatWidget />
        <SiteFooter />
      </KonstaApp>
    </BrowserRouter>
  )
}
