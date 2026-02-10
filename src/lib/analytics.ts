type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  const data = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push(data)
    window.dispatchEvent(new CustomEvent('avero_analytics_event', { detail: data }))
  }
}

