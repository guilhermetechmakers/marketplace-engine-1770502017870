import { api } from '@/lib/api'
import type { Listing } from '@/types/listings'
import type { CreateListingPage } from '@/types/create-listing'
import type { Review } from '@/types/listing-detail'

export async function fetchListingById(id: string): Promise<Listing> {
  return api.get<Listing>(`/listings/${id}`)
}

/** Fetch related listings (same category or seller) */
export async function fetchRelatedListings(
  listingId: string,
  limit?: number
): Promise<Listing[]> {
  const params = limit ? `?limit=${limit}` : ''
  return api.get<Listing[]>(`/listings/${listingId}/related${params}`)
}

/** Fetch reviews for a listing */
export async function fetchListingReviews(listingId: string): Promise<Review[]> {
  return api.get<Review[]>(`/listings/${listingId}/reviews`)
}

/** Create a new listing (draft or publish) */
export async function createListing(data: {
  categoryId: string
  title: string
  description?: string
  price?: number
  currency?: string
  status?: 'draft' | 'active'
  images?: string[]
  [key: string]: unknown
}): Promise<Listing> {
  return api.post<Listing>('/listings', data)
}

/** Update a listing */
export async function updateListing(
  id: string,
  data: Partial<{
    title: string
    description: string
    price: number
    currency: string
    status: 'draft' | 'active' | 'inactive'
    images: string[]
    [key: string]: unknown
  }>
): Promise<Listing> {
  return api.patch<Listing>(`/listings/${id}`, data)
}

/** Fetch listings for the current seller */
export async function fetchSellerListings(): Promise<Listing[]> {
  return api.get<Listing[]>('/listings/seller')
}

/** Delete a listing */
export async function deleteListing(id: string): Promise<void> {
  return api.delete(`/listings/${id}`)
}

/** Publish a listing */
export async function publishListing(id: string): Promise<Listing> {
  return api.patch<Listing>(`/listings/${id}`, { status: 'active' })
}

/** Unpublish a listing */
export async function unpublishListing(id: string): Promise<Listing> {
  return api.patch<Listing>(`/listings/${id}`, { status: 'inactive' })
}

/** Respond to moderation flag (seller) */
export async function respondToModeration(
  listingId: string,
  flagId: string,
  message: string
): Promise<Listing> {
  return api.post<Listing>(
    `/listings/${listingId}/moderation/${flagId}/respond`,
    { message }
  )
}

/** Create listing page record (for tracking) */
export async function createListingPageRecord(data: {
  title: string
  description?: string
  status?: string
}): Promise<CreateListingPage> {
  return api.post<CreateListingPage>('/create-listing-page', data)
}

/** Update create listing page record */
export async function updateListingPageRecord(
  id: string,
  data: Partial<{ title: string; description?: string; status: string }>
): Promise<CreateListingPage> {
  return api.patch<CreateListingPage>(`/create-listing-page/${id}`, data)
}
