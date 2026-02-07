import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

interface MessagingThreadAccessProps {
  sellerId: string
  sellerName?: string
  listingId?: string
  listingTitle?: string
  trigger?: React.ReactNode
}

export function MessagingThreadAccess({
  sellerName = 'Seller',
  listingTitle,
  trigger,
}: MessagingThreadAccessProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-message-seller', handler)
    return () => window.removeEventListener('open-message-seller', handler)
  }, [])

  const handleOpen = () => {
    if (!isAuthenticated) {
      toast.error('Sign in to message the seller')
      return
    }
    setIsOpen(true)
  }

  const handleSend = async () => {
    if (!message.trim()) return
    setIsSending(true)
    try {
      // TODO: api.post('/messages', { to: sellerId, listingId, message })
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Message sent! You can continue the conversation in Messages.')
      setMessage('')
      setIsOpen(false)
    } catch {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleOpen()}>
          {trigger}
        </div>
      ) : (
        <Button variant="outline" onClick={handleOpen}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Start Conversation
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {sellerName}</DialogTitle>
            <DialogDescription>
              {listingTitle
                ? `About: ${listingTitle}`
                : 'Start a conversation with the seller.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-y"
              disabled={isSending}
            />
            <Button
              className="w-full"
              onClick={handleSend}
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
