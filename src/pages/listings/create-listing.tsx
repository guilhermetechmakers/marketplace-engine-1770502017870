import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const step1Schema = z.object({
  category: z.string().min(1, 'Select a category'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
})

type Step1Form = z.infer<typeof step1Schema>

export function CreateListingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: { category: '', title: '' },
  })

  const onSubmit = async (_data: Step1Form) => {
    if (step === 1) {
      setStep(2)
      return
    }
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      window.location.href = '/dashboard/seller/listings'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link to="/dashboard/seller/listings" className="text-sm text-fresh hover:underline">
          ← Back to listings
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-[#222222]">Create Listing</h1>
        <p className="mt-1 text-[#555555]">
          Multi-step listing creation driven by category schema
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? 'bg-fresh' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>Category and title</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2"
                  {...register('category')}
                >
                  <option value="">Select category</option>
                  <option value="goods">Goods</option>
                  <option value="services">Services</option>
                  <option value="rentals">Rentals</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Listing title" {...register('title')} />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Details & Media</CardTitle>
              <CardDescription>Description, pricing, media (schema-driven)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-secondary/50 p-8 text-center text-muted-foreground">
                Dynamic form fields from category schema will render here.
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
          <Button type="submit" disabled={isLoading}>
            {step === 2 ? 'Publish' : 'Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
