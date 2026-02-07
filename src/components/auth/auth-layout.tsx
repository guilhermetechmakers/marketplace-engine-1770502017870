import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-mint via-mint/80 to-background',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fresh/10 via-transparent to-transparent" />
      <div className="relative w-full max-w-md animate-fade-in">{children}</div>
      <Link
        to="/"
        className="absolute top-4 left-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  )
}
