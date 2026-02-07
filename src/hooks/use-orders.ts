import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrders, cancelOrder, openDispute } from '@/api/orders'
import { toast } from 'sonner'

const ORDERS_KEY = ['orders'] as const

export function useOrders(params?: { role?: 'buyer' | 'seller'; status?: string }) {
  const queryClient = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: [...ORDERS_KEY, params?.role ?? 'buyer', params?.status],
    queryFn: () => fetchOrders(params),
  })

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      toast.success('Order cancelled')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to cancel order')
    },
  })

  const disputeMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      openDispute(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      toast.success('Dispute opened')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to open dispute')
    },
  })

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    cancelOrder: cancelMutation.mutateAsync,
    cancelLoading: cancelMutation.isPending,
    openDispute: (id: string, reason: string) =>
      disputeMutation.mutateAsync({ id, reason }),
    disputeLoading: disputeMutation.isPending,
  }
}
