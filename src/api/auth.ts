/** Auth API – uses native fetch via api util */
import { api, type ApiError } from '@/lib/api'
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setAuthStorage(token: string, user: AuthResponse['user']) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

/** Mock auth for development when backend is unavailable */
function createMockUser(
  email: string,
  name: string,
  role: AuthUser['role']
): AuthUser {
  return {
    id: `mock-${Date.now()}`,
    email,
    name,
    role,
    emailVerified: true,
  }
}

async function tryApi<T>(
  fn: () => Promise<T>,
  mockFallback?: () => T
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (mockFallback && (err as ApiError)?.status === 404) {
      return mockFallback()
    }
    throw err
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return tryApi(
    async () => {
      const res = await api.post<AuthResponse>('/auth/login', payload)
      setAuthStorage(res.token, res.user)
      return res
    },
    () => {
      const user = createMockUser(
        payload.email,
        payload.email.split('@')[0],
        payload.role ?? 'buyer'
      )
      const token = `mock-token-${Date.now()}`
      setAuthStorage(token, user)
      return { user, token }
    }
  )
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  return tryApi(
    async () => {
      const res = await api.post<AuthResponse>('/auth/signup', payload)
      setAuthStorage(res.token, res.user)
      return res
    },
    () => {
      const user = createMockUser(payload.email, payload.name, payload.role)
      const token = `mock-token-${Date.now()}`
      setAuthStorage(token, user)
      return { user, token }
    }
  )
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await tryApi(
    () => api.post('/auth/forgot-password', payload),
    () => undefined
  )
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await tryApi(
    () => api.post('/auth/reset-password', payload),
    () => undefined
  )
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignore network errors on logout
  } finally {
    clearAuthStorage()
  }
}

export async function verifyEmail(token: string): Promise<AuthResponse> {
  return tryApi(
    async () => {
      const res = await api.post<AuthResponse>('/auth/verify-email', { token })
      setAuthStorage(res.token, res.user)
      return res
    },
    () => {
      const user = createMockUser('verified@example.com', 'Verified User', 'buyer')
      const t = `mock-token-${Date.now()}`
      setAuthStorage(t, user)
      return { user, token: t }
    }
  )
}

/** Verify stored token and return user if valid (for app init) */
export async function verifySession(): Promise<AuthResponse['user'] | null> {
  const token = getStoredToken()
  if (!token) return null
  try {
    const user = await api.get<AuthResponse['user']>('/auth/me')
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    return user
  } catch {
    const stored = getStoredUser()
    if (stored && token.startsWith('mock-token-')) return stored
    clearAuthStorage()
    return null
  }
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'message' in err
}

export function getAuthErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message
  if (err instanceof Error) return err.message
  return 'An unexpected error occurred. Please try again.'
}
