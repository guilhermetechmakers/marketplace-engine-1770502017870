import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  Package,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Input } from '@/components/ui/input'
import {
  useSellerListings,
  useDeleteListing,
  usePublishListing,
  useUnpublishListing,
} from '@/hooks/use-listing'
import type { Listing } from '@/types/listings'

function statusBadge(status: Listing['status']) {
  const map = {
    draft: { variant: 'secondary' as const, label: 'Draft' },
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'secondary' as const, label: 'Inactive' },
    sold: { variant: 'default' as const, label: 'Sold' },
  }
  const config = map[status] ?? map.draft
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function SellerListingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Listing['status'] | 'all'>('all')
  const [deleting, setDeleting] = useState<Listing | null>(null)

  const { data: listings = [], isLoading, isError } = useSellerListings()
  const deleteMutation = useDeleteListing()
  const publishMutation = usePublishListing()
  const unpublishMutation = useUnpublishListing()

  const filtered = listings.filter((l) => {
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const hasModerationFlags = (l: Listing) =>
    l.moderationFlags?.some((f) => f.status === 'pending') ?? false

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
    } catch {
      // Handled by mutation
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Listings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your listings: edit, publish, unpublish, and respond to moderation
          </p>
        </div>
        <Link to="/dashboard/seller/create">
          <Button className="transition-transform hover:scale-[1.02]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Listings
          </CardTitle>
          <CardDescription>
            Draft, published, and archived listings
          </CardDescription>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs transition-all duration-200 focus:border-primary/50"
            />
            <div className="flex gap-2">
              {(['all', 'draft', 'active', 'inactive'] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="transition-transform hover:scale-[1.02]"
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
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
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <p className="mt-2 font-medium text-destructive">
                Failed to load listings
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">
                {listings.length === 0 ? 'No listings yet' : 'No matching listings'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {listings.length === 0
                  ? 'Create your first listing to get started'
                  : 'Try adjusting your search or filters'}
              </p>
              {listings.length === 0 && (
                <Link to="/dashboard/seller/create">
                  <Button className="mt-4 transition-transform hover:scale-[1.02]">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create your first listing
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Moderation</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((listing) => (
                      <TableRow
                        key={listing.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="font-medium">
                            <Link
                              to={`/listings/${listing.id}`}
                              className="hover:text-primary hover:underline"
                            >
                              {listing.title}
                            </Link>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {listing.category}
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(listing.status)}</TableCell>
                        <TableCell>
                          <span className="font-medium text-primary">
                            ${listing.price.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground">
                            {' '}
                            {listing.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          {hasModerationFlags(listing) ? (
                            <Badge variant="warning" className="gap-1">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Review
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/listings/${listing.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/listings/${listing.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {listing.status === 'draft' || listing.status === 'inactive' ? (
                                <DropdownMenuItem
                                  onClick={() => publishMutation.mutate(listing.id)}
                                  disabled={publishMutation.isPending}
                                >
                                  Publish
                                </DropdownMenuItem>
                              ) : listing.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => unpublishMutation.mutate(listing.id)}
                                  disabled={unpublishMutation.isPending}
                                >
                                  Unpublish
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleting(listing)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {listings.length > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Showing {filtered.length} of {listings.length} listings
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting &&
                `This will permanently delete "${deleting.title}". This action cannot be undone.`}
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
