# AGENT — Working Loop for This Project

This describes the loop an autonomous coding agent (e.g. Claude Code) should run against this repo. `CLAUDE.md` holds the standing conventions; this file holds the *process*.

## 1. Source of truth, in priority order
1. `PRD.md` — what to build
2. `ARCHITECTURE.md` — how it must be structured
3. `SECURITY.md` — hard constraints that override convenience
4. `CLAUDE.md` — coding conventions and style
5. `TESTING.md` — what "done" requires

If any of these conflict, stop and flag it rather than guessing.

## 2. Per-feature loop
For each page/feature (pick the next unbuilt item from `PRD.md` §3, in the order features have their dependencies satisfied — e.g. don't build `/checkout` before `useCart` hooks and `/cart` exist):

1. **Plan** — restate the feature in 2–4 bullet points: what data it needs (which hooks/endpoints), what state it touches (Redux vs React Query), what components it needs (new vs reused from `components/`), and which role(s) can access it.
2. **Check for reuse** — search `components/` and `hooks/queries/` before creating anything. Most CRUD hooks follow the exact pattern already established in `useProducts.js`/`useCategories.js` — copy that pattern for new resources rather than inventing a new one.
3. **Implement** — smallest working slice first (e.g., page renders with real data, no mutations) then layer in mutations, validation, loading/error states.
4. **Self-check against `SECURITY.md`** before moving on — specifically: is this route protected if it needs to be, is any token/secret exposed, does any form skip validation.
5. **Test** — per `TESTING.md`'s applicable tier for this feature type.
6. **Record** — update the "Build status" table in this file (§4) so the next loop iteration (or the next session) knows what's done.

## 3. When blocked
- Missing backend endpoint or a shape mismatch between what the backend returns and what a page needs → do not invent a workaround field on the frontend; note the mismatch and either adjust the frontend to the real shape or flag that the backend needs a fix. Do not silently paper over a backend inconsistency with frontend-only logic.
- Ambiguous requirement not covered by `PRD.md` → make the smallest reasonable assumption, state it in the PR/commit description, and continue — don't block the whole loop on one ambiguity.

## 4. Build status
Update this table as features land. This is the single place to check "what's already done" before starting new work.

| Feature | Status | Notes |
|---|---|---|
| Axios instance + interceptors | Done | `lib/axios.js` |
| Redux authSlice + AuthInitializer | Done | silent refresh on load |
| React Query provider | Done | |
| Auth hooks (login/register/logout) | Done | `hooks/queries/useAuth.js` |
| Product hooks | Done | list, by-id, create/update/delete, my-products |
| Category hooks | Done | |
| Cart hooks (partial) | Done | `useCart`, `useAddToCart` only |
| Login page | Done | |
| Register page | Done | conditional seller fields |
| Product listing page | Done | category filter only, no search/pagination yet |
| Product detail page | Done | includes add-to-cart, basic review list |
| Navbar | Done | role-aware dropdown |
| ProtectedRoute / route guarding | **Not started** | listed in architecture, no implementation yet |
| Cart page (full: update qty, remove, clear, checkout) | **Not started** | |
| Order pages (list, detail, tracking) | **Not started** | |
| Wishlist page | **Not started** | |
| Profile page | **Not started** | |
| Review submit form | **Not started** | list-only exists |
| Seller dashboard/products/orders | **Not started** | |
| Admin dashboard/users/sellers/products/categories/orders | **Not started** | |
| Payments UI | **Not started** | |