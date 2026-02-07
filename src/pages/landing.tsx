import { Link } from 'react-router-dom'
import { ArrowRight, Check, Zap, Shield, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mint via-mint/80 to-background py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fresh/10 via-transparent to-transparent" />
        <div className="container relative mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#222222] animate-fade-in-up sm:text-5xl lg:text-6xl">
              Launch Your Marketplace in{' '}
              <span className="bg-gradient-to-r from-fresh to-fresh-dark bg-clip-text text-transparent">
                Minutes
              </span>
            </h1>
            <p className="mt-6 text-lg text-[#555555] animate-fade-in-up sm:text-xl" style={{ animationDelay: '100ms' }}>
              A configurable, production-ready two-sided marketplace engine. Support buyers, sellers,
              and operators with dynamic listings, Stripe Connect, and trust & safety tooling.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="h-12 px-8 text-base">
                  Create Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-[#222222]">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#555555]">
            Get your niche marketplace live in three simple steps
          </p>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                step: 1,
                title: 'Configure',
                description: 'Define your category taxonomy, listing schemas, and fees through the admin console.',
                icon: Zap,
              },
              {
                step: 2,
                title: 'Connect',
                description: 'Integrate Stripe Connect for payouts and configure search, email, and storage.',
                icon: Shield,
              },
              {
                step: 3,
                title: 'Launch',
                description: 'Go live and let buyers and sellers transact. Monitor GMV and disputes from the dashboard.',
                icon: BarChart3,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.step} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-fresh/10 text-fresh">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-secondary py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-[#222222]">Features</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#555555]">
            Everything you need to run a modern marketplace
          </p>
          <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Dynamic listing schemas per category',
              'Checkout, booking, and inquiry flows',
              'Stripe Connect payouts',
              'In-app messaging',
              'Reviews & moderation',
              'Dispute resolution',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fresh/10">
                  <Check className="h-5 w-5 text-fresh" />
                </div>
                <span className="font-medium text-[#222222]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="mx-auto max-w-2xl overflow-hidden border-fresh/20 bg-gradient-to-br from-mint to-background">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to launch?</CardTitle>
              <CardDescription>
                Join operators running photography, rentals, consulting, and digital goods
                marketplaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Link to="/signup">
                <Button size="lg">Get Started Free</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-sm text-[#555555]">© {new Date().getFullYear()} Marketplace Engine</div>
            <nav className="flex gap-6">
              <Link to="/docs" className="text-sm text-[#555555] hover:text-[#222222]">Docs</Link>
              <Link to="/privacy" className="text-sm text-[#555555] hover:text-[#222222]">Privacy</Link>
              <Link to="/terms" className="text-sm text-[#555555] hover:text-[#222222]">Terms</Link>
              <Link to="/cookies" className="text-sm text-[#555555] hover:text-[#222222]">Cookies</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
