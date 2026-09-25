# CODE-STYLE — E-Commerce Frontend

Mechanical formatting rules go through Prettier/ESLint (see §1). This document covers the conventions those tools can't enforce.

## 1. Formatting (enforced by tooling, not judgment)
- Prettier config: `semi: true`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, plugin `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes — don't hand-order `className` strings).
- Run `npm run format` before considering any file done. Don't argue with the Tailwind class order it produces.
- ESLint: use Next.js's default config (`next lint`). Fix warnings, don't disable rules inline unless there's a documented reason in a comment.

## 2. Component structure
- Functional components only, no class components.
- One component per file; filename matches the component name (`ProductCard.jsx` exports `ProductCard`).
- Order within a component file: imports → component function → (if needed) small local helper functions below it → default export. Don't scatter helper functions above the component if they're only used by it.
- Props: destructure in the function signature (`export default function ProductCard({ product })`), not `props.product` inside the body.
- `'use client'` is the **first line** of any file that needs it — no blank line or comment above it.

## 3. Imports
- Use the `@/` alias for all internal imports (`@/components/...`, `@/hooks/...`, `@/lib/...`) — no relative `../../../` chains.
- Import order: external packages first, then internal (`@/...`), then relative — Prettier/ESLint import-sort will handle exact grouping if configured; otherwise keep this order by hand.
- Import only what's used — no wildcard imports of a library when named imports are available.

## 4. Naming
- Components: `PascalCase` (`ProductCard`, `LoginForm`).
- Hooks: `camelCase`, prefixed `use` (`useProducts`, `useCreateProduct`).
- Files: match the export's case — components `PascalCase.jsx`, hooks/utils `camelCase.js`.
- Redux slices: `camelCase` file and export (`authSlice`, `cartSlice`), actions as verbs (`setCredentials`, `clearCredentials`), not nouns.
- Boolean variables/props: `is`/`has`/`should` prefix (`isLoading`, `hasError`, `isAuthenticated`) — matches what's already established in `authSlice`.
- Match backend field names exactly when naming variables that hold API data — don't rename `imagesUrls` to `images` or `product` to `productId` on the way through a component (see `ARCHITECTURE.md` §4.5 and the note in `CLAUDE.md` about the schema mismatch bug this already caused once on the backend).

## 5. React Query hook files
- Every resource hook file follows this internal order: query hooks first (list, then by-id), then mutation hooks (create, update, delete), matching the order already used in `useProducts.js` and `useCategories.js`. Don't interleave queries and mutations.
- Every `useQuery` names its `queryKey` as an array literal inline at the call site — don't abstract query keys into a separate constants file unless the project grows large enough that key collisions become a real risk (not the case yet).
- Every mutation's `onSuccess` that should invalidate cache does so explicitly — don't rely on `staleTime` expiry to eventually refresh; that's not equivalent and produces stale UI after a write.

## 6. Forms
- Zod schema and the component that uses it live in separate files (`lib/schemas/xSchemas.js` imported into `components/x/XForm.jsx`) — never define a Zod schema inline inside a component body.
- Field-level error rendering is always the same shape: a `<p className="text-sm text-red-500">{errors.field.message}</p>` immediately below the field — copy this exact pattern, don't invent a new error-display style per form.

## 7. Comments
- Comment *why*, not *what* — the code should be readable enough that "what" is self-evident from names. A comment explaining a non-obvious backend contract detail (e.g., "backend expects `product`, not `productId`, in order items") is worth keeping; a comment restating the next line in English is not.
- No commented-out dead code left in committed files — delete it (version control keeps history).

## 8. Error handling
- Every mutation call site provides both `onSuccess` and `onError` — don't let a failed mutation fail silently with no user feedback.
- Every `useQuery` consumer checks and handles `isLoading` and `error` before rendering `data` — don't assume `data` is defined.

## 9. File length / splitting
- If a page component (`app/**/page.js`) exceeds roughly 150 lines, extract sections into `components/` — page files should read as composition, not implementation.
- If a hooks file exceeds ~8 exported hooks, consider whether the resource actually splits into two concerns (e.g., if `useOrders.js` grows to cover both orders and returns, split `useReturns.js` out).

## 10. Consistency check before calling anything "done"
Before marking a component/page complete, confirm it follows the same shape as the most recently built comparable piece (e.g., a new list page should structurally resemble `products/page.js`; a new form should structurally resemble `RegisterForm.jsx`) — consistency with existing code takes priority over a "better" idiom introduced only in the new piece.