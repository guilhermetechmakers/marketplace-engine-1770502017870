/** Profile API – uses native fetch via api util */
import { api, type ApiError } from '@/lib/api'
import type {
  UserProfile,
  UserPreferences,
  PrivacySettings,
  UpdateProfilePayload,
  UpdatePreferencesPayload,
  UpdatePrivacyPayload,
} from '@/types/profile'

/** Mock profile for development when backend is unavailable */
function createMockProfile(
  userId: string,
  fallback?: { name?: string; email?: string }
): UserProfile {
  return {
    id: `profile-${userId}`,
    userId,
    displayName: fallback?.name ?? 'User',
    phone: undefined,
    bio: undefined,
    verificationStatus: 'not_started',
    stripeConnected: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/** Mock preferences */
function createMockPreferences(userId: string): UserPreferences {
  return {
    id: `prefs-${userId}`,
    userId,
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    pushNotifications: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/** Mock privacy settings */
function createMockPrivacy(userId: string): PrivacySettings {
  return {
    id: `privacy-${userId}`,
    userId,
    profileVisibility: 'connections',
    showEmail: false,
    showPhone: false,
    showOrderHistory: true,
    allowSearchIndexing: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

async function tryApi<T>(fn: () => Promise<T>, mockFallback?: () => T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (mockFallback && (err as ApiError)?.status === 404) {
      return mockFallback()
    }
    throw err
  }
}

export async function getProfile(
  userId: string,
  fallback?: { name?: string; email?: string }
): Promise<UserProfile> {
  return tryApi(
    () => api.get<UserProfile>(`/users/${userId}/profile`),
    () => createMockProfile(userId, fallback)
  )
}

export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload
): Promise<UserProfile> {
  return tryApi(
    () => api.patch<UserProfile>(`/users/${userId}/profile`, payload),
    () => ({
      ...createMockProfile(userId),
      ...payload,
      updatedAt: new Date().toISOString(),
    })
  )
}

export async function getPreferences(userId: string): Promise<UserPreferences> {
  return tryApi(
    () => api.get<UserPreferences>(`/users/${userId}/preferences`),
    () => createMockPreferences(userId)
  )
}

export async function updatePreferences(
  userId: string,
  payload: UpdatePreferencesPayload
): Promise<UserPreferences> {
  return tryApi(
    () => api.patch<UserPreferences>(`/users/${userId}/preferences`, payload),
    () => ({
      ...createMockPreferences(userId),
      ...payload,
      updatedAt: new Date().toISOString(),
    })
  )
}

export async function getPrivacySettings(userId: string): Promise<PrivacySettings> {
  return tryApi(
    () => api.get<PrivacySettings>(`/users/${userId}/privacy`),
    () => createMockPrivacy(userId)
  )
}

export async function updatePrivacySettings(
  userId: string,
  payload: UpdatePrivacyPayload
): Promise<PrivacySettings> {
  return tryApi(
    () => api.patch<PrivacySettings>(`/users/${userId}/privacy`, payload),
    () => ({
      ...createMockPrivacy(userId),
      ...payload,
      updatedAt: new Date().toISOString(),
    })
  )
}
