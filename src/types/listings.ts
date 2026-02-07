/** Moderation flag on a listing */
export interface ModerationFlag {
  id: string
  reason: string
  status: 'pending' | 'resolved' | 'rejected'
  message?: string
  createdAt: string
}

/** Listing item for display */
export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  categoryId?: string
  images: string[]
  sellerId: string
  seller?: SellerInfo
  status: 'draft' | 'active' | 'inactive' | 'sold'
  moderationFlags?: ModerationFlag[]
  attributes?: Record<string, unknown>
  viewCount?: number
  createdAt: string
  updatedAt: string
}

/** Seller info on listing detail */
export interface SellerInfo {
  id: string
  name: string
  avatarUrl?: string
  rating?: number
  verificationStatus?: 'pending' | 'verified' | 'rejected'
}

/** Payload for creating a listing */
export interface CreateListingPayload {
  title: string
  description: string
  price: number
  currency: string
  categoryId: string
  images?: string[]
  status?: 'draft' | 'active'
  attributes?: Record<string, unknown>
}

/** Payload for updating a listing */
export interface UpdateListingPayload {
  title?: string
  description?: string
  price?: number
  currency?: string
  categoryId?: string
  images?: string[]
  status?: 'draft' | 'active' | 'inactive'
  attributes?: Record<string, unknown>
}
