import { Link } from 'react-router-dom'
import { RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h1 className="text-8xl font-bold text-destructive">500</h1>
      <p className="mt-4 text-xl text-[#555555]">Something went wrong</p>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;re sorry, but something went wrong on our end. Please try again or contact support.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
        <Link to="/">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
