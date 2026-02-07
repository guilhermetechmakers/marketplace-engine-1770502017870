import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'

export function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[#222222]">Documentation</h1>
        <p className="mt-2 text-[#555555]">API docs, onboarding guides</p>
        <Card className="mt-8">
          <CardContent className="prose prose-sm max-w-none pt-6">
            <p>Documentation content.</p>
          </CardContent>
        </Card>
        <Link to="/">
          <Button variant="outline" className="mt-8">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
