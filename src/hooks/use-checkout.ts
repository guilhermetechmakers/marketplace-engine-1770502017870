import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createCheckoutSession,
  placeOrder,
  validatePromoCode,
  computePriceBreakdown,
} from '@/api/checkout'
import type { CheckoutItem, PayerDetails } from '@/types/checkout-payment'
import { toast } from 'sonner'

const CHECKOUT_KEY = ['checkout'] as const

export function useCheckout(initialItems?: CheckoutItem[]) {
  const queryClient = useQueryClient()
  const [items] = useState<CheckoutItem[]>(initialItems ?? [])
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [policyAccepted, setPolicyAccepted] = useState(false)

  const sessionQuery = useQuery({
    queryKey: [...CHECKOUT_KEY, 'session', items],
    queryFn: () => createCheckoutSession({ items }),
    enabled: items.length > 0,
  })

  const basePriceBreakdown = sessionQuery.data?.priceBreakdown ?? (items.length > 0 ? computePriceBreakdown(items) : null)
  const priceBreakdown = items.length > 0 ? computePriceBreakdown(items, promoDiscount) : null

  const validatePromoMutation = useMutation({
    mutationFn: (code: string) => validatePromoCode(code, basePriceBreakdown?.subtotal ?? 0),
    onSuccess: (data) => {
      if (data.valid && data.discount > 0) {
        setPromoDiscount(data.discount)
        toast.success(data.message ?? 'Promo code applied')
      } else {
        setPromoDiscount(0)
        toast.error(data.message ?? 'Invalid promo code')
      }
    },
  })

  const placeOrderMutation = useMutation({
    mutationFn: (payload: { items: CheckoutItem[]; payerDetails: PayerDetails; paymentMethodId?: string; promoCode?: string }) =>
      placeOrder({
        title: 'Checkout',
        items: payload.items,
        payerDetails: payload.payerDetails,
        paymentMethodId: payload.paymentMethodId,
        promoCode: payload.promoCode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKOUT_KEY })
      toast.success('Order placed successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to place order')
    },
  })

  const applyPromoCode = useCallback(
    (code: string) => {
      setPromoCode(code)
      validatePromoMutation.mutate(code)
    },
    [validatePromoMutation]
  )

  const submitOrder = useCallback(
    (payerDetails: PayerDetails, paymentMethodId?: string) => {
      if (!policyAccepted) {
        toast.error('Please accept the cancellation and refund policy')
        return
      }
      placeOrderMutation.mutate({
        items,
        payerDetails,
        paymentMethodId,
        promoCode: promoCode || undefined,
      })
    },
    [items, policyAccepted, promoCode, placeOrderMutation]
  )

  const lastResult = placeOrderMutation.data

  return {
    items,
    priceBreakdown,
    promoCode,
    promoDiscount,
    adjustedTotal: priceBreakdown?.total ?? 0,
    policyAccepted,
    setPolicyAccepted,
    applyPromoCode,
    submitOrder,
    isLoading: sessionQuery.isLoading,
    isPlacingOrder: placeOrderMutation.isPending,
    lastResult,
    validatePromo: validatePromoMutation.mutate,
    validatePromoLoading: validatePromoMutation.isPending,
  }
}
