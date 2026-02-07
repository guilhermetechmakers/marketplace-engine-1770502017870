import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as usersApi from '@/api/users'
import type { UserSearchParams } from '@/types/users'

const USERS_KEY = ['users'] as const

function getUsersQueryKey(params?: UserSearchParams) {
  return [...USERS_KEY, params ?? {}] as const
}

/** Mock users when API is unavailable */
function getMockUsersResponse() {
  return {
    users: [
      {
        id: '1',
        email: 'buyer@example.com',
        name: 'Alice Buyer',
        role: 'buyer' as const,
        emailVerified: true,
        status: 'active' as const,
        verificationStatus: 'verified' as const,
        createdAt: '2024-01-15T10:00:00Z',
        lastLoginAt: '2025-02-01T14:30:00Z',
      },
      {
        id: '2',
        email: 'seller@example.com',
        name: 'Bob Seller',
        role: 'seller' as const,
        emailVerified: true,
        status: 'active' as const,
        verificationStatus: 'verified' as const,
        createdAt: '2024-01-20T12:00:00Z',
        lastLoginAt: '2025-02-05T09:00:00Z',
      },
      {
        id: '3',
        email: 'pending@example.com',
        name: 'Carol Pending',
        role: 'seller' as const,
        emailVerified: false,
        status: 'pending' as const,
        verificationStatus: 'pending' as const,
        createdAt: '2025-02-01T08:00:00Z',
      },
    ],
    total: 3,
    page: 1,
    limit: 10,
  }
}

export function useUsers(params?: UserSearchParams) {
  return useQuery({
    queryKey: getUsersQueryKey(params),
    queryFn: async () => {
      try {
        return await usersApi.fetchUsers(params)
      } catch {
        return getMockUsersResponse()
      }
    },
  })
}

export function useUserActions() {
  const queryClient = useQueryClient()

  const suspendMutation = useMutation({
    mutationFn: usersApi.suspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
      toast.success('User suspended successfully')
    },
    onError: () => {
      toast.error('Failed to suspend user')
    },
  })

  const unsuspendMutation = useMutation({
    mutationFn: usersApi.unsuspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
      toast.success('User reactivated successfully')
    },
    onError: () => {
      toast.error('Failed to reactivate user')
    },
  })

  const verifyMutation = useMutation({
    mutationFn: usersApi.verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
      toast.success('User verified successfully')
    },
    onError: () => {
      toast.error('Failed to verify user')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: usersApi.resetUserPassword,
    onSuccess: () => {
      toast.success('Password reset link sent')
    },
    onError: () => {
      toast.error('Failed to send reset link')
    },
  })

  return {
    suspend: suspendMutation.mutateAsync,
    unsuspend: unsuspendMutation.mutateAsync,
    verify: verifyMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    isPending:
      suspendMutation.isPending ||
      unsuspendMutation.isPending ||
      verifyMutation.isPending ||
      resetPasswordMutation.isPending,
  }
}
