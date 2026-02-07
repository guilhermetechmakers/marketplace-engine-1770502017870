import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthCard } from '@/components/auth/auth-card'
import { login, getAuthErrorMessage } from '@/api/auth'
import { useAuth } from '@/context/auth-context'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()
  const from = (location.state as { from?: string })?.from
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const res = await login({ ...data, role: 'buyer' })
      setUser(res.user)
      toast.success('Signed in successfully')
      const dashboard =
        res.user.role === 'operator' ? '/dashboard/admin' : `/dashboard/${res.user.role}`
      navigate(from ?? dashboard, { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Sign In"
        description="Enter your credentials to access your account"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Link
            to="/forgot-password"
            className="block text-sm text-fresh hover:underline"
          >
            Forgot password?
          </Link>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-fresh hover:underline">
            Sign up
          </Link>
        </p>
        <div className="mt-4 flex flex-col gap-2 border-t pt-4">
          <Link to="/auth/seller">
            <Button variant="outline" className="w-full">
              Sign in as Seller
            </Button>
          </Link>
          <Link to="/auth/operator">
            <Button variant="outline" className="w-full">
              Operator access
            </Button>
          </Link>
          <Link to="/auth/admin">
            <Button variant="outline" className="w-full">
              Admin access
            </Button>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
