/** User roles in the marketplace */
export type UserRole = 'buyer' | 'seller' | 'operator' | 'admin'

/** Auth session stored after login */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  emailVerified?: boolean
}

/** Auth state in context */
export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

/** Login request payload */
export interface LoginPayload {
  email: string
  password: string
  role?: UserRole
  inviteCode?: string
  twoFactorCode?: string
}

/** Signup request payload */
export interface SignupPayload {
  name: string
  email: string
  password: string
  role: UserRole
  inviteCode?: string
  acceptTerms: boolean
}

/** Forgot password request payload */
export interface ForgotPasswordPayload {
  email: string
}

/** Reset password request payload */
export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

/** API auth response */
export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken?: string
}

/** OAuth provider names */
export type OAuthProvider = 'google' | 'github' | 'apple'
