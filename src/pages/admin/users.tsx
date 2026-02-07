import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">User Management</h1>
        <p className="mt-1 text-[#555555]">Manage platform users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <Input placeholder="Search users..." className="max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
            User list with filters.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
