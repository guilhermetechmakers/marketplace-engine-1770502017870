import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@/types/auth'
import {
  clearAuthStorage,
  getStoredUser,
  getStoredToken,
  verifySession,
  logout as apiLogout,
} from '@/api/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  logout: () => Promise<void>
  hasRole: (role: AuthUser['role']) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      clearAuthStorage()
      setUserState(null)
    }
  }, [])

  const hasRole = useCallback(
    (role: AuthUser['role']) => {
      return user?.role === role
    },
    [user]
  )

  useEffect(() => {
    const init = async () => {
      const token = getStoredToken()
      if (!token) {
        setUserState(null)
        setIsLoading(false)
        return
      }
      const stored = getStoredUser()
      if (stored) setUserState(stored)
      try {
        const verified = await verifySession()
        setUserState(verified)
      } catch {
        setUserState(null)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
