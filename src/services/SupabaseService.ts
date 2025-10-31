import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface ChatMessageData {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  aiModel?: string
  responseTimeMs?: number
  voiceSynthesized?: boolean
  voicePlayed?: boolean
}

export interface VoiceQueryData {
  userQuery: string
  matchedTopic: string
  responseText: string
  voiceSynthesized?: boolean
  audioPlayed?: boolean
  cacheHit?: boolean
  generationTimeMs?: number
}

export interface EventData {
  eventType: string
  eventData?: any
}

export class SupabaseAnalyticsService {
  private sessionId: string | null = null
  private sessionFingerprint: string
  private initialized = false

  constructor() {
    this.sessionFingerprint = this.generateFingerprint()
    this.initSession()
  }

  /**
   * Generate a browser fingerprint for session tracking
   */
  private generateFingerprint(): string {
    try {
      const nav = window.navigator
      const screen = window.screen
      const data = [
        nav.userAgent,
        nav.language,
        screen.colorDepth,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
      ].join('|')

      // Simple hash
      let hash = 0
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return `fp_${Math.abs(hash)}`
    } catch (error) {
      console.warn('Failed to generate fingerprint:', error)
      return `fp_${Date.now()}`
    }
  }

  /**
   * Initialize or retrieve session
   */
  async initSession(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      console.debug('Supabase not configured, skipping session init')
      return
    }

    try {
      // Check if session exists
      const { data: existingSession, error: selectError } = await supabase!
        .from('sessions')
        .select('id')
        .eq('session_fingerprint', this.sessionFingerprint)
        .maybeSingle()

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError
      }

      if (existingSession) {
        this.sessionId = existingSession.id
        // Update last_seen_at
        await supabase!
          .from('sessions')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', this.sessionId)
      } else {
        // Create new session
        const { data: newSession, error: insertError } = await supabase!
          .from('sessions')
          .insert({
            session_fingerprint: this.sessionFingerprint,
            user_agent: navigator.userAgent,
            device_type: this.getDeviceType(),
            browser_name: this.getBrowserName(),
          })
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        if (newSession) {
          this.sessionId = newSession.id
        }
      }

      this.initialized = true
    } catch (error) {
      console.error('Session init error:', error)
      this.initialized = false
    }
  }

  /**
   * Detect device type from window width
   */
  private getDeviceType(): string {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  /**
   * Detect browser name from user agent
   */
  private getBrowserName(): string {
    const ua = navigator.userAgent
    if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome'
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
    if (ua.includes('Edge')) return 'Edge'
    return 'Other'
  }

  /**
   * Track page view
   */
  async trackPageView(path: string, title: string): Promise<void> {
    if (!this.sessionId || !isSupabaseConfigured || !supabase) return

    try {
      await supabase!.from('page_views').insert({
        session_id: this.sessionId,
        page_path: path,
        page_title: title,
      })

      // Update session stats
      await supabase!
        .from('sessions')
        .update({
          total_page_views: supabase!.rpc('increment_counter', {
            session_id: this.sessionId,
            column: 'total_page_views',
          }),
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', this.sessionId)
    } catch (error) {
      console.error('Page view tracking error:', error)
    }
  }

  /**
   * Create chat conversation
   */
  async createChatConversation(viewMode: string): Promise<string | null> {
    if (!this.sessionId || !isSupabaseConfigured || !supabase) return null

    try {
      const { data, error } = await supabase!
        .from('chat_conversations')
        .insert({
          session_id: this.sessionId,
          view_mode: viewMode,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data?.id || null
    } catch (error) {
      console.error('Conversation creation error:', error)
      return null
    }
  }

  /**
   * Track chat message
   */
  async trackChatMessage(data: ChatMessageData): Promise<void> {
    if (!this.sessionId || !isSupabaseConfigured || !supabase) return

    try {
      await supabase!.from('chat_messages').insert({
        conversation_id: data.conversationId,
        session_id: this.sessionId,
        role: data.role,
        content: data.content,
        ai_model: data.aiModel || 'groq/llama-3.3-70b',
        response_time_ms: data.responseTimeMs,
        voice_synthesized: data.voiceSynthesized || false,
        voice_played: data.voicePlayed || false,
      })
    } catch (error) {
      console.error('Chat message tracking error:', error)
    }
  }

  /**
   * Track voice query
   */
  async trackVoiceQuery(data: VoiceQueryData): Promise<void> {
    if (!this.sessionId || !isSupabaseConfigured || !supabase) return

    try {
      await supabase!.from('voice_queries').insert({
        session_id: this.sessionId,
        user_query: data.userQuery,
        matched_topic: data.matchedTopic,
        response_text: data.responseText,
        voice_synthesized: data.voiceSynthesized || false,
        audio_played: data.audioPlayed || false,
        cache_hit: data.cacheHit || false,
        generation_time_ms: data.generationTimeMs,
      })
    } catch (error) {
      console.error('Voice query tracking error:', error)
    }
  }

  /**
   * Track engagement event
   */
  async trackEvent(eventType: string, eventData?: any): Promise<void> {
    if (!this.sessionId || !isSupabaseConfigured || !supabase) return

    try {
      await supabase!.from('engagement_events').insert({
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData,
        page_path: window.location.pathname,
      })
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  /**
   * Log error
   */
  async logError(error: Error, component: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return

    try {
      await supabase!.from('error_logs').insert({
        session_id: this.sessionId,
        error_type: error.name,
        error_message: error.message,
        error_stack: error.stack,
        component,
        user_agent: navigator.userAgent,
        page_path: window.location.pathname,
      })
    } catch (err) {
      console.error('Error logging failed:', err)
    }
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.initialized && this.sessionId !== null
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId
  }
}

export const analyticsService = new SupabaseAnalyticsService()
