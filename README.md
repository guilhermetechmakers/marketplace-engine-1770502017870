# Marketplace Engine

A configurable, production-ready two-sided marketplace engine that enables rapid launch of niche marketplaces via a central configuration layer.

## Tech Stack

- React 18 with TypeScript
- Vite with path aliases (@/)
- Tailwind CSS v3 with design system
- Shadcn/ui (Radix UI primitives)
- React Router 6
- TanStack React Query
- React Hook Form + Zod
- Recharts, Sonner

## Setup

```bash
npm install
npm run build
```

**Note:** Ensure devDependencies are installed. If using `NODE_ENV=production`, run `NODE_ENV=development npm install` before building.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

- **Landing** - Hero, How It Works, Features, CTA
- **Auth** - Login, Signup, Forgot/Reset Password, Email Verification
- **Dashboards** - Buyer, Seller, Admin with collapsible sidebar
- **Listings** - Create, Edit, Detail, Search & Discovery
- **Checkout** - Order summary, payment, payer details
- **Orders** - Transaction history
- **Admin** - Moderation, Config Console, Disputes, Users, Analytics
- **Legal** - Privacy, Terms, Cookies
- **Errors** - 404, 500

## Design System

- Primary: Soft mint (#DFF6E3), Fresh green (#4CAF50)
- Typography: Inter, 16px cards, 16px radius
- Buttons: #4CAF50 fill, hover lift
