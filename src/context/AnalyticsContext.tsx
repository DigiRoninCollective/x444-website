import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import { analyticsService } from '../services/SupabaseService'

interface AnalyticsContextType {
  isReady: boolean
  trackEvent: (eventType: string, eventData?: any) => Promise<void>
  logError: (error: Error, component: string) => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false)

  // Initialize analytics service on mount
  useEffect(() => {
    // Wait a moment for the service to initialize
    const timer = setTimeout(() => {
      setIsReady(analyticsService.isReady())
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const trackEvent = async (eventType: string, eventData?: any) => {
    if (!isReady) return
    await analyticsService.trackEvent(eventType, eventData)
  }

  const logError = async (error: Error, component: string) => {
    if (!isReady) return
    await analyticsService.logError(error, component)
  }

  const value: AnalyticsContextType = {
    isReady,
    trackEvent,
    logError,
  }

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

/**
 * Hook to use analytics context
 */
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}
