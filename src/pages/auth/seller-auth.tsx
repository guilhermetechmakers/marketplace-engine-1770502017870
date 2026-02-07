import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Lock, User, Loader2, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/context/auth-context'
import { login, signup, getAuthErrorMessage } from '@/api/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

type Tab = 'login' | 'signup'

export function SellerAuthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  })
  const { setValue: setSignupValue, watch: watchSignup } = signupForm

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        role: 'seller',
      })
      setUser(res.user)
      toast.success('Signed in successfully')
      navigate('/dashboard/seller', { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true)
    try {
      const res = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'seller',
        acceptTerms: data.acceptTerms,
      })
      setUser(res.user)
      toast.success('Account created successfully')
      navigate('/onboarding/seller', { replace: true })
    } catch (err) {
      toast.error(getAuthErrorMessage(err))
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
            <Store className="h-6 w-6 text-fresh" />
          </div>
          <CardTitle className="text-2xl">Seller Portal</CardTitle>
          <CardDescription>
            Sign in or create a seller account to list and manage your products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-2 rounded-lg bg-secondary p-1">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="seller-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...loginForm.register('email')}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="seller-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...loginForm.register('password')}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
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
          ) : (
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="seller-name"
                    placeholder="John Doe"
                    className="pl-10"
                    {...signupForm.register('name')}
                  />
                </div>
                {signupForm.formState.errors.name && (
                  <p className="text-sm text-destructive">{signupForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="seller-signup-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...signupForm.register('email')}
                  />
                </div>
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="seller-signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...signupForm.register('password')}
                  />
                </div>
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="seller-terms"
                  checked={watchSignup('acceptTerms')}
                  onCheckedChange={(checked) =>
                    setSignupValue('acceptTerms', checked === true, {
                      shouldValidate: true,
                    })
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="seller-terms" className="text-sm font-normal cursor-pointer">
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
              {signupForm.formState.errors.acceptTerms && (
                <p className="text-sm text-destructive">{signupForm.formState.errors.acceptTerms.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                After signup, you&apos;ll be guided through seller onboarding.
              </p>
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
          )}

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
