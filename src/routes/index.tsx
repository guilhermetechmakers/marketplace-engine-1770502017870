import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/auth/login'
import { SignupPage } from '@/pages/auth/signup'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { ResetPasswordPage } from '@/pages/auth/reset-password'
import { EmailVerificationPage } from '@/pages/auth/email-verification'
import { BuyerOverviewPage } from '@/pages/dashboard/buyer-overview'
import { BuyerOrdersPage } from '@/pages/dashboard/buyer-orders'
import { BuyerMessagesPage } from '@/pages/dashboard/buyer-messages'
import { SellerOverviewPage } from '@/pages/dashboard/seller-overview'
import { SellerListingsPage } from '@/pages/dashboard/seller-listings'
import { SellerOrdersPage } from '@/pages/dashboard/seller-orders'
import { SellerPayoutsPage } from '@/pages/dashboard/seller-payouts'
import { AdminOverviewPage } from '@/pages/dashboard/admin-overview'
import { ModerationPage } from '@/pages/admin/moderation'
import { ConfigConsolePage } from '@/pages/admin/config-console'
import { DisputesPage } from '@/pages/admin/disputes'
import { AdminUsersPage } from '@/pages/admin/users'
import { AdminAnalyticsPage } from '@/pages/admin/analytics'
import { SettingsPage } from '@/pages/dashboard/settings'
import { CreateListingPage } from '@/pages/listings/create-listing'
import { EditListingPage } from '@/pages/listings/edit-listing'
import { ListingDetailPage } from '@/pages/listings/listing-detail'
import { SearchPage } from '@/pages/listings/search'
import { CheckoutPage } from '@/pages/checkout'
import { OrdersPage } from '@/pages/orders'
import { CartPage } from '@/pages/cart'
import { SellerOnboardingPage } from '@/pages/seller-onboarding'
import { PrivacyPage } from '@/pages/legal/privacy'
import { TermsPage } from '@/pages/legal/terms'
import { CookiesPage } from '@/pages/legal/cookies'
import { NotFoundPage } from '@/pages/errors/not-found'
import { ServerErrorPage } from '@/pages/errors/server-error'
import { DocsPage } from '@/pages/docs'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/orders', element: <OrdersPage /> },
  { path: '/listings/create', element: <CreateListingPage /> },
  { path: '/listings/:id/edit', element: <EditListingPage /> },
  { path: '/listings/:id', element: <ListingDetailPage /> },
  { path: '/onboarding/seller', element: <SellerOnboardingPage /> },
  { path: '/docs', element: <DocsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/cookies', element: <CookiesPage /> },
  {
    path: '/dashboard/buyer',
    element: <DashboardLayout role="buyer" />,
    children: [
      { index: true, element: <BuyerOverviewPage /> },
      { path: 'orders', element: <BuyerOrdersPage /> },
      { path: 'messages', element: <BuyerMessagesPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/dashboard/seller',
    element: <DashboardLayout role="seller" />,
    children: [
      { index: true, element: <SellerOverviewPage /> },
      { path: 'listings', element: <SellerListingsPage /> },
      { path: 'orders', element: <SellerOrdersPage /> },
      { path: 'payouts', element: <SellerPayoutsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/dashboard/admin',
    element: <DashboardLayout role="admin" />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'moderation', element: <ModerationPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'config', element: <ConfigConsolePage /> },
      { path: 'disputes', element: <DisputesPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },
  { path: '/500', element: <ServerErrorPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
