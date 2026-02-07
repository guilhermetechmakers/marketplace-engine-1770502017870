import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { placeOrder, validatePromoCode, computePriceBreakdown } from '@/api/checkout'
import type {
  CheckoutItem,
  PriceBreakdown,
  PayerDetails,
  OrderResultState,
} from '@/types/checkout-payment'
import { toast } from 'sonner'

export interface UsePaymentPageOptions {
  initialItems?: CheckoutItem[]
}

export interface UsePaymentPageReturn {
  items: CheckoutItem[]
  priceBreakdown: PriceBreakdown | null
  promoCode: string
  promoDiscount: number
  setPromoCode: (v: string) => void
  policyAccepted: boolean
  setPolicyAccepted: (v: boolean) => void
  applyPromoCode: (code: string) => void
  removePromoCode: () => void
  placeOrderMutation: (payload: {
    payerDetails: PayerDetails
    paymentMethodId?: string
  }) => void
  isPlacingOrder: boolean
  orderResultState: OrderResultState
  orderId: string | null
  orderError: string | null
  resetOrderResult: () => void
  savedPaymentMethods: { id: string; brand: string; last4: string; expiryMonth: number; expiryYear: number; isDefault?: boolean }[]
  selectedPaymentMethodId: string | null
  setSelectedPaymentMethodId: (id: string | null) => void
  validatePromoLoading: boolean
}

export function usePaymentPage(options: UsePaymentPageOptions = {}): UsePaymentPageReturn {
  const { initialItems = [] } = options
  const [items] = useState<CheckoutItem[]>(initialItems)
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [orderResultState, setOrderResultState] = useState<OrderResultState>('idle')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null)

  const priceBreakdown = items.length > 0 ? computePriceBreakdown(items, promoDiscount) : null

  const validatePromoMutation = useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      validatePromoCode(code, subtotal),
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
    mutationFn: placeOrder,
    onSuccess: (data) => {
      setOrderResultState(data.status === 'success' ? 'success' : 'failure')
      setOrderId(data.orderId ?? null)
      setOrderError(data.status !== 'success' ? 'Payment could not be processed' : null)
      if (data.status === 'success') {
        toast.success('Order placed successfully')
      } else {
        toast.error('Order failed')
      }
    },
    onError: (err: Error) => {
      setOrderResultState('failure')
      setOrderError(err.message ?? 'An error occurred')
      toast.error(err.message ?? 'Failed to place order')
    },
  })

  const applyPromoCode = useCallback(
    (code: string) => {
      setPromoCode(code)
      const subtotal = priceBreakdown?.subtotal ?? 0
      validatePromoMutation.mutate({ code, subtotal })
    },
    [priceBreakdown?.subtotal, validatePromoMutation]
  )

  const removePromoCode = useCallback(() => {
    setPromoCode('')
    setPromoDiscount(0)
  }, [])

  const placeOrderMutationFn = useCallback(
    (payload: { payerDetails: PayerDetails; paymentMethodId?: string }) => {
      if (!policyAccepted) {
        toast.error('Please accept the cancellation and refund policy')
        return
      }
      setOrderResultState('processing')
      placeOrderMutation.mutate({
        title: 'Order',
        items,
        payerDetails: payload.payerDetails,
        paymentMethodId: payload.paymentMethodId,
        promoCode: promoCode || undefined,
      })
    },
    [items, policyAccepted, promoCode, placeOrderMutation]
  )

  const resetOrderResult = useCallback(() => {
    setOrderResultState('idle')
    setOrderId(null)
    setOrderError(null)
  }, [])

  const savedPaymentMethods = [
    {
      id: 'pm_1',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2028,
      isDefault: true,
    },
  ]

  return {
    items,
    priceBreakdown,
    promoCode,
    promoDiscount,
    setPromoCode,
    policyAccepted,
    setPolicyAccepted,
    applyPromoCode,
    removePromoCode,
    placeOrderMutation: placeOrderMutationFn,
    isPlacingOrder: placeOrderMutation.isPending,
    orderResultState,
    orderId,
    orderError,
    resetOrderResult,
    savedPaymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    validatePromoLoading: validatePromoMutation.isPending,
  }
}
