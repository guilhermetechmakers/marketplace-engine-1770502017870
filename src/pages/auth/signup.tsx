import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthCard } from '@/components/auth/auth-card'
import { signup, getAuthErrorMessage } from '@/api/auth'
import { useAuth } from '@/context/auth-context'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['buyer', 'seller', 'operator']),
  acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
})

type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'buyer',
      acceptTerms: false,
    },
  })

  const role = watch('role')

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    try {
      const res = await signup(data)
      setUser(res.user)
      toast.success('Account created successfully')
      const dashboard =
        data.role === 'operator' ? '/dashboard/admin' : `/dashboard/${data.role}`
      if (data.role === 'seller') {
        navigate('/onboarding/seller', { replace: true })
      } else {
        navigate(dashboard, { replace: true })
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        description="Join as a buyer, seller, or platform operator"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder="John Doe"
                className="pl-10"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex gap-2">
              {(['buyer', 'seller', 'operator'] as const).map((r) => (
                <label
                  key={r}
                  className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm capitalize transition-colors has-[:checked]:border-fresh has-[:checked]:bg-fresh/10 has-[:checked]:text-fresh"
                >
                  <input
                    type="radio"
                    value={r}
                    className="sr-only"
                    {...register('role')}
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={watch('acceptTerms')}
              onCheckedChange={(checked) =>
                setValue('acceptTerms', checked === true, {
                  shouldValidate: true,
                })
              }
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
              I accept the{' '}
              <Link to="/terms" className="text-fresh hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-fresh hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
          )}
          {role === 'seller' && (
            <p className="text-xs text-muted-foreground">
              After signup, you&apos;ll be guided through seller onboarding.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-fresh hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}
