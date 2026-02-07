import { Link } from 'react-router-dom'
import {
  Flag,
  AlertCircle,
  ToggleLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFeatureFlags, useFeatureFlagMutations } from '@/hooks/use-config'
import type { FeatureFlag } from '@/types/config'

export function FeatureFlagsPage() {
  const { data: flags = [], isLoading, isError } = useFeatureFlags()
  const mutations = useFeatureFlagMutations()

  const handleToggle = async (flag: FeatureFlag) => {
    await mutations.update(flag.id, { isEnabled: !flag.isEnabled })
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
        <span className="font-medium text-foreground">Feature Flags</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Feature Flags</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enable or disable marketplace features per configuration
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription>
            Toggle features that drive UI and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">Failed to load feature flags</p>
              <p className="mt-1 text-xs text-muted-foreground">Please try again later</p>
            </div>
          ) : flags.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-12 text-center">
              <ToggleLeft className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">No feature flags</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Feature flags are configured in the system
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Key</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Toggle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((flag) => (
                    <TableRow key={flag.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{flag.key}</TableCell>
                      <TableCell className="font-medium">{flag.label}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {flag.description ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={flag.isEnabled ? 'success' : 'secondary'}>
                          {flag.isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={flag.isEnabled}
                          onCheckedChange={() => handleToggle(flag)}
                          disabled={mutations.isPending}
                          aria-label={`Toggle ${flag.label}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
