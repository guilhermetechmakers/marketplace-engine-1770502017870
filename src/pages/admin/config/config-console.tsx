import { Link } from 'react-router-dom'
import {
  FolderTree,
  FileCode,
  DollarSign,
  Flag,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useConfigSummary } from '@/hooks/use-config'

const configCards = [
  {
    title: 'Category Taxonomy',
    description: 'Define categories, subcategories, and hierarchy',
    icon: FolderTree,
    href: '/dashboard/admin/config/taxonomy',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    borderGradient: 'border-emerald-500/20',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Listing Field Schemas',
    description: 'Configure fields, types, validations, and conditional logic',
    icon: FileCode,
    href: '/dashboard/admin/config/schemas',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    borderGradient: 'border-blue-500/20',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Fees & Commissions',
    description: 'Platform fees, listing fees, and transaction rules',
    icon: DollarSign,
    href: '/dashboard/admin/config/fees',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderGradient: 'border-amber-500/20',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Feature Flags',
    description: 'Per-marketplace toggles and policies',
    icon: Flag,
    href: '/dashboard/admin/config/feature-flags',
    gradient: 'from-violet-500/10 to-purple-500/10',
    borderGradient: 'border-violet-500/20',
    iconColor: 'text-violet-600',
  },
] as const

export function ConfigConsolePage() {
  const { data: summary, isLoading } = useConfigSummary()

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
        <span className="font-medium text-foreground">Configuration</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Configuration Console
        </h1>
        <p className="mt-2 text-muted-foreground">
          Define categories, listing schemas, fees, and feature flags that drive
          the UI and workflows
        </p>
      </div>

      {/* Bento grid layout - asymmetric card layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {configCards.map((card, index) => {
          const Icon = card.icon
          const count =
            card.title === 'Category Taxonomy'
              ? summary?.categoriesCount
              : card.title === 'Listing Field Schemas'
                ? summary?.schemasCount
                : card.title === 'Fees & Commissions'
                  ? summary?.feeRulesCount
                  : summary?.featureFlagsCount

          return (
            <Link
              key={card.href + index}
              to={card.href}
              className="group block"
            >
              <Card
                className={`relative overflow-hidden border-2 transition-all duration-300 ${card.borderGradient} hover:shadow-card-elevated hover:scale-[1.02]`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`}
                />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl bg-background/80 p-3 ${card.iconColor}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{card.title}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="flex items-center gap-2">
                      {typeof count === 'number' && (
                        <span className="text-2xl font-bold text-foreground">
                          {count}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {card.title === 'Category Taxonomy' && 'categories'}
                        {card.title === 'Listing Field Schemas' && 'fields'}
                        {card.title === 'Fees & Commissions' && 'rules'}
                        {card.title === 'Feature Flags' && 'flags'}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-2"
                  >
                    {card.title === 'Feature Flags' ||
                    card.title === 'Fees & Commissions'
                      ? 'Configure'
                      : 'Edit'}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick settings CTA */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">
                Marketplace Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                Update site name, currency, fees, and feature flags in one place
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/dashboard/admin/config/settings">Open Settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
