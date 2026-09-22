# Roadmap

Order of work. Details of how things are built live in
[`architecture.md`](architecture.md); unfinished decisions and debt in
[`open-questions.md`](open-questions.md).

## Done

- [x] Monorepo on npm workspaces: `apps/{web,api-express,api-nest}`,
      `packages/{shared,auth,db}`
- [x] Firebase removed (Auth, Firestore, Storage); that direction is postponed
- [x] PostgreSQL 17 in Docker, Prisma schema, first migration (users +
      catalogue tables), seed of the admin user
- [x] `packages/shared`: REST contract (health + auth) and domain types
- [x] `packages/auth`: scrypt password hashing, JWT sessions
- [x] Express API and NestJS API with the same contract: `GET /api/health`,
      `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`;
      shared `JWT_SECRET`, one session valid on both
- [x] Web: `apiClient`, `BackendSwitcher`, Vite dev proxy
- [x] Web: Vite + React + TS, Tailwind v4 tokens from the Figma mockup,
      `@/` alias, oxlint
- [x] Web: login page, `ProtectedRoute`, `AppLayout` / `Sidebar` / `Topbar`
      (user menu + logout)
- [x] Web: base UI components — see [`ui-guidelines.md`](ui-guidelines.md)
- [x] Web: dashboard UI on mock data — see
      [`dashboard-page.md`](dashboard-page.md)

## In progress

- **Catalogue page** — partially prepared: the route `/parts/catalogue`
  and a text placeholder exist, 12 category images are in
  `apps/web/public/categories/` (not wired up). Everything else is under
  Next.

## Next, in order

1. **Catalogue contract** — endpoints for categories, carmakers, models
   (by carmaker), engines (by model) and parts (with filters) in
   `packages/shared`; demo data in the seed.
2. **Catalogue endpoints in both APIs.**
3. **Grid of 12 categories** on `CataloguePage` instead of the placeholder,
   plus the grid/list toggle.
4. **Cascading Carmaker → Model → Engine filters**, state in the URL — spec
   in [`catalogue-page.md`](catalogue-page.md).
5. **Filtering parts** at any selection depth via compatible engines.
6. **Loading / error / empty states** on every screen (the components exist,
   only the dashboard uses them).
7. **Pagination** — cursor-based in the API, `useInfiniteQuery` on the web.
8. **CRUD for categories and parts** — forms, `useMutation`, cache
   invalidation, request validation (open question #2).
9. **Roles** — enforce `admin` / `manager` / `client` in both APIs and hide
   actions in the UI (open question #5).
10. **Orders** — list and statuses.
11. **In stock, Price list, Documents, Warranty claims** — the sidebar
    sections.
12. **Dashboard with real metrics** — replacing the mocks.
13. **Responsive** — sidebar as a drawer on mobile.
14. **Bundle optimisation** — route-level code splitting via `React.lazy`.

## Not scheduled yet

No code and no position in the order above:

- Tests and contract-parity checks — open question #1
- CI
- Deployment and production routing to the two APIs — open question #3

## Not a priority right now

Payments, delivery, cart, a public storefront for customers, a mobile app,
analytics, promo codes and bonuses, reviews, localisation, complex discount
logic, SSR.
