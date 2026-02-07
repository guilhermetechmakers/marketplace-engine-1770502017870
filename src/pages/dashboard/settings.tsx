import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Bell, Lock, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'
import { useProfile } from '@/hooks/use-profile'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types/profile'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

function verificationBadgeProps(status: VerificationStatus) {
  switch (status) {
    case 'verified':
      return { variant: 'success' as const, label: 'Verified', icon: CheckCircle }
    case 'pending':
      return { variant: 'warning' as const, label: 'Pending', icon: Loader2 }
    case 'rejected':
      return { variant: 'destructive' as const, label: 'Rejected', icon: AlertCircle }
    default:
      return { variant: 'secondary' as const, label: 'Not started', icon: AlertCircle }
  }
}

export function SettingsPage() {
  const { user } = useAuth()
  const {
    profile,
    profileLoading,
    preferences,
    preferencesLoading,
    privacy,
    privacyLoading,
    updateProfile,
    updateProfileLoading,
    updatePreferences,
    updatePreferencesLoading,
    updatePrivacy,
    updatePrivacyLoading,
  } = useProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.name ?? '',
      phone: '',
      bio: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
        addressLine1: profile.address?.line1 ?? '',
        addressLine2: profile.address?.line2 ?? '',
        city: profile.address?.city ?? '',
        state: profile.address?.state ?? '',
        postalCode: profile.address?.postalCode ?? '',
        country: profile.address?.country ?? '',
      })
    }
  }, [profile, reset])

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfile({
      displayName: data.displayName,
      phone: data.phone || undefined,
      bio: data.bio || undefined,
      address: {
        line1: data.addressLine1 || undefined,
        line2: data.addressLine2 || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postalCode: data.postalCode || undefined,
        country: data.country || undefined,
      },
    })
  }

  const verStatus = profile?.verificationStatus ?? 'not_started'
  const badgeProps = verificationBadgeProps(verStatus)
  const VerIcon = badgeProps.icon

  const dashboardPath =
    user?.role === 'admin' || user?.role === 'operator'
      ? '/dashboard/admin'
      : `/dashboard/${user?.role ?? 'buyer'}`

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to={dashboardPath} className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Settings</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile, preferences, and privacy controls
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 lg:max-w-lg">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your display name, contact details, and address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatarUrl} alt={profile?.displayName} />
                      <AvatarFallback className="text-lg">
                        {profile?.displayName?.slice(0, 2).toUpperCase() ?? user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={badgeProps.variant} className="w-fit">
                          {verStatus === 'pending' ? (
                            <VerIcon className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <VerIcon className="mr-1 h-3 w-3" />
                          )}
                          {badgeProps.label}
                        </Badge>
                        {profile?.stripeConnected && (
                          <Badge variant="success">Stripe Connected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Verification status and payout setup
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          {...register('displayName')}
                          placeholder="Your name"
                        />
                        {errors.displayName && (
                          <p className="text-sm text-destructive">
                            {errors.displayName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        {...register('bio')}
                        placeholder="Tell us about yourself"
                      />
                      {errors.bio && (
                        <p className="text-sm text-destructive">{errors.bio.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          {...register('addressLine1')}
                          placeholder="Street address"
                        />
                        <Input
                          {...register('addressLine2')}
                          placeholder="Apartment, suite, etc."
                        />
                        <Input {...register('city')} placeholder="City" />
                        <Input {...register('state')} placeholder="State / Province" />
                        <Input {...register('postalCode')} placeholder="Postal code" />
                        <Input {...register('country')} placeholder="Country" />
                      </div>
                    </div>
                    <Button type="submit" disabled={updateProfileLoading}>
                      {updateProfileLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Profile
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change password and two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Shield className="h-10 w-10 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Password & 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your account security settings
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preferencesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {[
                    {
                      key: 'emailNotifications' as const,
                      label: 'Email notifications',
                      description: 'Receive updates via email',
                    },
                    {
                      key: 'orderUpdates' as const,
                      label: 'Order updates',
                      description: 'Get notified about order status changes',
                    },
                    {
                      key: 'marketingEmails' as const,
                      label: 'Marketing emails',
                      description: 'Receive news and promotional offers',
                    },
                    {
                      key: 'pushNotifications' as const,
                      label: 'Push notifications',
                      description: 'Get push notifications on your device',
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={preferences?.[key] ?? false}
                        onCheckedChange={(checked) =>
                          updatePreferences({ [key]: checked })
                        }
                        disabled={updatePreferencesLoading}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              {privacyLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile visibility</Label>
                    <div className="flex gap-2 flex-wrap">
                      {(['public', 'connections', 'private'] as const).map((v) => (
                        <Button
                          key={v}
                          variant={privacy?.profileVisibility === v ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updatePrivacy({ profileVisibility: v })}
                          disabled={updatePrivacyLoading}
                        >
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Who can see your profile
                    </p>
                  </div>
                  <Separator />
                  {[
                    {
                      key: 'showEmail' as const,
                      label: 'Show email',
                      description: 'Display your email on your profile',
                    },
                    {
                      key: 'showPhone' as const,
                      label: 'Show phone',
                      description: 'Display your phone number',
                    },
                    {
                      key: 'showOrderHistory' as const,
                      label: 'Order history',
                      description: 'Allow others to see your order activity',
                    },
                    {
                      key: 'allowSearchIndexing' as const,
                      label: 'Search indexing',
                      description: 'Allow search engines to index your profile',
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className={cn(
                        'flex flex-col justify-between gap-4 sm:flex-row sm:items-center',
                        key !== 'allowSearchIndexing' && 'pb-4'
                      )}
                    >
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Switch
                        checked={privacy?.[key] ?? false}
                        onCheckedChange={(checked) =>
                          updatePrivacy({ [key]: checked })
                        }
                        disabled={updatePrivacyLoading}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
