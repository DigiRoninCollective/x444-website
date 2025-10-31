import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalytics } from '../context/AnalyticsContext'

/**
 * PageTracker Component
 * Automatically tracks page views when routes change
 * Must be placed inside Router component
 */
export default function PageTracker() {
  const location = useLocation()
  const { trackEvent, isReady } = useAnalytics()

  useEffect(() => {
    if (!isReady) return

    // Get page title from document or derive from route
    const title = document.title || 'x444 - HTTP 402 Payment Protocol'

    // Track the page view event
    trackEvent('page_view', {
      path: location.pathname,
      title,
      timestamp: new Date().toISOString(),
    })
  }, [location.pathname, trackEvent, isReady])

  return null // This component doesn't render anything
}
