import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  FolderTree,
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
import { useCategories, useCategoryMutations } from '@/hooks/use-config'
import type { Category } from '@/types/config'

function buildTree(categories: Category[], parentId: string | null): Category[] {
  return categories
    .filter((c) => c.parentId === parentId)
    .sort((a, b) => a.order - b.order)
}

export function CategoryTaxonomyPage() {
  const { data: categories = [], isLoading, isError } = useCategories()
  const mutations = useCategoryMutations()
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '' as string | null,
    isActive: true,
    order: 0,
  })

  const rootCategories = buildTree(categories, null)

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: null,
      isActive: true,
      order: 0,
    })
    setEditing(null)
    setCreating(false)
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      parentId: cat.parentId,
      isActive: cat.isActive,
      order: cat.order,
    })
  }

  const handleCreate = () => {
    setCreating(true)
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: null,
      isActive: true,
      order: rootCategories.length,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      parentId: formData.parentId || null,
      slug: formData.slug || slugify(formData.name),
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

  const parentOptions = rootCategories.filter((c) => !editing || c.id !== editing.id)

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
        <span className="font-medium text-foreground">Category Taxonomy</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Category Taxonomy
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create, edit, or delete categories and subcategories
          </p>
        </div>
        <Button onClick={handleCreate} disabled={mutations.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Categories
          </CardTitle>
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
                Failed to load categories
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
              <FolderTree className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">
                No categories yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first category to get started
              </p>
              <Button className="mt-4" onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10" />
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootCategories.map((cat) => {
                    const children = buildTree(categories, cat.id)
                    return (
                      <React.Fragment key={cat.id}>
                        <TableRow
                          key={cat.id}
                          className="transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{cat.name}</div>
                            {cat.description && (
                              <div className="text-sm text-muted-foreground">
                                {cat.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              {cat.slug}
                            </code>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            —
                          </TableCell>
                          <TableCell>{cat.order}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cat.isActive ? 'success' : 'secondary'
                              }
                            >
                              {cat.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEdit(cat)}
                                aria-label="Edit category"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleting(cat)}
                                aria-label="Delete category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {children.map((child) => (
                          <TableRow
                            key={child.id}
                            className="bg-muted/20 transition-colors hover:bg-muted/50"
                          >
                            <TableCell>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 pl-6">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {child.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="rounded bg-muted px-2 py-1 text-xs">
                                {child.slug}
                              </code>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {cat.name}
                            </TableCell>
                            <TableCell>{child.order}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  child.isActive ? 'success' : 'secondary'
                                }
                              >
                                {child.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleEdit(child)}
                                  aria-label="Edit category"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleting(child)}
                                  aria-label="Delete category"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    )
                  })}
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
              {editing ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the category details below.'
                : 'Create a new category or subcategory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    name: e.target.value,
                    slug: p.slug || slugify(e.target.value),
                  }))
                }
                placeholder="e.g. Electronics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                placeholder="electronics"
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
                placeholder="Optional description"
              />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={formData.parentId ?? 'none'}
                  onValueChange={(v) =>
                    setFormData((p) => ({
                      ...p,
                      parentId: v === 'none' ? null : v,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None (root)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (root)</SelectItem>
                    {parentOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, isActive: v }))
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
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting &&
                `This will permanently delete "${deleting.name}". Listings in this category may be affected.`}
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
