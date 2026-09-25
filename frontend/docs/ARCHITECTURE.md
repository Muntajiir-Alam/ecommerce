# ARCHITECTURE — E-Commerce Frontend

## 1. Stack
| Concern | Choice |
|---|---|
| Framework | Next.js (App Router, JavaScript, not TypeScript) |
| UI components | shadcn/ui (copied into `components/ui/`, not an npm dependency) |
| Styling | Tailwind CSS |
| Client state (auth session, cart UI bits) | Redux Toolkit |
| Server state (products, orders, categories, reviews, etc.) | TanStack React Query |
| HTTP client | Axios (single shared instance) |
| Forms | React Hook Form + Zod (`@hookform/resolvers/zod`) |
| Notifications | sonner (`components/ui/sonner`) |
| Icons | lucide-react |

## 2. Backend contract (already built, do not modify without cause)
- Base URL: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api/v1`)
- Auth: short-lived **access token** returned in response body (`data.accessToken`), long-lived **refresh token** as an `httpOnly` cookie (`credentials: true` required on every request)
- Response shape (success): `{ success: true, message, data }`
- Response shape (error): `{ success: false, message }`, with the HTTP status carrying the real meaning (400/401/403/404/409/500 etc.)
- Roles: `customer`, `seller`, `admin`

## 3. Folder structure
```
src/
├── app/                     Next.js routes only — no business logic here beyond composing components
│   ├── (auth)/login|register|forgot-password|reset-password
│   ├── products/, products/[id]/
│   ├── cart/, checkout/
│   ├── orders/, orders/[id]/
│   ├── wishlist/, profile/
│   ├── seller/dashboard|products|orders
│   └── admin/dashboard|users|sellers|products|categories|orders
├── components/
│   ├── ui/                  shadcn components — do not hand-edit generated internals beyond styling
│   ├── layout/              Navbar, Footer, Sidebar
│   ├── auth/                LoginForm, RegisterForm, ProtectedRoute, AuthInitializer
│   ├── products/, cart/, orders/, reviews/, shared/
├── lib/
│   ├── axios.js             single Axios instance, request/response interceptors live here only
│   ├── schemas/              Zod schemas, one file per domain (authSchemas.js, productSchemas.js, ...)
│   └── utils.js
├── store/
│   ├── store.js
│   └── slices/authSlice.js, cartSlice.js
├── hooks/
│   └── queries/              one file per backend resource: useAuth, useProducts, useCategories, useCart, useOrders, useReviews, useWishlist, useUsers, usePayments
├── providers/                ReduxProvider, QueryProvider (both Client Components)
└── constants/roles.js
```

## 4. Core patterns (established — follow these, don't reinvent per-feature)

### 4.1 Data fetching split
- **Redux**: only `auth` (user, accessToken, isAuthenticated, isLoading) and lightweight `cart` UI state if needed. Nothing that the backend owns should be duplicated into Redux as a source of truth.
- **React Query**: everything fetched from the API. One hooks file per resource under `hooks/queries/`. `useQuery` for reads, `useMutation` for writes, and every mutation that changes a resource must `invalidateQueries` for that resource's `queryKey` on success.
- `queryKey` convention: `['<resource>']` for a list, `['<resource>', id]` for a single item, `['<resource>', params]` for a filtered list. Invalidating `['<resource>']` invalidates all keys with that prefix.

### 4.2 Auth flow
- Axios instance (`lib/axios.js`) attaches `Authorization: Bearer <accessToken>` from the Redux store on every request via a request interceptor.
- A response interceptor catches `401`, calls `POST /auth/refresh` once (`_retry` flag guards against loops), updates Redux, and retries the original request. On refresh failure, clears Redux and redirects to `/login`.
- `AuthInitializer` (mounted once, high in the tree, inside both providers) calls `/auth/refresh` on app load to silently restore a session from the `httpOnly` cookie. Until this resolves, `auth.isLoading` is `true` — UI that depends on auth state must handle this (render nothing / a neutral state), not assume `isAuthenticated: false`.
- Access token is **never** persisted to `localStorage`/`sessionStorage`. It lives only in Redux (memory) and is re-acquired via silent refresh on reload.

### 4.3 Route protection
- `ProtectedRoute` (or middleware, if the agent prefers a Next.js middleware-based approach — pick one and apply it consistently) must gate `/seller/*`, `/admin/*`, `/profile`, `/orders/*`, `/cart`, `/checkout`, `/wishlist` behind `isAuthenticated`, and `/seller/*`/`/admin/*` additionally behind role.
- An unauthorized visit should redirect to `/login` (unauthenticated) or a 403/home redirect (wrong role), not render a blank/broken page.

### 4.4 Forms
- Every form: Zod schema in `lib/schemas/`, wired via `zodResolver`, submitted through a React Query mutation hook. Client-side validation rules should mirror the backend's `express-validator` rules for the same field (do not invent new constraints not enforced server-side, and don't skip constraints the backend enforces).
- Backend validation/business errors (`error.response.data.message`) must be surfaced via `toast.error`, not swallowed.

### 4.5 List vs detail responses
- List endpoints return trimmed fields (see backend project notes); detail endpoints return full documents. Don't assume a list item has every field a detail view has — check what the backend controller actually `.select()`s/`.populate()`s before building a component against it.

## 5. Things intentionally deferred
- No server components fetching data directly from the API yet (everything is Client Components + React Query) — this can be introduced later per `PRD.md`'s "out of scope" boundary; don't do it opportunistically mid-feature.
- No offline/optimistic UI beyond what React Query gives for free.