/** Listing item for display */
export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  images: string[]
  sellerId: string
  seller?: SellerInfo
  status: 'draft' | 'active' | 'inactive' | 'sold'
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
