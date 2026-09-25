# E-Commerce Platform

A full-stack, multi-vendor e-commerce application built as a learning project — Node.js/Express/MongoDB backend with a Next.js frontend. Covers authentication, role-based access control, cart/checkout, order tracking, reviews, and a seller-approval marketplace flow.

## Features

- **Auth** — register/login, JWT access + refresh tokens (httpOnly cookie rotation), password reset, account lockout after repeated failed logins
- **Roles** — Customer, Seller, Admin, with ownership-based authorization on top of role checks
- **Sellers** — apply at registration (store name/description), require admin approval before listing products
- **Products** — CRUD with image upload, categories (proper admin-managed model), stock management
- **Cart & Checkout** — add/update/remove items, checkout creates an order via a database transaction (atomic stock deduction)
- **Orders** — status timeline (`statusHistory`) with a validated state-transition machine, return requests (separate from cancellation, 7-day window)
- **Reviews & Ratings** — purchase-verification required, one review per user per product, product average rating computed via aggregation
- **Wishlist**
- **Payments** — simulated payment flow (success/failure), linked to order payment status
- **Admin** — user management (list/search/paginate, ban, role updates, soft delete), seller approval queue, full override access

## Tech Stack

**Backend**
- Node.js, Express 5, MongoDB (Mongoose)
- JWT (access + refresh tokens), bcrypt
- express-validator, Multer (image uploads)
- Helmet, express-rate-limit, express-mongo-sanitize, CORS
- Winston + Morgan (structured logging)
- Centralized error handling (`AppError`, `catchAsync`, `AppResponse`)

**Frontend**
- Next.js (App Router), React
- shadcn/ui, Tailwind CSS
- Redux Toolkit (auth/cart client state), TanStack React Query (server state)
- Axios (with auto access-token attachment + silent refresh on 401)
- React Hook Form + Zod

## Project Structure

```
.
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── validators/
│       ├── utils/
│       └── app.js / server.js
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── hooks/queries/
        ├── store/
        ├── lib/
        └── providers/
```

See `frontend/ARCHITECTURE.md` for the full frontend structure and conventions, and the docs alongside it (`PRD.md`, `AGENT.md`, `CLAUDE.md`, `SECURITY.md`, `TESTING.md`, `DESIGN-SYSTEM.md`, `CODE-STYLE.md`) for detailed specs.

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT secrets, etc.
npm run dev
```

Required environment variables:
```
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Required environment variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

The frontend expects the backend running and CORS-configured to allow its origin (`http://localhost:3000` by default).

## API Overview

All backend routes are versioned under `/api/v1`. Key resource groups:

| Resource | Base path |
|---|---|
| Auth | `/api/v1/auth` |
| Users (admin) | `/api/v1/users` |
| Products | `/api/v1/products` |
| Categories | `/api/v1/categories` |
| Cart | `/api/v1/cart` |
| Orders | `/api/v1/orders` |
| Reviews | `/api/v1/reviews` |
| Wishlist | `/api/v1/wishlist` |
| Payments | `/api/v1/payments` |
| Health | `/health` (unversioned) |

Every response follows `{ success, message, data }` on success and `{ success: false, message }` on error.

## Status

Backend is feature-complete for the scope above, with most production-hardening in place (rate limiting, logging, transactions, graceful shutdown). Remaining backend items: DB indexes, full test suite. Frontend is in active development — see `frontend/AGENT.md` for the current build-status table.

## License

Personal learning project — not licensed for production use as-is.