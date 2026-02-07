import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as listingsApi from '@/api/listings'
import type { Listing } from '@/types/listings'

const LISTING_KEYS = {
  single: (id?: string) => ['listing', id] as const,
  seller: ['listings', 'seller'] as const,
  related: (id?: string) => ['listings', id, 'related'] as const,
  reviews: (id?: string) => ['listings', id, 'reviews'] as const,
}

function getMockListing(id: string): Listing {
  return {
    id,
    title: 'Premium Product Example',
    description:
      'A high-quality product with excellent features. Perfect for everyday use. Dynamic attributes from schema. Availability calendar. Full description.',
    price: 49.99,
    currency: 'USD',
    category: 'goods',
    categoryId: '1',
    images: [] as string[],
    sellerId: 'seller-1',
    seller: {
      id: 'seller-1',
      name: 'Bob Seller',
      avatarUrl: undefined,
      rating: 4.8,
      verificationStatus: 'verified' as const,
    },
    status: 'active' as const,
    attributes: {} as Record<string, unknown>,
    moderationFlags: [],
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  }
}

function getMockSellerListings(): Listing[] {
  return [
    {
      id: '1',
      title: 'Premium Product Example',
      description: 'A high-quality product.',
      price: 49.99,
      currency: 'USD',
      category: 'goods',
      categoryId: '1',
      images: [] as string[],
      sellerId: 'seller-1',
      status: 'active' as const,
      attributes: {} as Record<string, unknown>,
      moderationFlags: [],
      createdAt: '2024-01-20T12:00:00Z',
      updatedAt: '2025-02-01T10:00:00Z',
    },
  ]
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: LISTING_KEYS.single(id),
    queryFn: async () => {
      if (!id) throw new Error('No listing ID')
      try {
        return await listingsApi.fetchListingById(id)
      } catch {
        return getMockListing(id)
      }
    },
    enabled: !!id,
  })
}

export function useRelatedListings(listingId: string | undefined, limit = 4) {
  return useQuery({
    queryKey: [...LISTING_KEYS.related(listingId), limit],
    queryFn: async () => {
      if (!listingId) return []
      try {
        return await listingsApi.fetchRelatedListings(listingId, limit)
      } catch {
        return getMockSellerListings().slice(0, limit)
      }
    },
    enabled: !!listingId,
  })
}

export function useListingReviews(listingId: string | undefined) {
  return useQuery({
    queryKey: LISTING_KEYS.reviews(listingId),
    queryFn: async () => {
      if (!listingId) return []
      try {
        return await listingsApi.fetchListingReviews(listingId)
      } catch {
        return [
          {
            id: '1',
            listingId,
            buyerId: 'b1',
            buyerName: 'Alice B.',
            rating: 5,
            title: 'Great product!',
            comment: 'Exactly as described. Fast shipping.',
            createdAt: '2025-01-15T10:00:00Z',
          },
          {
            id: '2',
            listingId,
            buyerId: 'b2',
            buyerName: 'John D.',
            rating: 4,
            title: 'Good value',
            comment: 'Works well, would buy again.',
            createdAt: '2025-01-10T14:00:00Z',
          },
        ]
      }
    },
    enabled: !!listingId,
  })
}

export function useSellerListings() {
  return useQuery({
    queryKey: LISTING_KEYS.seller,
    queryFn: async () => {
      try {
        return await listingsApi.fetchSellerListings()
      } catch {
        return getMockSellerListings()
      }
    },
  })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof listingsApi.createListing>[0]) =>
      listingsApi.createListing(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Listing created successfully')
    },
    onError: () => toast.error('Failed to create listing'),
  })
}

export function useUpdateListing(id: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof listingsApi.updateListing>[1]) =>
      listingsApi.updateListing(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.single(id) })
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Listing updated')
    },
    onError: () => toast.error('Failed to update listing'),
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listingsApi.deleteListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Listing deleted')
    },
    onError: () => toast.error('Failed to delete listing'),
  })
}

export function usePublishListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listingsApi.publishListing,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.single(data.id) })
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Listing published')
    },
    onError: () => toast.error('Failed to publish listing'),
  })
}

export function useUnpublishListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listingsApi.unpublishListing,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.single(data.id) })
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Listing unpublished')
    },
    onError: () => toast.error('Failed to unpublish listing'),
  })
}

export function useRespondToModeration(listingId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      flagId,
      message,
    }: {
      flagId: string
      message: string
    }) => listingsApi.respondToModeration(listingId!, flagId, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTING_KEYS.single(listingId) })
      qc.invalidateQueries({ queryKey: LISTING_KEYS.seller })
      toast.success('Response submitted')
    },
    onError: () => toast.error('Failed to submit response'),
  })
}
