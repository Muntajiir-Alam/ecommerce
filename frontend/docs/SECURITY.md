# SECURITY — E-Commerce Frontend

These are hard constraints. Convenience never overrides them.

## 1. Token handling
- Access token: **memory only** (Redux state). Never `localStorage`, never `sessionStorage`, never a non-`httpOnly` cookie.
- Refresh token: never touched by frontend JS at all — it's an `httpOnly` cookie the browser manages; the frontend only ever calls `POST /auth/refresh` and lets the browser attach the cookie automatically (`withCredentials: true`).
- On refresh failure (expired/invalid refresh token), clear all client auth state immediately and redirect to `/login`. Don't leave stale user data rendered.

## 2. Route protection
- Every route that requires login must actually check `isAuthenticated` (post-`AuthInitializer` resolution, not before) and redirect if false — not just hide a nav link. Hiding a link is not protection; a logged-out user typing the URL directly must still be redirected.
- `/seller/*` and `/admin/*` must check role, not just authentication. A logged-in customer navigating directly to `/admin/users` must be redirected, not shown a broken/empty page.
- Never trust a role value from anywhere except the Redux `auth.user.role`, which itself only ever comes from the backend's response (login, register, refresh, `/auth/me`) — never let a role be settable via a query param, local component state, or hardcoded default that could leak into a real render path.

## 3. Data exposure
- Never log tokens, cookies, or full user objects (including password-adjacent fields, even hashed) to the browser console in code that ships — debug logs are fine locally but must not ship in committed code.
- Never construct a MongoDB `_id` or any identifier client-side and trust it as if the server validated it — all such values must come from the API response.
- Never send `price`, `totalAmount`, `role`, or any server-computed/protected field as user-editable form input. These are review-only-from-the-user's-perspective, or entirely absent from any form (the backend recomputes/validates them independently, per the existing backend design).

## 4. Input handling
- All forms validate via Zod before submission — this is a UX improvement, not a security boundary (the backend is the real boundary), but it must not be skipped, since it prevents obviously-bad requests and keeps client/server validation in sync.
- Never render user-supplied content (review comments, product descriptions, store descriptions) as raw HTML (`dangerouslySetInnerHTML`) — render as plain text/React children only, to avoid stored-XSS from any field the backend doesn't sanitize for HTML specifically.

## 5. Environment & secrets
- `NEXT_PUBLIC_API_URL` is the only environment variable that should be prefixed `NEXT_PUBLIC_` (i.e., exposed to the browser). Never prefix a secret with `NEXT_PUBLIC_`.
- `.env.local` must never be committed. Confirm `.gitignore` covers it before the first commit.

## 6. CORS / cross-origin
- The frontend must always call the API with `withCredentials: true` and rely on the backend's explicit origin allowlist (already configured server-side) — never attempt to work around a CORS rejection by disabling credentials or pointing at a wildcard-origin backend config.

## 7. Third-party content
- Product images come from backend-provided URLs (ImageKit/local storage) only — never render an image URL sourced from unvalidated user input outside of what the backend already accepted through its own upload/validation pipeline.