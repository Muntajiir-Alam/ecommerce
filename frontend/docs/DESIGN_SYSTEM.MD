# DESIGN-SYSTEM — E-Commerce Frontend

This defines the visual language so every page/component looks like it belongs to the same app, regardless of which loop iteration built it.

## 1. Foundation
- Built on **shadcn/ui** + **Tailwind CSS**. Don't invent parallel design tokens outside Tailwind's config — extend `tailwind.config.js` if a new token is genuinely needed, don't hardcode one-off hex values in `className`.
- Color, radius, and font tokens come from shadcn's generated CSS variables (`--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, `--border`, `--radius`, etc. in `globals.css`) — reference these via Tailwind classes (`bg-primary`, `text-muted-foreground`) rather than raw Tailwind colors (`bg-blue-500`), so a future theme change (e.g., dark mode) propagates everywhere automatically.

## 2. Layout
- Page container: `container mx-auto px-4` at minimum; add vertical padding per page (`py-8` is the default used so far).
- Grid breakpoints already established for product grids: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` — reuse this exact pattern for any new card grid (categories, seller products, admin lists rendered as cards) unless a table is more appropriate (see §5).
- Forms: single column, `max-w-sm` for auth forms, `space-y-4` between fields — established in `LoginForm`/`RegisterForm`. Wider forms (product creation with images) can use `max-w-2xl` but stay single-column on mobile.

## 3. Typography
- Page titles: `text-2xl font-bold`
- Section headings: `text-xl font-semibold`
- Body text: default Tailwind base size, `text-gray-700` for secondary descriptive text, `text-gray-500`/`text-muted-foreground` for metadata (timestamps, counts, category labels)
- Prices: `font-semibold`, always prefixed with `₹`

## 4. Color usage (semantic, not decorative)
- **Destructive actions** (delete product, ban user, reject seller, cancel order) → `variant="destructive"` on `Button`, confirmed via a `Dialog`/`AlertDialog` before firing — never a bare, unconfirmed destructive button.
- **Status badges** — one consistent color mapping, used everywhere an order/return/seller-approval status is shown:
  - `pending` / `requested` → `variant="secondary"` (neutral/gray)
  - `confirmed` / `approved` / `shipped` / `out_for_delivery` → default `Badge` (blue-ish, shadcn default)
  - `delivered` / `paid` / `completed` → a green-toned badge (extend `Badge` with a `className="bg-green-100 text-green-800"` variant if shadcn's default set doesn't cover it)
  - `cancelled` / `rejected` / `failed` / `banned` → `variant="destructive"`
- Ratings: `★` character + number, `text-yellow-600`, as already used in the review list — don't switch to a star-icon component unless doing so everywhere at once.

## 5. Data display
- **Cards** for browsable collections a user scans visually (products, categories-as-tiles).
- **Tables** (shadcn `Table`) for admin/seller management views where scanning columns matters (user list, order list, product inventory) — this is a deliberate distinction: don't render admin's user list as cards, don't render the product catalog as a table.
- Every table with more than ~10 potential rows must paginate (matches backend pagination already built for `GET /users`) — a `Pagination` component (`components/shared/Pagination.jsx`) should be built once and reused everywhere pagination is needed, not re-implemented per page.

## 6. Feedback & states
- **Loading**: a shared `LoadingSpinner` component (`components/shared/`) — don't write ad-hoc "Loading..." text per page once this exists; build it early and reuse it.
- **Empty states**: every list (products, orders, cart, wishlist, reviews) needs an explicit empty-state message (already established: `"No products found"`, `"No reviews yet"`) — never let an empty array render as a blank area with no explanation.
- **Errors**: `toast.error(...)` for action failures (form submit, mutation); a shared `ErrorMessage` component for page-level fetch failures (e.g., product not found, order not found) shown inline where the content would have been.
- **Disabled + pending states**: any button triggering a mutation must disable itself and show pending text while `isPending` is true (established pattern: `{isPending ? 'Adding...' : 'Add to Cart'}`) — never allow a double-submit.

## 7. Icons
- `lucide-react` only. Standard sizing: `h-4 w-4` inline with text, `h-5 w-5` for standalone nav icons (as used in `Navbar`).

## 8. Responsiveness
- Mobile-first: every new page/component must be checked at a narrow viewport before being considered done. Nav collapses to icons-only (as already done); forms stay single-column; grids drop to `grid-cols-2` at the smallest breakpoint, never 1, unless content genuinely can't fit two across.

## 9. What not to do
- No inline `style={{}}` — Tailwind classes only, except for a truly dynamic value Tailwind can't express (rare; flag it if it comes up).
- Don't introduce a second icon set, a second toast library, or a second component library alongside shadcn "just for one component."
- Don't hardcode a color hex value — use a Tailwind/shadcn token.