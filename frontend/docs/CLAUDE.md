# CLAUDE.md — Conventions for This Repo

## Stack (do not substitute without asking)
Next.js App Router, JavaScript (no TypeScript), Tailwind, shadcn/ui, Redux Toolkit, React Query, Axios, React Hook Form + Zod, sonner, lucide-react.

## File conventions
- Route files (`app/**/page.js`) contain layout/composition only. Fetch/mutate logic lives in `hooks/queries/`, not inline in page components, except trivial cases (a single one-off `useQuery` that isn't reused elsewhere — even then, prefer the hooks file).
- One hooks file per backend resource under `hooks/queries/` (`useProducts.js`, `useOrders.js`, ...), following the shape already established: `useX` (list query), `useXById` (single query, `enabled: !!id`), `useCreateX`/`useUpdateX`/`useDeleteX` (mutations, each invalidating the `['x']` query key on success).
- Zod schemas live in `lib/schemas/<domain>Schemas.js`, one export per form.
- New shadcn components: `npx shadcn@latest add <name>` — never hand-write a component that shadcn already provides.
- `'use client'` at the top of any file using hooks, Redux, or React Query — Server Components stay the default elsewhere.

## Auth & tokens
- Never write the access token to `localStorage`/`sessionStorage`/cookies from client code. It lives in Redux only.
- Every Axios call goes through the shared instance in `lib/axios.js`. Never call `axios` directly from a component or hook — always import the configured instance.
- Any new authenticated endpoint call automatically gets the token/refresh behavior for free by using the shared instance — don't re-implement token attachment per-hook.

## Forms
- Every form uses `react-hook-form` + `zodResolver`. No manual `useState`-per-field forms.
- Show field errors under each field (`errors.<field>.message`) and surface submit-time API errors via `toast.error(error.response?.data?.message || '<fallback>')`.
- Mirror backend validation constraints exactly (min/max lengths, enums, required-ness) — check the corresponding backend validator file if unsure rather than guessing a constraint.

## Styling
- Tailwind utility classes only; no separate CSS files per component. Run Prettier with `prettier-plugin-tailwindcss` before considering a component done (class ordering).
- Reuse shadcn primitives (`Card`, `Badge`, `Button`, `Dialog`, `Sheet`, `Table`, `Select`, `DropdownMenu`) rather than building bespoke equivalents.

## State
- If you're tempted to put server data (a product, an order, a user list) into Redux — don't. That's what React Query is for. Redux is for `auth` and small pieces of pure client/UI state only.

## Naming
- Match backend field names exactly (`product` not `productId` in order items, `imagesUrls`, `averageRating`, `numReviews`, `paymentStatus`, `statusHistory`, `returnRequest`) — do not rename fields on the way through a component; this project already had one schema mismatch bug (`product` vs `productId`) from inconsistent naming and it's worth being deliberate here.

## What not to do
- Don't add a UI library alongside shadcn (no MUI, no Ant Design, no Chakra).
- Don't fetch data with raw `fetch`/`axios` inside a component body — always through a `hooks/queries/` hook.
- Don't build a feature not listed in `PRD.md` without checking it in first.
- Don't skip `SECURITY.md` constraints for convenience, even in "just for now" code.