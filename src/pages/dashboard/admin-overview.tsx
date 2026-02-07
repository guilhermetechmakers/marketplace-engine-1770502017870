import { Link } from 'react-router-dom'
import { DollarSign, Users, Flag, Settings, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminOverviewPage() {
  const isLoading = false
  const gmv = 48920
  const activeUsers = 1240
  const flaggedContent = 12
  const openDisputes = 3

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform control center – users, content, disputes, and metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GMV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                ${gmv.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {activeUsers.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flagged Content
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">{flaggedContent}</div>
                <Link to="/dashboard/admin/moderation">
                  <Button variant="link" className="mt-2 h-auto p-0">
                    Review queue
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Disputes
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">{openDisputes}</div>
                <Link to="/dashboard/admin/disputes">
                  <Button variant="link" className="mt-2 h-auto p-0">
                    View cases
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Console</CardTitle>
            <CardDescription>
              Define taxonomy, schemas, fees, and feature flags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/admin/config">
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Open Console
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              GMV, conversion, disputes, and exports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
