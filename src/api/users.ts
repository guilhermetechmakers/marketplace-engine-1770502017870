import { api } from '@/lib/api'
import type { AdminUser, UserSearchParams, UsersResponse } from '@/types/users'

export async function fetchUsers(params?: UserSearchParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.role) searchParams.set('role', params.role)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.page != null) searchParams.set('page', String(params.page))
  if (params?.limit != null) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()
  return api.get<UsersResponse>(`/users${query ? `?${query}` : ''}`)
}

export async function fetchUserById(id: string): Promise<AdminUser> {
  return api.get<AdminUser>(`/users/${id}`)
}

export async function suspendUser(id: string): Promise<void> {
  await api.post(`/users/${id}/suspend`)
}

export async function unsuspendUser(id: string): Promise<void> {
  await api.post(`/users/${id}/unsuspend`)
}

export async function verifyUser(id: string): Promise<void> {
  await api.post(`/users/${id}/verify`)
}

export async function resetUserPassword(id: string): Promise<{ resetLink: string }> {
  return api.post<{ resetLink: string }>(`/users/${id}/reset-password`)
}
