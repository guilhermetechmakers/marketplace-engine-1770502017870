import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import type { UserRole } from '@/types/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className={cn('min-h-screen bg-background p-8')}>
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <Skeleton className="h-12 w-full animate-pulse" />
          <Skeleton className="h-32 w-full animate-pulse" />
          <Skeleton className="h-32 w-full animate-pulse" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  if (requiredRole) {
    const allowedForAdmin = requiredRole === 'admin' && (user.role === 'admin' || user.role === 'operator')
    const allowed = user.role === requiredRole || allowedForAdmin
    if (!allowed) {
      const roleDashboards: Record<UserRole, string> = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        operator: '/dashboard/admin',
        admin: '/dashboard/admin',
      }
      return <Navigate to={roleDashboards[user.role] ?? fallbackPath} replace />
    }
  }

  return <>{children}</>
}
