import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <Card className={cn('w-full shadow-card-elevated border-fresh/10', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
