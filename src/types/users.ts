/** Admin user for display and management */
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'operator' | 'admin'
  emailVerified: boolean
  status: 'active' | 'suspended' | 'pending'
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  createdAt: string
  lastLoginAt?: string
}

/** Admin user search/filter params */
export interface UserSearchParams {
  search?: string
  role?: AdminUser['role']
  status?: AdminUser['status']
  page?: number
  limit?: number
}

/** Paginated users response */
export interface UsersResponse {
  users: AdminUser[]
  total: number
  page: number
  limit: number
}
