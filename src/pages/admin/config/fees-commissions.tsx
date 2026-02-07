import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import {
  Percent,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  DollarSign,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCategories, useFeeRules, useFeeRuleMutations } from '@/hooks/use-config'
import type { FeeRule } from '@/types/config'

const FEE_TYPES = [
  { value: 'percentage' as const, label: 'Percentage' },
  { value: 'fixed' as const, label: 'Fixed Amount' },
  { value: 'tiered' as const, label: 'Tiered' },
]

const APPLIES_TO = [
  { value: 'listing' as const, label: 'Listing' },
  { value: 'transaction' as const, label: 'Transaction' },
  { value: 'subscription' as const, label: 'Subscription' },
]

const feeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  type: z.enum(['percentage', 'fixed', 'tiered']),
  value: z.coerce.number().min(0, 'Value must be non-negative'),
  appliesTo: z.enum(['listing', 'transaction', 'subscription']).optional(),
  categoryId: z.string().optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  isActive: z.boolean().default(true),
})

type FeeFormData = z.infer<typeof feeSchema>

export function FeesCommissionsPage() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: categories = [] } = useCategories()
  const { data: fees = [], isLoading, isError } = useFeeRules()
  const mutations = useFeeRuleMutations()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      name: '',
      type: 'percentage',
      value: 0,
      appliesTo: 'transaction',
      isActive: true,
    },
  })

  const openCreate = () => {
    setEditingId(null)
    reset({
      name: '',
      type: 'percentage',
      value: 5,
      appliesTo: 'transaction',
      categoryId: '',
      minAmount: undefined,
      maxAmount: undefined,
      isActive: true,
    })
    setDialogOpen(true)
  }

  const openEdit = (fee: FeeRule) => {
    setEditingId(fee.id)
    reset({
      name: fee.name,
      type: fee.type,
      value: fee.value,
      appliesTo: fee.appliesTo ?? 'transaction',
      categoryId: fee.categoryId ?? '',
      minAmount: fee.minAmount,
      maxAmount: fee.maxAmount,
      isActive: fee.isActive,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: FeeFormData) => {
    const payload = {
      ...data,
      appliesTo: data.appliesTo || undefined,
      categoryId: data.categoryId || undefined,
      minAmount: data.minAmount,
      maxAmount: data.maxAmount,
    }
    if (editingId) {
      await mutations.update(editingId, payload)
    } else {
      await mutations.create(payload)
    }
    setDialogOpen(false)
    setEditingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await mutations.remove(deleteId)
    setDeleteId(null)
  }

  const formatValue = (fee: FeeRule) => {
    if (fee.type === 'percentage') return `${fee.value}%`
    return `$${fee.value.toFixed(2)}`
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/admin" className="transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/dashboard/admin/config" className="transition-colors hover:text-foreground">
          Configuration
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Fees & Commissions</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fees & Commissions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure platform fees, transaction fees, and commission rules
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Fee Rules
              </CardTitle>
              <CardDescription>
                Define how fees are calculated for listings and transactions
              </CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fee Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">Failed to load fee rules</p>
              <p className="mt-1 text-xs text-muted-foreground">Please try again later</p>
            </div>
          ) : fees.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">No fee rules</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add fee rules to define platform and transaction fees
              </p>
              <Button onClick={openCreate} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add First Fee Rule
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Applies To</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{fee.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{fee.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{formatValue(fee)}</TableCell>
                      <TableCell>{fee.appliesTo ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {fee.categoryId
                          ? categories.find((c) => c.id === fee.categoryId)?.name ?? fee.categoryId
                          : 'All'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={fee.isActive ? 'success' : 'secondary'}>
                          {fee.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8"
                            onClick={() => openEdit(fee)}
                            disabled={mutations.isPending}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(fee.id)}
                            disabled={mutations.isPending}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Fee Rule' : 'Add Fee Rule'}</DialogTitle>
            <DialogDescription>
              Configure fee type, value, and scope
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="e.g. Platform Fee" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={watch('type')} onValueChange={(v) => setValue('type', v as FeeRule['type'])}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register('value')}
                />
                {errors.value && (
                  <p className="text-sm text-destructive">{errors.value.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appliesTo">Applies To</Label>
                <Select
                  value={watch('appliesTo') ?? 'transaction'}
                  onValueChange={(v) => setValue('appliesTo', v as FeeRule['appliesTo'])}
                >
                  <SelectTrigger id="appliesTo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLIES_TO.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category (optional)</Label>
                <Select
                  value={watch('categoryId') ?? ''}
                  onValueChange={(v) => setValue('categoryId', v || undefined)}
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min Amount (optional)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="0"
                  {...register('minAmount')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Max Amount (optional)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="—"
                  {...register('maxAmount')}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="rounded border-input"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutations.isPending}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the fee rule. Existing transactions are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
