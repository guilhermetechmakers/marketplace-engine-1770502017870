import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Users,
  Wrench,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DashboardRole = 'buyer' | 'seller' | 'admin'

interface SidebarNavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const buyerNavItems: SidebarNavItem[] = [
  { href: '/dashboard/buyer', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/buyer/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/buyer/messages', label: 'Messages', icon: Package },
  { href: '/dashboard/buyer/settings', label: 'Settings', icon: Settings },
]

const sellerNavItems: SidebarNavItem[] = [
  { href: '/dashboard/seller', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/seller/listings', label: 'Listings', icon: Package },
  { href: '/dashboard/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/dashboard/seller/payouts', label: 'Payouts', icon: BarChart3 },
  { href: '/dashboard/seller/settings', label: 'Settings', icon: Settings },
]

const adminNavItems: SidebarNavItem[] = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/moderation', label: 'Moderation', icon: Wrench },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/config', label: 'Configuration', icon: Settings },
  { href: '/dashboard/admin/disputes', label: 'Disputes', icon: Wrench },
]

const navItemsByRole: Record<DashboardRole, SidebarNavItem[]> = {
  buyer: buyerNavItems,
  seller: sellerNavItems,
  admin: adminNavItems,
}

interface SidebarProps {
  role: DashboardRole
  collapsed?: boolean
  onToggle?: () => void
  onClose?: () => void
  className?: string
}

export function Sidebar({ role, collapsed, onToggle, onClose, className }: SidebarProps) {
  const location = useLocation()
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })

  const isCollapsed = collapsed ?? internalCollapsed
  const navItems = navItemsByRole[role]

  const handleToggle = () => {
    const next = !isCollapsed
    setInternalCollapsed(next)
    try {
      localStorage.setItem('sidebar-collapsed', String(next))
    } catch {
      // ignore
    }
    onToggle?.()
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <span className="font-semibold text-foreground">
            {role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : 'Admin'} Dashboard
          </span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
