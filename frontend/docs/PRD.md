# PRD — E-Commerce Frontend

## 1. Overview
A Next.js (App Router) frontend for a multi-vendor e-commerce backend (Express/MongoDB, already built). Three roles: **Customer**, **Seller**, **Admin**. This document defines *what* the app must do; see `ARCHITECTURE.md` for *how* it's structured, and `AGENT.md` for how an autonomous coding agent should work against this spec.

## 2. Roles & Core Capabilities

### Customer (default role)
- Register / login / logout, forgot & reset password, view/edit own profile
- Browse products (search, filter by category, pagination)
- View product detail, ratings, and reviews
- Add/remove/update items in cart, view cart, checkout (cart → order)
- Make a (simulated) payment for an order
- View own order list, order detail, and order tracking timeline
- Cancel a pending order; request a return on a delivered order (within 7 days)
- Leave a review/rating on a product they've purchased and received
- Add/remove products in a wishlist

### Seller
- Everything a Customer can do, plus:
- Register with store name/description; account starts unapproved
- View own approval status
- Once approved: create/edit/delete own products (with image upload), manage own stock
- View own product list
- View orders containing their products (read-only for now)

### Admin
- Everything above, plus:
- Manage all users (list/paginate/search/filter, view detail, update role, ban/unban, soft-delete)
- Approve/reject pending sellers
- Manage all products (override any seller's product)
- Manage categories (CRUD)
- Manage all orders (update status through the tracking state machine, resolve return requests)
- View all payments

## 3. Pages (high-level)
- `/` — landing / featured products
- `/products`, `/products/[id]`
- `/login`, `/register`, `/forgot-password`, `/reset-password`
- `/cart`, `/checkout`
- `/orders`, `/orders/[id]`
- `/wishlist`, `/profile`
- `/seller/dashboard`, `/seller/products`, `/seller/products/new`, `/seller/products/[id]/edit`, `/seller/orders`
- `/admin/dashboard`, `/admin/users`, `/admin/sellers`, `/admin/products`, `/admin/categories`, `/admin/orders`

## 4. Out of scope (for now)
- Real payment gateway integration (dummy/simulated payment only)
- Real-time notifications (no websockets)
- Multi-language / i18n
- Native mobile app

## 5. Non-functional requirements
- Every authenticated request must survive an access-token expiry mid-session via silent refresh (no user-visible interruption)
- Role-restricted pages must not be reachable by direct URL navigation for an unauthorized role
- Forms must validate client-side (Zod) with rules mirroring the backend's `express-validator` rules, and must surface backend validation errors on submit failure
- List views (products, orders, users) must paginate — never render an unbounded list
- No sensitive data (tokens, passwords) in `localStorage`

## 6. Success criteria
A user in each of the three roles can complete their full core capability list above end-to-end against the real backend, with no console errors, no broken auth state on refresh, and no route accessible to a role that shouldn't reach it.