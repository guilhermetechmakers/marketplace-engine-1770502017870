import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as listingsApi from '@/api/listings'

const LISTINGS_KEY = ['listings']

export function useCreateListing() {
  const queryClient = useQueryClient()

  const createDraft = useMutation({
    mutationFn: (data: Parameters<typeof listingsApi.createListing>[0]) =>
      listingsApi.createListing({ ...data, status: 'draft' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_KEY })
      toast.success('Draft saved')
    },
    onError: () => toast.error('Failed to save draft'),
  })

  const createPublish = useMutation({
    mutationFn: (data: Parameters<typeof listingsApi.createListing>[0]) =>
      listingsApi.createListing({ ...data, status: 'active' }),
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
