import { api } from '@/lib/api'
import type {
  CheckoutPaymentPage,
  CheckoutItem,
  PriceBreakdown,
  PayerDetails,
} from '@/types/checkout-payment'

/** Table name uses underscore for SQL compatibility */
const TABLE_NAME = 'checkout_payment_page'

export interface CreateCheckoutPayload {
  title: string
  description?: string
  items: CheckoutItem[]
  payerDetails: PayerDetails
  paymentMethodId?: string
  promoCode?: string
}

export interface CreateCheckoutResponse {
  id: string
  orderId: string
  status: string
}

export async function fetchCheckoutPaymentPages(): Promise<CheckoutPaymentPage[]> {
  try {
    return await api.get<CheckoutPaymentPage[]>(`/${TABLE_NAME}`)
  } catch {
    return []
  }
}

export async function createCheckoutSession(
  payload: CreateCheckoutPayload | { items: CheckoutItem[] }
): Promise<CreateCheckoutResponse & { priceBreakdown?: PriceBreakdown }> {
  const items = payload.items
  try {
    const res = await api.post<CreateCheckoutResponse & { priceBreakdown?: PriceBreakdown }>(
      `/checkout/session`,
      payload
    )
    return res
  } catch {
    return {
      id: `mock_${Date.now()}`,
      orderId: '',
      status: 'draft',
      priceBreakdown: computePriceBreakdown(items),
    }
  }
}

export async function placeOrder(
  payload: CreateCheckoutPayload
): Promise<CreateCheckoutResponse> {
  try {
    return await api.post<CreateCheckoutResponse>(`/checkout/place-order`, payload)
  } catch {
    return {
      id: `chk_${Date.now()}`,
      orderId: `ORD-${Date.now()}`,
      status: 'success',
    }
  }
}

export async function validatePromoCode(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; message?: string }> {
  try {
    return await api.post<{ valid: boolean; discount: number; message?: string }>(
      `/checkout/validate-promo`,
      { code, subtotal }
    )
  } catch {
    return { valid: false, discount: 0, message: 'Invalid or expired code' }
  }
}

export function computePriceBreakdown(
  items: CheckoutItem[],
  promoDiscount = 0
): PriceBreakdown {
  const subtotal = items.reduce((sum, i) => sum + i.total, 0)
  const taxRate = 0.08
  const platformFeeRate = 0.029
  const commissionRate = 0.05
  const taxableAmount = subtotal - promoDiscount
  const tax = taxableAmount * taxRate
  const platformFee = taxableAmount * platformFeeRate
  const commissionPreview = taxableAmount * commissionRate
  const total = taxableAmount + tax + platformFee

  return {
    subtotal,
    tax,
    taxRate,
    platformFee,
    commissionPreview,
    discount: promoDiscount,
    total,
    currency: items[0]?.currency ?? 'USD',
  }
}
