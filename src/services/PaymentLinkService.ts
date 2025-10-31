import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * X4 Protocol Fee Configuration
 *
 * The x4 Protocol collects a 1% fee on all transactions
 * This fee is automatically routed to the protocol treasury wallet:
 * 0xFb2a78e3e9491045292fb419B1C20B7E42DE13D9
 *
 * Example: $100 transaction → $1.00 protocol fee collected
 * Creators receive the remaining 99% minus any custom fees
 */
const PROTOCOL_FEE_RECIPIENT = '0xFb2a78e3e9491045292fb419B1C20B7E42DE13D9'
const PROTOCOL_FEE_PERCENT = 1 // 1% of all transactions

// Export for use in UI components
export { PROTOCOL_FEE_RECIPIENT, PROTOCOL_FEE_PERCENT }

export interface PaymentLink {
  id: string
  creator_address: string
  link_name: string
  contract_address: string
  supported_tokens: string[]
  fee_recipient?: string
  is_active: boolean
  created_at: string
  updated_at: string
  widget_theme: 'dark' | 'light' | 'minimal'
  custom_colors?: Record<string, string>
  description?: string
  metadata?: Record<string, any>
}

export interface CreatePaymentLinkInput {
  linkName: string
  contractAddress: string
  supportedTokens: string[]
  feeRecipient?: string
  theme?: 'dark' | 'light' | 'minimal'
  customColors?: Record<string, string>
  description?: string
}

export interface PaymentLinkFilters {
  creatorAddress?: string
  isActive?: boolean
  limit?: number
  offset?: number
}

export class PaymentLinkService {
  private initialized = false

  async init(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured, payment links disabled')
      return
    }
    this.initialized = true
  }

  /**
   * Create a new payment link
   */
  async createPaymentLink(
    creatorAddress: string,
    input: CreatePaymentLinkInput
  ): Promise<PaymentLink | null> {
    if (!this.initialized || !supabase) return null

    try {
      const { data, error } = await supabase
        .from('payment_links')
        .insert({
          creator_address: creatorAddress.toLowerCase(),
          link_name: input.linkName,
          contract_address: input.contractAddress,
          supported_tokens: input.supportedTokens,
          fee_recipient: input.feeRecipient?.toLowerCase(),
          widget_theme: input.theme || 'dark',
          custom_colors: input.customColors,
          description: input.description,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Failed to create payment link:', error)
      return null
    }
  }

  /**
   * Get payment links for a creator
   */
  async getCreatorLinks(
    creatorAddress: string,
    filters?: Omit<PaymentLinkFilters, 'creatorAddress'>
  ): Promise<PaymentLink[]> {
    if (!this.initialized || !supabase) return []

    try {
      let query = supabase
        .from('payment_links')
        .select('*')
        .eq('creator_address', creatorAddress.toLowerCase())

      // Apply filters
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }

      query = query.order('created_at', { ascending: false })

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        )
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Failed to fetch creator links:', error)
      return []
    }
  }

  /**
   * Get a single payment link by ID
   */
  async getPaymentLink(linkId: string): Promise<PaymentLink | null> {
    if (!this.initialized || !supabase) return null

    try {
      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .eq('id', linkId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to fetch payment link:', error)
      return null
    }
  }

  /**
   * Update payment link
   */
  async updatePaymentLink(
    linkId: string,
    creatorAddress: string,
    updates: Partial<CreatePaymentLinkInput>
  ): Promise<PaymentLink | null> {
    if (!this.initialized || !supabase) return null

    try {
      // Verify ownership
      const existing = await this.getPaymentLink(linkId)
      if (!existing || existing.creator_address !== creatorAddress.toLowerCase()) {
        throw new Error('Unauthorized: not the link owner')
      }

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }

      if (updates.linkName !== undefined) updateData.link_name = updates.linkName
      if (updates.contractAddress !== undefined) {
        updateData.contract_address = updates.contractAddress
      }
      if (updates.supportedTokens !== undefined) {
        updateData.supported_tokens = updates.supportedTokens
      }
      if (updates.feeRecipient !== undefined) {
        updateData.fee_recipient = updates.feeRecipient?.toLowerCase()
      }
      if (updates.theme !== undefined) updateData.widget_theme = updates.theme
      if (updates.customColors !== undefined) updateData.custom_colors = updates.customColors
      if (updates.description !== undefined) updateData.description = updates.description

      const { data, error } = await supabase
        .from('payment_links')
        .update(updateData)
        .eq('id', linkId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Failed to update payment link:', error)
      return null
    }
  }

  /**
   * Toggle payment link active status
   */
  async toggleLinkStatus(
    linkId: string,
    creatorAddress: string
  ): Promise<PaymentLink | null> {
    if (!this.initialized || !supabase) return null

    try {
      // Verify ownership and get current status
      const existing = await this.getPaymentLink(linkId)
      if (!existing || existing.creator_address !== creatorAddress.toLowerCase()) {
        throw new Error('Unauthorized: not the link owner')
      }

      const { data, error } = await supabase
        .from('payment_links')
        .update({
          is_active: !existing.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', linkId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Failed to toggle link status:', error)
      return null
    }
  }

  /**
   * Delete a payment link
   */
  async deletePaymentLink(
    linkId: string,
    creatorAddress: string
  ): Promise<boolean> {
    if (!this.initialized || !supabase) return false

    try {
      // Verify ownership
      const existing = await this.getPaymentLink(linkId)
      if (!existing || existing.creator_address !== creatorAddress.toLowerCase()) {
        throw new Error('Unauthorized: not the link owner')
      }

      const { error } = await supabase
        .from('payment_links')
        .delete()
        .eq('id', linkId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Failed to delete payment link:', error)
      return false
    }
  }

  /**
   * Check if a link name is available for creator
   */
  async isLinkNameAvailable(
    linkName: string,
    creatorAddress: string
  ): Promise<boolean> {
    if (!this.initialized || !supabase) return true

    try {
      const { data, error } = await supabase
        .from('payment_links')
        .select('id')
        .eq('link_name', linkName)
        .eq('creator_address', creatorAddress.toLowerCase())
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return !data
    } catch (error) {
      console.error('Failed to check link name availability:', error)
      return true
    }
  }

  /**
   * Get widget embed code for a payment link
   */
  async getWidgetEmbedCode(linkId: string): Promise<string> {
    const link = await this.getPaymentLink(linkId)
    if (!link) return ''

    return `<!-- X444 Payment Widget -->
<script src="https://x444.xyz/widget.min.js"></script>
<div id="x444-widget-${linkId}"></div>
<script>
  X444Widget.mount('x444-widget-${linkId}', {
    linkId: '${linkId}',
    theme: '${link.widget_theme}',
    ${link.custom_colors ? `customTheme: ${JSON.stringify(link.custom_colors)},` : ''}
    onSuccess: (txHash, amount) => {
      console.log('Payment successful:', txHash, amount);
    }
  });
</script>`
  }

  /**
   * Get analytics for a payment link (placeholder)
   */
  async getLinkAnalytics(linkId: string): Promise<any> {
    if (!this.initialized || !supabase) return null

    try {
      // This would query payment_transactions table once implemented
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(
          `
          id,
          amount,
          token,
          status,
          created_at
        `
        )
        .eq('payment_link_id', linkId)

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (!data) return { totalTransactions: 0, totalVolume: 0 }

      return {
        totalTransactions: data.length,
        totalVolume: data.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0),
        transactions: data,
      }
    } catch (error) {
      console.error('Failed to fetch link analytics:', error)
      return null
    }
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.initialized
  }
}

export const paymentLinkService = new PaymentLinkService()
