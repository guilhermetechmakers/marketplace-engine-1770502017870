/** User profile verification status */
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'not_started'

/** User profile with extended fields */
export interface UserProfile {
  id: string
  userId: string
  displayName: string
  avatarUrl?: string
  phone?: string
  bio?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  verificationStatus: VerificationStatus
  verificationSubmittedAt?: string
  stripeConnected?: boolean
  createdAt: string
  updatedAt: string
}

/** User preferences */
export interface UserPreferences {
  id: string
  userId: string
  emailNotifications: boolean
  orderUpdates: boolean
  marketingEmails: boolean
  pushNotifications: boolean
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

/** Privacy settings */
export interface PrivacySettings {
  id: string
  userId: string
  profileVisibility: 'public' | 'connections' | 'private'
  showEmail: boolean
  showPhone: boolean
  showOrderHistory: boolean
  allowSearchIndexing: boolean
  createdAt: string
  updatedAt: string
}

/** Update profile payload */
export interface UpdateProfilePayload {
  displayName?: string
  avatarUrl?: string
  phone?: string
  bio?: string
  address?: UserProfile['address']
}

/** Update preferences payload */
export interface UpdatePreferencesPayload {
  emailNotifications?: boolean
  orderUpdates?: boolean
  marketingEmails?: boolean
  pushNotifications?: boolean
  twoFactorEnabled?: boolean
}

/** Update privacy payload */
export interface UpdatePrivacyPayload {
  profileVisibility?: PrivacySettings['profileVisibility']
  showEmail?: boolean
  showPhone?: boolean
  showOrderHistory?: boolean
  allowSearchIndexing?: boolean
}
