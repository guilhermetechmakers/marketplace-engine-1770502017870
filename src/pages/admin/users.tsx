import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useUsers, useUserActions } from '@/hooks/use-users'
import type { AdminUser } from '@/types/users'

const ITEMS_PER_PAGE = 10
const ROLES: AdminUser['role'][] = ['buyer', 'seller', 'operator', 'admin']
const STATUSES: AdminUser['status'][] = ['active', 'suspended', 'pending']

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminUser['role'] | ''>('')
  const [statusFilter, setStatusFilter] = useState<AdminUser['status'] | ''>('')
  const [page, setPage] = useState(1)
  const [actionUser, setActionUser] = useState<AdminUser | null>(null)
  const [actionType, setActionType] = useState<'suspend' | 'unsuspend' | 'verify' | 'reset' | null>(
    null
  )

  const { data, isLoading, isError } = useUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const actions = useUserActions()

  const filteredUsers = useMemo(() => {
    const users = data?.users ?? []
    let result = users
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }
    if (roleFilter) result = result.filter((u) => u.role === roleFilter)
    if (statusFilter) result = result.filter((u) => u.status === statusFilter)
    return result
  }, [data?.users, search, roleFilter, statusFilter])

  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE) || 1
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const handleConfirmAction = async () => {
    if (!actionUser || !actionType) return
    try {
      if (actionType === 'suspend') await actions.suspend(actionUser.id)
      if (actionType === 'unsuspend') await actions.unsuspend(actionUser.id)
      if (actionType === 'verify') await actions.verify(actionUser.id)
      if (actionType === 'reset') await actions.resetPassword(actionUser.id)
    } finally {
      setActionUser(null)
      setActionType(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/admin" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Manage Users</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="mt-2 text-muted-foreground">
          Search, view, and take actions on user accounts
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="flex h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as AdminUser['role'] | '')}
            >
              <option value="">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              className="flex h-11 rounded-lg border border-input bg-background px-4 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdminUser['status'] | '')}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="mt-2 font-medium text-destructive">Failed to load users</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again later or check your connection
              </p>
              <Button variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'success'
                                : user.status === 'suspended'
                                  ? 'destructive'
                                  : 'warning'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.verificationStatus === 'verified' ? (
                            <Badge variant="success">Verified</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {user.verificationStatus ?? '—'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleDateString()
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8"
                                disabled={actions.isPending}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setActionUser(user)
                                    setActionType('suspend')
                                  }}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setActionUser(user)
                                    setActionType('unsuspend')
                                  }}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Reactivate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setActionUser(user)
                                  setActionType('verify')
                                }}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setActionUser(user)
                                  setActionType('reset')
                                }}
                              >
                                <KeyRound className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={!hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!actionUser}
        onOpenChange={(open) => {
          if (!open) {
            setActionUser(null)
            setActionType(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'suspend' && 'Suspend user?'}
              {actionType === 'unsuspend' && 'Reactivate user?'}
              {actionType === 'verify' && 'Verify user?'}
              {actionType === 'reset' && 'Send password reset?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionUser && (
                <>
                  {actionType === 'suspend' &&
                    `This will suspend ${actionUser.name} (${actionUser.email}). They will not be able to log in.`}
                  {actionType === 'unsuspend' &&
                    `This will reactivate ${actionUser.name}'s account.`}
                  {actionType === 'verify' &&
                    `Mark ${actionUser.name} as verified.`}
                  {actionType === 'reset' &&
                    `A password reset link will be sent to ${actionUser.email}.`}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
