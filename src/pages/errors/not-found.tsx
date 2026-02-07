import { Link } from 'react-router-dom'
import { Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h1 className="text-8xl font-bold text-fresh">404</h1>
      <p className="mt-4 text-xl text-[#555555]">Page not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex w-full max-w-md flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
        <Link to="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
      <div className="mt-8 flex gap-4">
        <Link to="/search">
          <Button variant="outline">Browse Listings</Button>
        </Link>
        <Link to="/dashboard/buyer">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
