import { api } from '@/lib/api'
import type { CheckoutPaymentPage } from '@/types/checkout-payment'

async function tryApi<T>(fn: () => Promise<T>, mockFallback: () => T): Promise<T> {
  try {
    return await fn()
  } catch {
    return mockFallback()
  }
}

export async function fetchCheckoutPaymentPage(
  userId: string
): Promise<CheckoutPaymentPage | null> {
  return tryApi(
    async () => api.get<CheckoutPaymentPage | null>(`/checkout-payment/${userId}`),
    () => null
  )
}

export async function createCheckoutPaymentPage(
  payload: Omit<CheckoutPaymentPage, 'id' | 'created_at' | 'updated_at'>
): Promise<CheckoutPaymentPage> {
  return api.post<CheckoutPaymentPage>('/checkout-payment', payload)
}

export async function updateCheckoutPaymentPage(
  id: string,
  payload: Partial<CheckoutPaymentPage>
): Promise<CheckoutPaymentPage> {
  return api.patch<CheckoutPaymentPage>(`/checkout-payment/${id}`, payload)
}

export async function createPaymentIntent(payload: {
  items: { listingId: string; quantity: number; price: number }[]
  type: 'purchase' | 'booking'
  payerEmail: string
  promoCode?: string
}): Promise<{ clientSecret: string; orderId: string }> {
  return tryApi(
    async () =>
      api.post<{ clientSecret: string; orderId: string }>('/checkout/create-payment-intent', payload),
    () => ({
      clientSecret: 'pi_mock_' + Date.now(),
      orderId: 'ord_' + Date.now(),
    })
  )
}

export async function validatePromoCode(code: string): Promise<{
  valid: boolean
  discountAmount?: number
  discountPercent?: number
  message?: string
}> {
  return tryApi(
    async () => api.post<{ valid: boolean; discountAmount?: number; discountPercent?: number; message?: string }>(
      '/checkout/validate-promo',
      { code }
    ),
    () => ({ valid: false, message: 'Promo code not found' })
  )
}
