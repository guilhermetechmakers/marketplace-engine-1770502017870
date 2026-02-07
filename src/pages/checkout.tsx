import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <h1 className="text-3xl font-bold text-[#222222]">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$49.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$49.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Card</Label>
                <Input placeholder="Stripe Elements placeholder" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="policy" />
                <Label htmlFor="policy" className="font-normal">
                  I accept the refund and cancellation policies
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Billing address</Label>
              <Input placeholder="Address" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Button className="w-full" size="lg">
        Place Order
      </Button>
    </div>
  )
}
