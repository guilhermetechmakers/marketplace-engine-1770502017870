import { api } from '@/lib/api'
import type { Order } from '@/types/orders'

function createMockOrders(): Order[] {
  return [
    {
      id: 'ord-1',
      listingId: 'lst-1',
      listingTitle: 'Sample Product',
      quantity: 1,
      price: 29.99,
      total: 29.99,
      currency: 'USD',
      status: 'processing',
      sellerId: 'sel-1',
      sellerName: 'Sample Seller',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      listingId: 'lst-2',
      listingTitle: 'Another Item',
      quantity: 2,
      price: 15.0,
      total: 30.0,
      currency: 'USD',
      status: 'delivered',
      sellerId: 'sel-2',
      sellerName: 'Other Seller',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

async function tryApi<T>(fn: () => Promise<T>, mockFallback: () => T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (mockFallback) {
      return mockFallback()
    }
    throw err
  }
}

export async function fetchOrders(params?: {
  role?: 'buyer' | 'seller'
  status?: string
}): Promise<Order[]> {
  return tryApi(
    async () => {
      const searchParams = new URLSearchParams()
      if (params?.role) searchParams.set('role', params.role)
      if (params?.status) searchParams.set('status', params.status)
      const query = searchParams.toString()
      return api.get<Order[]>(`/orders${query ? `?${query}` : ''}`)
    },
    () => createMockOrders()
  )
}

export async function cancelOrder(id: string): Promise<void> {
  await api.post(`/orders/${id}/cancel`)
}

export async function openDispute(id: string, reason: string): Promise<void> {
  await api.post(`/orders/${id}/dispute`, { reason })
}
