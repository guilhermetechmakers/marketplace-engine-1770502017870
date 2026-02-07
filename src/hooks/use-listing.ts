import { useQuery } from '@tanstack/react-query'
import * as listingsApi from '@/api/listings'

function getMockListing(id: string) {
  return {
    id,
    title: 'Premium Product Example',
    description:
      'A high-quality product with excellent features. Perfect for everyday use. Dynamic attributes from schema. Availability calendar. Full description.',
    price: 49.99,
    currency: 'USD',
    category: 'goods',
    images: [],
    sellerId: 'seller-1',
    seller: {
      id: 'seller-1',
      name: 'Bob Seller',
      avatarUrl: undefined,
      rating: 4.8,
      verificationStatus: 'verified' as const,
    },
    status: 'active' as const,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  }
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ['listing', id],
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
