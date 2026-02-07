import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthCard } from '@/components/auth/auth-card'
import { verifyEmail, getAuthErrorMessage } from '@/api/auth'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'

type Status = 'loading' | 'success' | 'failed'

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    if (!token) {
      setStatus('failed')
      return
    }
    const verify = async () => {
      try {
        const res = await verifyEmail(token)
        setUser(res.user)
        setStatus('success')
        toast.success('Email verified successfully')
      } catch (err) {
        toast.error(getAuthErrorMessage(err))
        setStatus('failed')
      }
    }
    verify()
  }, [token, setUser])

  if (status === 'loading') {
    return (
      <AuthLayout>
        <AuthCard title="" description="">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-fresh" />
            <p className="mt-4 text-muted-foreground">Verifying your email...</p>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (status === 'success') {
    return (
      <AuthLayout>
        <AuthCard title="Email Verified" description="">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fresh/10">
              <CheckCircle className="h-6 w-6 text-fresh" />
            </div>
            <p className="mt-4 text-muted-foreground">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link to="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard/buyer')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Verification Failed"
        description={
          !token
            ? 'No verification token was provided.'
            : 'Your verification link may have expired. Please request a new one.'
        }
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Link to="/login">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
