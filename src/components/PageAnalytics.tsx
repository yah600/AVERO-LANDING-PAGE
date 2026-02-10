import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'

export default function PageAnalytics() {
  const location = useLocation()

  useEffect(() => {
    trackEvent('page_view', {
      path: location.pathname,
      title: document.title,
    })
  }, [location.pathname])

  return null
}

