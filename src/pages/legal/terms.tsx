import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-12">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Terms of Service</h1>
        <p className="mt-1 text-[#555555]">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <Card>
        <CardContent className="prose prose-sm max-w-none pt-6">
          <p>Terms of service content.</p>
        </CardContent>
      </Card>
      <Link to="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  )
}
