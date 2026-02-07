import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { login, getAuthErrorMessage } from '@/api/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  twoFactorCode: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export function AdminAuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', twoFactorCode: '' },
  })

  const twoFactorCode = watch('twoFactorCode')

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        role: 'admin',
        twoFactorCode: data.twoFactorCode || undefined,
      })
      setUser(res.user)
      toast.success('Signed in successfully')
      navigate('/dashboard/admin', { replace: true })
    } catch (err) {
      const msg = getAuthErrorMessage(err)
      if (msg.toLowerCase().includes('2fa') || msg.toLowerCase().includes('two-factor') || msg.toLowerCase().includes('two factor')) {
        setShow2FA(true)
      }
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint via-mint/80 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fresh/10 via-transparent to-transparent pointer-events-none" />
      <Card className="relative w-full max-w-md border-fresh/20 shadow-card-elevated animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fresh/10">
            <ShieldCheck className="h-6 w-6 text-fresh" />
          </div>
          <CardTitle className="text-2xl">Admin Sign In</CardTitle>
          <CardDescription>
            Secure admin access. Two-factor authentication may be required for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
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
            {(show2FA || twoFactorCode) && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="admin-2fa">Two-Factor Code</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-2fa"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="pl-10 font-mono tracking-widest"
                    maxLength={6}
                    {...register('twoFactorCode')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the code from your authenticator app.
                </p>
              </div>
            )}
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
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-fresh hover:underline">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
