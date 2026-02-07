import { Link } from 'react-router-dom'
import { User, Store, ShieldCheck, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Decision page: Choose to Sign Up or Browse as Guest.
 * Entry point for users deciding whether to authenticate or browse listings.
 */
export function AuthChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint via-mint/80 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fresh/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative w-full max-w-2xl animate-fade-in">
        <h1 className="text-center text-3xl font-bold text-foreground mb-2">
          Welcome to the Marketplace
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign up to get started, or browse as a guest
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/signup">
            <Card className="h-full transition-all hover:shadow-card-elevated hover:border-fresh/30 cursor-pointer group">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fresh/10 text-fresh group-hover:bg-fresh/20 transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create an account to buy, sell, and manage your listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create Account</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/search">
            <Card className="h-full transition-all hover:shadow-card-elevated hover:border-fresh/30 cursor-pointer group">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fresh/10 text-fresh group-hover:bg-fresh/20 transition-colors">
                  <Eye className="h-6 w-6" />
                </div>
                <CardTitle>Browse as Guest</CardTitle>
                <CardDescription>
                  Explore listings without an account. Sign up later when you&apos;re ready.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse Listings
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link to="/auth/seller">
            <Card className="border-secondary transition-all hover:shadow-card-hover hover:border-fresh/20 cursor-pointer group">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fresh/10 text-fresh">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Seller?</p>
                  <p className="text-sm text-muted-foreground">Sign in or create seller account</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/auth/admin">
            <Card className="border-secondary transition-all hover:shadow-card-hover hover:border-fresh/20 cursor-pointer group">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fresh/10 text-fresh">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Admin?</p>
                  <p className="text-sm text-muted-foreground">Secure admin access</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-fresh hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
