import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CategorySelector } from '@/components/create-listing-page/CategorySelector'
import { MultiStepForm } from '@/components/create-listing-page/MultiStepForm'
import { PreviewPanel } from '@/components/create-listing-page/PreviewPanel'
import { SaveDraftPublishButtons } from '@/components/create-listing-page/SaveDraftPublishButtons'
import { MediaManager } from '@/components/create-listing-page/MediaManager'
import { useCategories, useFieldSchemas } from '@/hooks/use-config'
import { useCreateListing } from '@/hooks/use-create-listing'
import type { MediaItem } from '@/components/create-listing-page/MediaManager'
import type { ListingFieldSchema } from '@/types/config'

const step1Schema = z.object({
  categoryId: z.string().min(1, 'Select a category'),
})

function buildDynamicSchema(schemas: ListingFieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    categoryId: z.string().min(1, 'Select a category'),
  }
  for (const s of schemas) {
    if (s.type === 'number' || s.type === 'currency') {
      shape[s.key] = s.isRequired
        ? z.number({ invalid_type_error: `${s.label} is required` })
        : z.number().optional()
    } else if (s.type === 'checkbox') {
      shape[s.key] = z.boolean().optional()
    } else if (s.type === 'multiselect' || s.type === 'availability') {
      shape[s.key] = z.array(z.string()).optional()
    } else if (s.type === 'date_range' || s.type === 'file') {
      shape[s.key] = s.isRequired
        ? z.string().min(1, `${s.label} is required`)
        : z.string().optional()
    } else {
      shape[s.key] = s.isRequired
        ? z.string().min(1, `${s.label} is required`)
        : z.string().optional()
    }
  }
  return z.object(shape)
}

export default function CreateListingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [media, setMedia] = useState<MediaItem[]>([])

  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const [categoryId, setCategoryId] = useState('')
  const { data: schemas = [], isLoading: schemasLoading } = useFieldSchemas(
    categoryId || undefined
  )

  const { createDraft, createPublish, isDraftPending, isPublishPending } =
    useCreateListing()

  useEffect(() => {
    const prevTitle = document.title
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')
    document.title = 'Create Listing | Marketplace'
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', 'Create and publish your marketplace listing with a dynamic form driven by category configuration.')
    return () => {
      document.title = prevTitle
      if (prevDesc) metaDesc?.setAttribute('content', prevDesc)
    }
  }, [])

  const dynamicSchema = useMemo(() => {
    if (schemas.length === 0) return step1Schema
    return buildDynamicSchema(schemas)
  }, [schemas])

  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      title: '',
      description: '',
      price: undefined as number | undefined,
      currency: 'USD',
      ...Object.fromEntries(
        schemas.map((s) => {
          if (s.type === 'checkbox') return [s.key, false]
          if (s.type === 'multiselect' || s.type === 'availability') return [s.key, []]
          return [s.key, '']
        })
      ),
    },
  })

  const { watch, formState: { errors } } = form
  const watched = watch()

  const imageUrls = useMemo(() => media.map((m) => m.url), [media])

  const publishChecks = useMemo(
    () => [
      { passed: !!watched.title, label: 'Title' },
      { passed: !!watched.description, label: 'Description' },
      { passed: watched.price != null && watched.price > 0, label: 'Price' },
      { passed: media.length > 0, label: 'At least one image' },
    ],
    [watched.title, watched.description, watched.price, media.length]
  )

  const onStep1Submit = (data: { categoryId: string }) => {
    setCategoryId(data.categoryId)
    form.setValue('categoryId', data.categoryId)
    setStep(2)
  }

  const onFinalSubmit = async (asDraft: boolean) => {
    const values = form.getValues()
    const payload = {
      categoryId: values.categoryId,
      title: values.title,
      description: values.description,
      price: values.price,
      currency: values.currency || 'USD',
      images: imageUrls,
      ...Object.fromEntries(
        Object.entries(values).filter(
          ([k]) => !['categoryId', 'title', 'description', 'price', 'currency'].includes(k)
        )
      ),
    }
    try {
      if (asDraft) {
        await createDraft(payload)
      } else {
        await createPublish(payload)
      }
      navigate('/dashboard/seller/listings')
    } catch {
      // Handled by mutation
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/dashboard/seller"
          className="transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <Link
          to="/dashboard/seller/listings"
          className="transition-colors hover:text-foreground"
        >
          Listings
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="font-medium text-foreground">Create Listing</span>
      </nav>
      <div>
        <Link
          to="/dashboard/seller/listings"
          className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:underline hover:text-primary/80"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to listings
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Create Listing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Multi-step listing creation driven by category schema
        </p>
      </div>

      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {step === 1 ? (
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Select Category</CardTitle>
            <CardDescription>
              Choose a category to load the dynamic form schema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const catId = form.getValues('categoryId')
                if (catId) {
                  onStep1Submit({ categoryId: catId })
                }
              }}
              className="space-y-4"
            >
              <CategorySelector
                categories={categories}
                value={form.watch('categoryId')}
                onValueChange={(v) => form.setValue('categoryId', v)}
                isLoading={categoriesLoading}
                error={errors.categoryId?.message}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!form.watch('categoryId')}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <FormProvider {...form}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <Card className="transition-all duration-300 hover:shadow-card-hover">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                  <CardDescription>
                    Fields generated from category config
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {schemasLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : (
                    <form
                      onSubmit={form.handleSubmit(() => onFinalSubmit(false))}
                      className="space-y-6"
                    >
                      <MultiStepForm schemas={schemas} errors={errors} />
                      <div className="space-y-2">
                        <h4 className="font-medium">Media</h4>
                        <MediaManager
                          media={media}
                          onMediaChange={setMedia}
                          maxFiles={10}
                          maxSizeMB={5}
                        />
                      </div>
                      <div className="flex flex-col gap-4 pt-4">
                        <SaveDraftPublishButtons
                          onSaveDraft={form.handleSubmit(() => onFinalSubmit(true))}
                          onPublish={form.handleSubmit(() => onFinalSubmit(false))}
                          isDraftLoading={isDraftPending}
                          isPublishLoading={isPublishPending}
                          publishChecks={publishChecks}
                        />
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:block">
              <PreviewPanel
                title={watched.title}
                description={watched.description}
                price={watched.price}
                currency={watched.currency}
                images={imageUrls}
                metaTitle={watched.title}
                metaDescription={watched.description}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="transition-all duration-200 hover:scale-[1.02]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </FormProvider>
      )}
    </div>
  )
}
