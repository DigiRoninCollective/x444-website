import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analyticsService } from '../services/SupabaseService'

/**
 * Hook to track page views automatically
 * Call this in your main App component
 */
export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Get page title from document or route
    const title = document.title || 'x444 - HTTP 402 Payment Protocol'

    // Track the page view
    analyticsService.trackPageView(location.pathname, title)

    // Optionally track event
    analyticsService.trackEvent('page_view', {
      path: location.pathname,
      title,
      timestamp: new Date().toISOString(),
    })
  }, [location.pathname])
}
