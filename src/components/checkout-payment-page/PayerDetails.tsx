import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PayerDetails as PayerDetailsType } from '@/types/checkout-payment'
import { payerSchema, type PayerDetailsFormData } from './payer-schema'

export { payerSchema } from './payer-schema'
export type { PayerDetailsFormData } from './payer-schema'

export function toPayerDetails(data: PayerDetailsFormData): PayerDetailsType {
  return {
    email: data.email,
    fullName: data.fullName,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: data.country,
    phone: data.phone,
  }
}

interface PayerDetailsProps {
  defaultValues?: Partial<PayerDetailsType>
  onSubmit: (data: PayerDetailsType) => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

export function PayerDetails({
  defaultValues,
  onSubmit,
  isLoading = false,
  disabled = false,
  className,
}: PayerDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PayerDetailsFormData>({
    resolver: zodResolver(payerSchema),
    defaultValues: {
      email: defaultValues?.email ?? '',
      fullName: defaultValues?.fullName ?? '',
      addressLine1: defaultValues?.addressLine1 ?? '',
      addressLine2: defaultValues?.addressLine2 ?? '',
      city: defaultValues?.city ?? '',
      state: defaultValues?.state ?? '',
      postalCode: defaultValues?.postalCode ?? '',
      country: defaultValues?.country ?? 'United States',
      phone: defaultValues?.phone ?? '',
    },
  })

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Billing &amp; Contact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => onSubmit(toPayerDetails(data)))}
          id="payer-details-form"
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={disabled || isLoading}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                disabled={disabled || isLoading}
                className={errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address line 1</Label>
            <Input
              id="addressLine1"
              placeholder="123 Main St"
              disabled={disabled}
              className={errors.addressLine1 ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('addressLine1')}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Apt 4, Suite 100"
              disabled={disabled}
              {...register('addressLine2')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                disabled={disabled || isLoading}
                className={errors.city ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('city')}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                placeholder="NY"
                disabled={disabled || isLoading}
                className={errors.state ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('state')}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                id="postalCode"
                placeholder="10001"
                disabled={disabled || isLoading}
                className={errors.postalCode ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('postalCode')}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                disabled={disabled || isLoading}
                className={errors.country ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('country')}
              />
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                disabled={disabled || isLoading}
                {...register('phone')}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
