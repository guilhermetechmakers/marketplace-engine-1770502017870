import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Upload, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const step1Schema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
})

const step4Schema = z.object({
  category: z.string().min(1, 'Select a category'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.string().min(1, 'Enter a price'),
})

type Step1Form = z.infer<typeof step1Schema>
type Step4Form = z.infer<typeof step4Schema>

export function SellerOnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: { businessName: '', phone: '' },
  })

  const step4Form = useForm<Step4Form>({
    resolver: zodResolver(step4Schema),
    defaultValues: { category: '', title: '', price: '' },
  })

  const onStep1Submit = () => {
    if (step < 4) setStep((s) => s + 1)
  }

  const onStep4Submit = () => {
    toast.success('Your first listing has been created!')
    navigate('/dashboard/seller')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      step1Form.handleSubmit(onStep1Submit)(e)
    } else if (step === 4) {
      step4Form.handleSubmit(onStep4Submit)(e)
    } else {
      onStep1Submit()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seller Onboarding</h1>
        <p className="mt-1 text-muted-foreground">
          Profile info, KYC/verification, Stripe Connect, and your first listing
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              s <= step ? 'bg-fresh' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleFormSubmit}>
        {step === 1 && (
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Business details for your seller account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  {...step1Form.register('businessName')}
                  placeholder="Your business name"
                />
                {step1Form.formState.errors.businessName && (
                  <p className="text-sm text-destructive">
                    {step1Form.formState.errors.businessName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...step1Form.register('phone')}
                  placeholder="+1 (555) 000-0000"
                />
                {step1Form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {step1Form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>ID Verification (KYC)</CardTitle>
              <CardDescription>Upload government ID for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center transition-colors hover:border-primary/30">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, JPG, or PNG up to 10MB
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Stripe Connect</CardTitle>
              <CardDescription>Connect your bank account for payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline">
                Connect Stripe Account
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                You can complete this later from your dashboard settings.
              </p>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Create Your First Listing
              </CardTitle>
              <CardDescription>
                Add your first product or service to start selling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2"
                  {...step4Form.register('category')}
                >
                  <option value="">Select category</option>
                  <option value="goods">Goods</option>
                  <option value="services">Services</option>
                  <option value="rentals">Rentals</option>
                </select>
                {step4Form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {step4Form.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Listing title"
                  {...step4Form.register('title')}
                />
                {step4Form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {step4Form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  {...step4Form.register('price')}
                />
                {step4Form.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {step4Form.formState.errors.price.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">
            {step === 4 ? 'Complete Onboarding' : 'Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
