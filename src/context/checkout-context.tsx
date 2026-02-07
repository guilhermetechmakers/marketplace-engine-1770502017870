import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  CheckoutItem,
  PriceBreakdown,
  PayerDetails,
  SavedPaymentMethod,
  OrderResultState,
} from '@/types/checkout-payment'
import { computePriceBreakdown } from '@/api/checkout'

type CheckoutState = {
  items: CheckoutItem[]
  priceBreakdown: PriceBreakdown | null
  payerDetails: Partial<PayerDetails>
  selectedPaymentMethodId: string | null
  savedPaymentMethods: SavedPaymentMethod[]
  promoCode: string
  promoDiscount: number
  policyAccepted: boolean
  orderResultState: OrderResultState
  orderId: string | null
  errorMessage: string | null
}

type CheckoutAction =
  | { type: 'SET_ITEMS'; payload: CheckoutItem[] }
  | { type: 'SET_PAYER_DETAILS'; payload: Partial<PayerDetails> }
  | { type: 'SET_PAYMENT_METHOD'; payload: string | null }
  | { type: 'SET_SAVED_PAYMENT_METHODS'; payload: SavedPaymentMethod[] }
  | { type: 'INIT_SAVED_METHODS'; payload: SavedPaymentMethod[] }
  | { type: 'SET_PROMO'; payload: { code: string; discount: number } }
  | { type: 'SET_POLICY_ACCEPTED'; payload: boolean }
  | { type: 'SET_ORDER_PROCESSING' }
  | { type: 'SET_ORDER_SUCCESS'; payload: string }
  | { type: 'SET_ORDER_FAILURE'; payload: string }
  | { type: 'RESET_ORDER_RESULT' }

const initialState: CheckoutState = {
  items: [],
  priceBreakdown: null,
  payerDetails: {},
  selectedPaymentMethodId: null,
  savedPaymentMethods: [],
  promoCode: '',
  promoDiscount: 0,
  policyAccepted: false,
  orderResultState: 'idle',
  orderId: null,
  errorMessage: null,
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_ITEMS': {
      const items = action.payload
      const promoDiscount = state.promoDiscount
      const priceBreakdown = items.length
        ? computePriceBreakdown(items, promoDiscount)
        : null
      return { ...state, items, priceBreakdown }
    }
    case 'SET_PAYER_DETAILS':
      return { ...state, payerDetails: { ...state.payerDetails, ...action.payload } }
    case 'SET_PAYMENT_METHOD':
      return { ...state, selectedPaymentMethodId: action.payload }
    case 'SET_SAVED_PAYMENT_METHODS':
    case 'INIT_SAVED_METHODS':
      return { ...state, savedPaymentMethods: action.payload }
    case 'SET_PROMO': {
      const { code, discount } = action.payload
      const priceBreakdown = state.items.length
        ? computePriceBreakdown(state.items, discount)
        : state.priceBreakdown
      return {
        ...state,
        promoCode: code,
        promoDiscount: discount,
        priceBreakdown,
      }
    }
    case 'SET_POLICY_ACCEPTED':
      return { ...state, policyAccepted: action.payload }
    case 'SET_ORDER_PROCESSING':
      return {
        ...state,
        orderResultState: 'processing',
        orderId: null,
        errorMessage: null,
      }
    case 'SET_ORDER_SUCCESS':
      return {
        ...state,
        orderResultState: 'success',
        orderId: action.payload,
        errorMessage: null,
      }
    case 'SET_ORDER_FAILURE':
      return {
        ...state,
        orderResultState: 'failure',
        orderId: null,
        errorMessage: action.payload,
      }
    case 'RESET_ORDER_RESULT':
      return {
        ...state,
        orderResultState: 'idle',
        orderId: null,
        errorMessage: null,
      }
    default:
      return state
  }
}

interface CheckoutContextValue extends CheckoutState {
  setItems: (items: CheckoutItem[]) => void
  setPayerDetails: (details: Partial<PayerDetails>) => void
  setPaymentMethod: (id: string | null) => void
  setSavedPaymentMethods: (methods: SavedPaymentMethod[]) => void
  setPromo: (code: string, discount: number) => void
  setPolicyAccepted: (accepted: boolean) => void
  setOrderProcessing: () => void
  setOrderSuccess: (orderId: string) => void
  setOrderFailure: (message: string) => void
  resetOrderResult: () => void
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const setItems = useCallback((items: CheckoutItem[]) => {
    dispatch({ type: 'SET_ITEMS', payload: items })
  }, [])

  const setPayerDetails = useCallback((details: Partial<PayerDetails>) => {
    dispatch({ type: 'SET_PAYER_DETAILS', payload: details })
  }, [])

  const setPaymentMethod = useCallback((id: string | null) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: id })
  }, [])

  const setSavedPaymentMethods = useCallback((methods: SavedPaymentMethod[]) => {
    dispatch({ type: 'SET_SAVED_PAYMENT_METHODS', payload: methods })
  }, [])

  const setPromo = useCallback((code: string, discount: number) => {
    dispatch({ type: 'SET_PROMO', payload: { code, discount } })
  }, [])

  const setPolicyAccepted = useCallback((accepted: boolean) => {
    dispatch({ type: 'SET_POLICY_ACCEPTED', payload: accepted })
  }, [])

  const setOrderProcessing = useCallback(() => {
    dispatch({ type: 'SET_ORDER_PROCESSING' })
  }, [])

  const setOrderSuccess = useCallback((orderId: string) => {
    dispatch({ type: 'SET_ORDER_SUCCESS', payload: orderId })
  }, [])

  const setOrderFailure = useCallback((message: string) => {
    dispatch({ type: 'SET_ORDER_FAILURE', payload: message })
  }, [])

  const resetOrderResult = useCallback(() => {
    dispatch({ type: 'RESET_ORDER_RESULT' })
  }, [])

  const value: CheckoutContextValue = {
    ...state,
    setItems,
    setPayerDetails,
    setPaymentMethod,
    setSavedPaymentMethods,
    setPromo,
    setPolicyAccepted,
    setOrderProcessing,
    setOrderSuccess,
    setOrderFailure,
    resetOrderResult,
  }

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) {
    throw new Error('useCheckout must be used within CheckoutProvider')
  }
  return ctx
}
