import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategorySelector } from '@/components/create-listing-page/CategorySelector'
import { SchemaFieldRenderer } from '@/components/listings/schema-field-renderer'
import { useCategories, useFieldSchemas } from '@/hooks/use-config'
import { useCreateListing } from '@/hooks/use-listing'
import { cn } from '@/lib/utils'

const STEP1_SCHEMA = z.object({
  categoryId: z.string().min(1, 'Select a category'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
})

function buildStep2Schema(schemas: { key: string; type: string; isRequired: boolean }[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    currency: z.string().default('USD'),
    images: z.array(z.string()).default([]),
  }
  for (const s of schemas) {
    if (['title', 'categoryId'].includes(s.key)) continue
    if (shape[s.key]) continue
    if (s.type === 'number' || s.type === 'currency') {
      shape[s.key] = s.isRequired ? z.number().min(0) : z.number().optional()
    } else if (s.type === 'checkbox') {
      shape[s.key] = z.boolean().optional()
    } else {
      shape[s.key] = s.isRequired ? z.string().min(1) : z.string().optional()
    }
  }
  return z.object(shape)
}

export function CreateListingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const [categoryId, setCategoryId] = useState('')
  const { data: schemas = [], isLoading: schemasLoading } = useFieldSchemas(
    categoryId || undefined
  )
  const createMutation = useCreateListing()

  const step2Fields = useMemo(
    () => schemas.filter((s) => !['title', 'categoryId'].includes(s.key)).sort((a, b) => a.order - b.order),
    [schemas]
  )

  const step2Schema = useMemo(
    () => buildStep2Schema(step2Fields),
    [step2Fields]
  )

  const fullSchema = step === 1 ? STEP1_SCHEMA : STEP1_SCHEMA.merge(step2Schema)

  type FormValues = z.infer<typeof STEP1_SCHEMA> & {
    description?: string
    price?: number
    currency?: string
    images?: string[]
    [key: string]: unknown
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      price: 0,
      currency: 'USD',
      images: [],
    },
  })

  const { register, handleSubmit, formState: { errors }, control } = form

  const onSubmit = async (data: FormValues) => {
    if (step === 1) {
      setStep(2)
      setCategoryId(data.categoryId)
      return
    }

    const attributes: Record<string, unknown> = {}
    for (const f of step2Fields) {
      if (!['description', 'price', 'currency', 'images'].includes(f.key)) {
        const v = data[f.key as keyof FormValues]
        if (v !== undefined && v !== '') attributes[f.key] = v
      }
    }

    try {
      const listing = await createMutation.mutateAsync({
        categoryId: data.categoryId,
        title: data.title,
        description: String(data.description ?? ''),
        price: Number(data.price ?? 0),
        currency: String(data.currency ?? 'USD'),
        images: Array.isArray(data.images) ? data.images : [],
        status: 'active',
        ...attributes,
      })
      navigate(`/listings/${listing.id}`, { replace: true })
    } catch {
      // Error handled by mutation
    }
  }

  const isLoading = createMutation.isPending

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/dashboard/seller/listings"
          className="transition-colors hover:text-foreground"
        >
          Listings
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Create Listing</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Listing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Multi-step listing creation driven by category schema
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              s <= step ? 'bg-primary' : 'bg-secondary'
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basics
              </CardTitle>
              <CardDescription>
                Choose a category and give your listing a title
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <CategorySelector
                    categories={categories}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    isLoading={categoriesLoading}
                    error={errors.categoryId?.message != null ? String(errors.categoryId.message) : undefined}
                  />
                )}
              />
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Listing title"
                  className="transition-all duration-200 focus:border-primary/50"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {typeof errors.title.message === 'string'
                      ? errors.title.message
                      : ''}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in">
            <CardHeader>
              <CardTitle>Details & Media</CardTitle>
              <CardDescription>
                Description, pricing, and media from category schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {schemasLoading ? (
                <div className="space-y-4">
                  <div className="h-24 animate-pulse rounded-lg bg-muted" />
                  <div className="h-24 animate-pulse rounded-lg bg-muted" />
                  <div className="h-32 animate-pulse rounded-lg bg-muted" />
                </div>
              ) : step2Fields.length === 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm"
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {typeof errors.description.message === 'string'
                          ? errors.description.message
                          : ''}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min={0}
                      {...register('price', { valueAsNumber: true })}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">
                        {typeof errors.price.message === 'string'
                          ? errors.price.message
                          : ''}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {step2Fields.map((schema) => (
                    <SchemaFieldRenderer
                      key={schema.id}
                      schema={schema}
                      control={control}
                      name={schema.key as Path<FormValues>}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="transition-transform hover:scale-[1.02]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="transition-transform hover:scale-[1.02]"
          >
            {step === 2 ? 'Publish' : 'Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
