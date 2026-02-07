/** Checkout / Payment page types */

export interface CheckoutPaymentPage {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

/** Checkout item (product or booking) */
export interface CheckoutItem {
  id: string
  listingId?: string
  type: 'product' | 'booking'
  title: string
  quantity: number
  unitPrice: number
  total: number
  currency: string
  imageUrl?: string
  /** For bookings: date range or time slot */
  bookingDetails?: string
  bookingDates?: { start: string; end: string }
}

/** Price breakdown */
export interface PriceBreakdown {
  subtotal: number
  tax: number
  taxRate?: number
  platformFee: number
  commissionPreview: number
  discount: number
  total: number
  currency: string
}

/** Payer/billing details */
export interface PayerDetails {
  email: string
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

/** Saved payment method */
export interface SavedPaymentMethod {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault?: boolean
}

/** Checkout flow type */
export type CheckoutFlowType = 'purchase' | 'booking' | 'inquiry'

/** Order result state */
export type OrderResultState = 'idle' | 'processing' | 'success' | 'failure'

/** Checkout step state */
export type CheckoutState =
  | 'initial'
  | 'review'
  | 'payment_method'
  | 'payer_details'
  | 'processing'
  | 'success'
  | 'failure'

/** Promo code validation result */
export interface PromoResult {
  code: string
  discountAmount?: number
  discountPercent?: number
  valid: boolean
}
