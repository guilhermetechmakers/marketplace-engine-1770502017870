/** Listing detail page types */

export interface ListingDetailPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  listingId: string
  buyerId: string
  buyerName?: string
  rating: number
  title?: string
  comment?: string
  createdAt: string
}

export interface AvailabilitySlot {
  date: string
  available: boolean
  price?: number
}
