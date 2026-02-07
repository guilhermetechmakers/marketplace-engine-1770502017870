import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as listingsApi from '@/api/listings'

const LISTINGS_KEY = ['listings']

export function useCreateListing() {
  const queryClient = useQueryClient()

  const createDraft = useMutation({
    mutationFn: async (data: Parameters<typeof listingsApi.createListing>[0]) => {
      const listing = await listingsApi.createListing({ ...data, status: 'draft' })
      try {
        await listingsApi.createListingPageRecord({
          title: data.title,
          description: data.description,
          status: 'draft',
        })
      } catch {
        // Non-blocking: listing created, tracking record optional
      }
      return listing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_KEY })
      toast.success('Draft saved')
    },
    onError: () => toast.error('Failed to save draft'),
  })

  const createPublish = useMutation({
    mutationFn: async (data: Parameters<typeof listingsApi.createListing>[0]) => {
      const listing = await listingsApi.createListing({ ...data, status: 'active' })
      try {
        await listingsApi.createListingPageRecord({
          title: data.title,
          description: data.description,
          status: 'active',
        })
      } catch {
        // Non-blocking: listing created, tracking record optional
      }
      return listing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_KEY })
      toast.success('Listing published')
    },
    onError: () => toast.error('Failed to publish listing'),
  })

  return {
    createDraft: createDraft.mutateAsync,
    createPublish: createPublish.mutateAsync,
    isDraftPending: createDraft.isPending,
    isPublishPending: createPublish.isPending,
  }
}
