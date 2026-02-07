import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'

type Status = 'loading' | 'success' | 'failed' | 'expired'

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('failed')
      return
    }
    const verify = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1500))
        setStatus('success')
      } catch {
        setStatus('failed')
      }
    }
    verify()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-fresh" />
            <p className="mt-4 text-muted-foreground">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fresh/10">
              <CheckCircle className="h-6 w-6 text-fresh" />
            </div>
            <CardTitle className="text-2xl">Email Verified</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link to="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link to="/dashboard/buyer">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
          <CardDescription>
            {!token
              ? 'No verification token was provided.'
              : 'Your verification link may have expired. Please request a new one.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link to="/login">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
