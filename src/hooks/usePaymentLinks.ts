import { useState, useCallback, useEffect } from 'react'
import {
  paymentLinkService,
  PaymentLink,
  CreatePaymentLinkInput,
} from '../services/PaymentLinkService'

export interface UsePaymentLinksReturn {
  links: PaymentLink[]
  loading: boolean
  error: string | null
  createLink: (input: CreatePaymentLinkInput) => Promise<PaymentLink | null>
  updateLink: (linkId: string, updates: Partial<CreatePaymentLinkInput>) => Promise<PaymentLink | null>
  deleteLink: (linkId: string) => Promise<boolean>
  toggleLink: (linkId: string) => Promise<PaymentLink | null>
  fetchCreatorLinks: (creatorAddress: string) => Promise<void>
  isLinkNameAvailable: (linkName: string, creatorAddress: string) => Promise<boolean>
}

export function usePaymentLinks(creatorAddress?: string): UsePaymentLinksReturn {
  const [links, setLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCreatorLinks = useCallback(
    async (address: string) => {
      if (!address) return

      setLoading(true)
      setError(null)

      try {
        const fetchedLinks = await paymentLinkService.getCreatorLinks(address, {
          limit: 50,
        })
        setLinks(fetchedLinks)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch links'
        setError(errorMsg)
        console.error('Error fetching payment links:', err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createLink = useCallback(
    async (input: CreatePaymentLinkInput): Promise<PaymentLink | null> => {
      if (!creatorAddress) {
        setError('Creator address not available')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const newLink = await paymentLinkService.createPaymentLink(creatorAddress, input)

        if (newLink) {
          setLinks((prev) => [newLink, ...prev])
        }

        return newLink
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create link'
        setError(errorMsg)
        console.error('Error creating payment link:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [creatorAddress]
  )

  const updateLink = useCallback(
    async (linkId: string, updates: Partial<CreatePaymentLinkInput>): Promise<PaymentLink | null> => {
      if (!creatorAddress) {
        setError('Creator address not available')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const updatedLink = await paymentLinkService.updatePaymentLink(
          linkId,
          creatorAddress,
          updates
        )

        if (updatedLink) {
          setLinks((prev) =>
            prev.map((link) => (link.id === linkId ? updatedLink : link))
          )
        }

        return updatedLink
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update link'
        setError(errorMsg)
        console.error('Error updating payment link:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [creatorAddress]
  )

  const deleteLink = useCallback(
    async (linkId: string): Promise<boolean> => {
      if (!creatorAddress) {
        setError('Creator address not available')
        return false
      }

      setLoading(true)
      setError(null)

      try {
        const success = await paymentLinkService.deletePaymentLink(linkId, creatorAddress)

        if (success) {
          setLinks((prev) => prev.filter((link) => link.id !== linkId))
        }

        return success
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete link'
        setError(errorMsg)
        console.error('Error deleting payment link:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    [creatorAddress]
  )

  const toggleLink = useCallback(
    async (linkId: string): Promise<PaymentLink | null> => {
      if (!creatorAddress) {
        setError('Creator address not available')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const updatedLink = await paymentLinkService.toggleLinkStatus(linkId, creatorAddress)

        if (updatedLink) {
          setLinks((prev) =>
            prev.map((link) => (link.id === linkId ? updatedLink : link))
          )
        }

        return updatedLink
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to toggle link status'
        setError(errorMsg)
        console.error('Error toggling payment link status:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [creatorAddress]
  )

  const isLinkNameAvailable = useCallback(
    async (linkName: string, address: string): Promise<boolean> => {
      try {
        return await paymentLinkService.isLinkNameAvailable(linkName, address)
      } catch (err) {
        console.error('Error checking link name availability:', err)
        return false
      }
    },
    []
  )

  // Auto-fetch links when creator address changes
  useEffect(
    () => {
      if (creatorAddress) {
        fetchCreatorLinks(creatorAddress)
      }
    },
    [creatorAddress, fetchCreatorLinks]
  )

  return {
    links,
    loading,
    error,
    createLink,
    updateLink,
    deleteLink,
    toggleLink,
    fetchCreatorLinks,
    isLinkNameAvailable,
  }
}
