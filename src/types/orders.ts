/** Order status values */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'disputed'
  | 'refunded'

/** Order item for display */
export interface Order {
  id: string
  listingId: string
  listingTitle: string
  listingImage?: string
  quantity: number
  price: number
  total: number
  currency: string
  status: OrderStatus
  sellerId: string
  sellerName?: string
  createdAt: string
  updatedAt: string
}

/** Order action types */
export type OrderAction = 'cancel' | 'dispute' | 'review'
