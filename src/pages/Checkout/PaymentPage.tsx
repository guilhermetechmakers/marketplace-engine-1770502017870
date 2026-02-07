import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import {
  OrderSummary,
  PayerDetails,
  PaymentMethods,
  PromoCodeDiscounts,
  PolicyAcceptance,
  PlaceOrderButton,
  SuccessFailureScreens,
} from '@/components/checkout-payment-page'
import { Button } from '@/components/ui/button'
import { useListing } from '@/hooks/use-listing'
import { validatePromoCode } from '@/api/checkout-payment'
import { toast } from 'sonner'
import type {
  CheckoutItem,
  CheckoutState,
  PriceBreakdown,
  PayerDetails as PayerDetailsType,
  PromoResult,
  SavedPaymentMethod,
} from '@/types/checkout-payment'
import { cn } from '@/lib/utils'

const PLATFORM_FEE_RATE = 0.03
const COMMISSION_RATE = 0.05
const TAX_RATE = 0.08

function buildMockItems(listingId: string, listingTitle: string, price: number): CheckoutItem[] {
  return [
    {
      id: 'item-1',
      listingId,
      title: listingTitle,
      quantity: 1,
      unitPrice: price,
      total: price,
      currency: 'USD',
      type: 'product',
    },
  ]
}

function buildPriceBreakdown(
  subtotal: number,
  discount: number,
  promo?: PromoResult | null
): PriceBreakdown {
  const afterDiscount = subtotal - discount
  const platformFee = Math.round(afterDiscount * PLATFORM_FEE_RATE * 100) / 100
  const commissionPreview = Math.round(afterDiscount * COMMISSION_RATE * 100) / 100
  const tax = Math.round(afterDiscount * TAX_RATE * 100) / 100
  const total = afterDiscount + tax + platformFee

  return {
    subtotal,
    discount,
    tax,
    platformFee,
    commissionPreview,
    total,
    currency: 'USD',
  }
}

export default function PaymentPage() {
  const [searchParams] = useSearchParams()
  const listingId = searchParams.get('listing') ?? ''
  const transactionType = (searchParams.get('type') as 'purchase' | 'booking') ?? 'purchase'

  const { data: listing, isLoading: listingLoading } = useListing(listingId)

  const [state, setState] = useState<CheckoutState>('initial')
  const [payerDetails, setPayerDetails] = useState<PayerDetailsType | null>(null)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [policyError, setPolicyError] = useState<string | null>(null)
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)

  const cardElementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.title = 'Checkout | Marketplace'
    return () => {
      document.title = 'Marketplace'
    }
  }, [])

  const savedCards: SavedPaymentMethod[] = useMemo(
    () => [
      { id: 'pm_1', brand: 'visa', last4: '4242', expiryMonth: 12, expiryYear: 2028, isDefault: true },
      { id: 'pm_2', brand: 'mastercard', last4: '5555', expiryMonth: 6, expiryYear: 2027 },
    ],
    []
  )

  const items = useMemo(() => {
    if (!listing) return []
    return buildMockItems(listing.id, listing.title, listing.price)
  }, [listing])

  const breakdown = useMemo(() => {
    const sub = items.reduce((s, i) => s + i.total, 0)
    const discount = appliedPromo?.valid ? appliedPromo.discountAmount ?? 0 : 0
    return buildPriceBreakdown(sub, discount, appliedPromo)
  }, [items, appliedPromo])

  const handlePayerSubmit = useCallback((data: PayerDetailsType) => {
    setPayerDetails(data)
    setState('review')
  }, [])

  const handleApplyPromo = useCallback(async (code: string) => {
    const result = await validatePromoCode(code)
    if (result.valid) {
      setAppliedPromo({
        code,
        discountAmount: result.discountAmount ?? 0,
        discountPercent: result.discountPercent,
        valid: true,
      })
      toast.success('Promo code applied')
    } else {
      throw new Error(result.message ?? 'Invalid promo code')
    }
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    if (!policyAccepted) {
      setPolicyError('You must accept the cancellation and refund policies')
      return
    }
    setPolicyError(null)

    setIsProcessing(true)
    setProcessingError(null)
    setState('processing')

    try {
      await new Promise((r) => setTimeout(r, 1500))
      const id = `ord_${Date.now()}`
      setOrderId(id)
      setState('success')
      toast.success('Order placed successfully')
    } catch (err) {
      setProcessingError(err instanceof Error ? err.message : 'Payment failed')
      setState('failure')
      toast.error('Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }, [policyAccepted])

  const handleRetry = useCallback(() => {
    setState('review')
    setProcessingError(null)
  }, [])

  if (state === 'success' || state === 'failure') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <SuccessFailureScreens
            variant={state}
            orderId={orderId ?? undefined}
            message={processingError ?? undefined}
            nextSteps={
              state === 'success'
                ? [
                    'Check your email for the order confirmation.',
                    'Track your order in the Orders section.',
                  ]
                : []
            }
            onRetry={state === 'failure' ? handleRetry : undefined}
          />
        </div>
      </div>
    )
  }

  if (!listingId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border bg-card p-12 text-center animate-fade-in">
            <p className="font-medium text-foreground">No items selected for checkout</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a listing to purchase or book, then proceed to checkout
            </p>
            <Link to="/search">
              <Button className="mt-6">Browse Listings</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (listingLoading || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-2xl bg-muted" />
            <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <nav
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/search" className="hover:text-foreground transition-colors">
            Search
          </Link>
          <span>/</span>
          <Link
            to={`/listings/${listing.id}`}
            className="hover:text-foreground transition-colors truncate max-w-[200px]"
          >
            {listing.title}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {transactionType === 'booking' ? 'Complete Booking' : 'Checkout'}
        </h1>
        <p className="text-muted-foreground mb-8">
          Review your order and complete payment securely
        </p>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <PayerDetails
              defaultValues={payerDetails ?? undefined}
              onSubmit={handlePayerSubmit}
              isLoading={isProcessing}
              className="animate-fade-in"
            />
            <PaymentMethods
              savedMethods={savedCards}
              selectedMethodId={selectedCardId}
              onSelectMethod={setSelectedCardId}
              onAddNewCard={() => setSelectedCardId(null)}
              cardElementRef={cardElementRef}
              showWalletButtons={true}
              disabled={isProcessing}
            />
            <PromoCodeDiscounts
              appliedPromo={appliedPromo}
              onApply={handleApplyPromo}
              onRemove={() => setAppliedPromo(null)}
              isLoading={isProcessing}
            />
            <PolicyAcceptance
              checked={policyAccepted}
              onChange={(v) => {
                setPolicyAccepted(v)
                setPolicyError(null)
              }}
              error={policyError ?? undefined}
              disabled={isProcessing}
            />
            <PlaceOrderButton
              onClick={handlePlaceOrder}
              isLoading={isProcessing}
              disabled={!policyAccepted || !payerDetails || isProcessing}
              label={transactionType === 'booking' ? 'Confirm Booking' : 'Place Order'}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <OrderSummary
                items={items}
                breakdown={breakdown}
                isLoading={listingLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
