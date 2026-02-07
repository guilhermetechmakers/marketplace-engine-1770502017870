import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-context'
import {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences,
  getPrivacySettings,
  updatePrivacySettings,
} from '@/api/profile'
import type { UpdateProfilePayload, UpdatePreferencesPayload, UpdatePrivacyPayload } from '@/types/profile'
import { toast } from 'sonner'

const PROFILE_KEYS = {
  base: ['profile'] as const,
  profile: (userId: string) => [...PROFILE_KEYS.base, userId] as const,
  preferences: (userId: string) => [...PROFILE_KEYS.base, userId, 'preferences'] as const,
  privacy: (userId: string) => [...PROFILE_KEYS.base, userId, 'privacy'] as const,
}

export function useProfile() {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: PROFILE_KEYS.profile(userId),
    queryFn: () => getProfile(userId, { name: user?.name, email: user?.email }),
    enabled: !!userId,
  })

  const preferencesQuery = useQuery({
    queryKey: PROFILE_KEYS.preferences(userId),
    queryFn: () => getPreferences(userId),
    enabled: !!userId,
  })

  const privacyQuery = useQuery({
    queryKey: PROFILE_KEYS.privacy(userId),
    queryFn: () => getPrivacySettings(userId),
    enabled: !!userId,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profile(userId) })
      toast.success('Profile updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update profile')
    },
  })

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: UpdatePreferencesPayload) => updatePreferences(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.preferences(userId) })
      toast.success('Preferences updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update preferences')
    },
  })

  const updatePrivacyMutation = useMutation({
    mutationFn: (payload: UpdatePrivacyPayload) => updatePrivacySettings(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.privacy(userId) })
      toast.success('Privacy settings updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update privacy settings')
    },
  })

  return {
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,
    preferences: preferencesQuery.data,
    preferencesLoading: preferencesQuery.isLoading,
    privacy: privacyQuery.data,
    privacyLoading: privacyQuery.isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileLoading: updateProfileMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutateAsync,
    updatePreferencesLoading: updatePreferencesMutation.isPending,
    updatePrivacy: updatePrivacyMutation.mutateAsync,
    updatePrivacyLoading: updatePrivacyMutation.isPending,
  }
}
