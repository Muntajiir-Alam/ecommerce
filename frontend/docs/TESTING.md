# TESTING — E-Commerce Frontend

Given this is a learning project, the goal is *meaningful* coverage of the risky/stateful parts, not exhaustive coverage of everything.

## 1. Tooling
- **Vitest** (or Jest, if the agent prefers consistency with the backend's Jest setup) + **React Testing Library** for component/unit tests
- **Playwright** for end-to-end flows (optional tier — see §4)

## 2. What must be tested (minimum bar per feature)
For any feature involving one of these, a test is required, not optional:
- **Auth-gated behavior** — a `ProtectedRoute`/guard correctly redirects an unauthenticated or wrong-role user
- **Forms with validation** — at least one test asserting a required field shows its Zod error, and one asserting successful submit calls the right mutation with the right payload shape
- **Cart/checkout math or state transitions** — e.g., adding the same product twice increments quantity rather than duplicating a line item (mirrors backend behavior)
- **Role-conditional rendering** — e.g., seller/admin dashboard links only appear for the right `user.role`

## 3. What doesn't need dedicated tests
- Pure presentational components with no logic (a `Badge` wrapper, a static layout) — visual correctness is checked by hand, not asserted in code, for a project this size
- shadcn's generated `components/ui/*` internals — these are vendored, not authored here

## 4. Tiers
1. **Unit** — a hook's logic in isolation where feasible (e.g., a Zod schema's `.refine()` conditional logic, tested directly against the schema without rendering anything)
2. **Component** — render a form/page with a mocked API layer (mock the Axios instance or use `msw`) and assert behavior: validation errors show, successful submit triggers the right toast/redirect, loading states render
3. **E2E (optional, do later)** — Playwright script running against the real dev server + real backend for the core happy path per role: register → (seller: wait for approval, simulate via a test admin login) → browse → add to cart → checkout → view order → (admin: change order status) → (customer: sees updated tracking)

## 5. Mocking the API
Use `msw` (Mock Service Worker) to intercept Axios calls in component tests, rather than mocking `axios` module methods directly — this keeps tests closer to real request/response shapes and catches shape mismatches (e.g., forgetting `.data.data` unwrapping) that a naive mock would hide.

## 6. Definition of done for a feature
A feature is not "done" per `AGENT.md`'s loop until:
- It matches `PRD.md`'s description of that capability
- It respects every applicable rule in `ARCHITECTURE.md` and `SECURITY.md`
- It has at least the minimum-bar tests from §2 if it falls into one of those categories
- The `AGENT.md` build status table is updated