import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  FileCode,
  GripVertical,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useCategories, useFieldSchemas, useFieldSchemaMutations } from '@/hooks/use-config'
import type { ListingFieldSchema, FieldType } from '@/types/config'

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'currency', label: 'Currency' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'image', label: 'Image' },
]

export function ListingSchemasPage() {
  const { data: categories = [] } = useCategories()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const { data: schemas = [], isLoading, isError } = useFieldSchemas(
    selectedCategoryId || undefined
  )
  const mutations = useFieldSchemaMutations()
  const [editing, setEditing] = useState<ListingFieldSchema | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<ListingFieldSchema | null>(null)
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    type: 'text' as FieldType,
    placeholder: '',
    description: '',
    isRequired: false,
    categoryId: '',
    order: 0,
  })

  const rootCategories = categories.filter((c) => !c.parentId)
  const categoryId = selectedCategoryId || rootCategories[0]?.id || ''

  const resetForm = () => {
    setFormData({
      key: '',
      label: '',
      type: 'text',
      placeholder: '',
      description: '',
      isRequired: false,
      categoryId: categoryId,
      order: schemas.length,
    })
    setEditing(null)
    setCreating(false)
  }

  const keyify = (label: string) =>
    label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

  const handleEdit = (schema: ListingFieldSchema) => {
    setEditing(schema)
    setFormData({
      key: schema.key,
      label: schema.label,
      type: schema.type,
      placeholder: schema.placeholder ?? '',
      description: schema.description ?? '',
      isRequired: schema.isRequired,
      categoryId: schema.categoryId,
      order: schema.order,
    })
  }

  const handleCreate = () => {
    setCreating(true)
    setFormData({
      key: '',
      label: '',
      type: 'text',
      placeholder: '',
      description: '',
      isRequired: false,
      categoryId: categoryId,
      order: schemas.length,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      key: formData.key || keyify(formData.label),
      validations: formData.isRequired
        ? [{ type: 'required' as const, message: `${formData.label} is required` }]
        : [],
    }
    try {
      if (editing) {
        await mutations.update(editing.id, payload)
      } else {
        await mutations.create(payload)
      }
      resetForm()
    } catch {
      // Handled by mutation
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await mutations.remove(deleting.id)
      setDeleting(null)
    } catch {
      // Handled by mutation
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/dashboard/admin"
          className="transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to="/dashboard/admin/config"
          className="transition-colors hover:text-foreground"
        >
          Configuration
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Listing Schemas</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Listing Field Schemas
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure fields, types, validations, and conditional logic per
            category
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={mutations.isPending || !categoryId}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Schema Fields
            </CardTitle>
            <div className="w-full sm:w-64">
              <Label className="sr-only">Category</Label>
              <Select
                value={selectedCategoryId || rootCategories[0]?.id || 'all'}
                onValueChange={(v) =>
                  setSelectedCategoryId(v === 'all' ? '' : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {rootCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="mt-2 font-medium text-destructive">
                Failed to load schemas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : schemas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
              <FileCode className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">
                No fields for this category
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add fields to define the listing form for this category
              </p>
              <Button className="mt-4" onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10" />
                    <TableHead>Field</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemas.map((schema) => (
                    <TableRow
                      key={schema.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{schema.label}</div>
                        {schema.description && (
                          <div className="text-sm text-muted-foreground">
                            {schema.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {schema.key}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{schema.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {schema.isRequired ? (
                          <Badge variant="success">Required</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{schema.order}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(schema)}
                            aria-label="Edit field"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(schema)}
                            aria-label="Delete field"
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

      {/* Create/Edit Dialog */}
      <Dialog open={creating || !!editing} onOpenChange={() => resetForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Field' : 'Add Field'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the field configuration.'
                : 'Add a new field to the listing schema.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    label: e.target.value,
                    key: p.key || keyify(e.target.value),
                  }))
                }
                placeholder="e.g. Product Title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, key: e.target.value }))
                }
                placeholder="title"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, type: v as FieldType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, placeholder: e.target.value }))
                }
                placeholder="Optional placeholder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Helper text"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isRequired">Required</Label>
              <Switch
                id="isRequired"
                checked={formData.isRequired}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, isRequired: v }))
                }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutations.isPending}>
                {editing ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete field?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting &&
                `This will remove "${deleting.label}" from the schema. Existing listing data may be affected.`}
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
