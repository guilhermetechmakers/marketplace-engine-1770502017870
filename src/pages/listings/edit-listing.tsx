import { useState, useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Path } from 'react-hook-form'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Pencil, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategorySelector } from '@/components/create-listing-page/CategorySelector'
import { SchemaFieldRenderer } from '@/components/listings/schema-field-renderer'
import { useListing, useUpdateListing, usePublishListing } from '@/hooks/use-listing'
import { useCategories, useFieldSchemas } from '@/hooks/use-config'
import { Skeleton } from '@/components/ui/skeleton'

function buildFormSchema(schemas: { key: string; type: string; isRequired: boolean }[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    categoryId: z.string().min(1, 'Select a category'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    currency: z.string().default('USD'),
    images: z.array(z.string()).default([]),
  }
  for (const s of schemas) {
    if (['title', 'categoryId', 'description', 'price', 'currency', 'images'].includes(s.key))
      continue
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

type EditListingFormValues = {
  categoryId: string
  title: string
  description?: string
  price?: number
  currency?: string
  images?: string[]
  [key: string]: unknown
}

export function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listing, isLoading: listingLoading, isError } = useListing(id)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const [categoryId, setCategoryId] = useState('')
  const { data: schemas = [] } = useFieldSchemas(categoryId || undefined)
  const updateMutation = useUpdateListing(id)
  const publishMutation = usePublishListing()

  const schemaFields = useMemo(
    () => schemas.filter((s) => !['title', 'categoryId'].includes(s.key)).sort((a, b) => a.order - b.order),
    [schemas]
  )
  const formSchema = useMemo(() => buildFormSchema(schemas), [schemas])

  const form = useForm<EditListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      price: 0,
      currency: 'USD',
      images: [],
    },
  })

  const { register, handleSubmit, formState: { errors }, control, reset } = form

  useEffect(() => {
    if (listing && categories.length > 0) {
      const catId =
        listing.categoryId ??
        categories.find((c) => c.slug === listing.category || c.id === listing.category)?.id ??
        listing.category
      setCategoryId(catId)
      reset({
        categoryId: catId,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency || 'USD',
        images: listing.images ?? [],
        ...(listing.attributes ?? {}),
      })
    }
  }, [listing, categories, reset])

  const onSubmit = async (data: EditListingFormValues) => {
    if (!id) return
    const attributes: Record<string, unknown> = {}
    for (const f of schemaFields) {
      if (!['description', 'price', 'currency', 'images'].includes(f.key)) {
        const v = data[f.key]
        if (v !== undefined && v !== '') attributes[f.key] = v
      }
    }
    try {
      await updateMutation.mutateAsync({
        title: data.title,
        description: String(data.description ?? ''),
        price: Number(data.price ?? 0),
        currency: String(data.currency ?? 'USD'),
        images: Array.isArray(data.images) ? data.images : [],
        status: 'draft',
        ...attributes,
      })
      navigate('/dashboard/seller/listings')
    } catch {
      // Handled by mutation
    }
  }

  const handlePublish = async () => {
    if (!id) return
    try {
      await publishMutation.mutateAsync(id)
      navigate('/dashboard/seller/listings')
    } catch {
      // Handled by mutation
    }
  }

  const isSubmitting = updateMutation.isPending || publishMutation.isPending

  if (listingLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-medium text-foreground">Listing not found</p>
          <Link to="/dashboard/seller/listings">
            <Button variant="outline" className="mt-4">
              Back to Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
        <Link
          to={`/listings/${id}`}
          className="transition-colors hover:text-foreground"
        >
          {listing.title}
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Edit</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Listing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update your listing details below. Save as draft or publish.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Listing Details
            </CardTitle>
            <CardDescription>
              Schema-driven form with your listing data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <CategorySelector
                  categories={categories}
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  isLoading={categoriesLoading}
                  error={errors.categoryId?.message as string | undefined}
                  disabled
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
            {schemaFields.length === 0 ? (
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
                {schemaFields.map((schema) => (
                  <SchemaFieldRenderer
                    key={schema.id}
                    schema={schema}
                    control={control}
                    name={schema.key as Path<EditListingFormValues>}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="transition-transform hover:scale-[1.02]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="outline"
              className="transition-transform hover:scale-[1.02]"
            >
              Save Draft
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handlePublish}
              className="transition-transform hover:scale-[1.02]"
            >
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
