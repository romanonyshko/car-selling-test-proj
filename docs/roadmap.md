# Roadmap

## Done

- [x] Web: Vite + React + TS, Tailwind v4, `@/` alias, oxlint
- [x] Web: folder structure, layers, dependency rules
- [x] Web: routing + `ProtectedRoute`
- [x] Web: layout — Sidebar, Topbar (user menu), `AppLayout`
- [x] Web: base UI components — Button, Input, Select, Spinner, ErrorState
- [x] Web: dashboard on mock data — see `docs/dashboard-page.md`
- [x] Monorepo on npm workspaces: `apps/{web,api-express,api-nest}`,
      `packages/{shared,auth,db}`
- [x] Firebase removed completely (Auth, Firestore, Storage)
- [x] `packages/shared`: REST contract + domain types aligned with
      `docs/catalogue-page.md`
- [x] PostgreSQL in Docker, Prisma schema, first migration
- [x] `packages/auth`: scrypt password hashing, JWT sessions
- [x] Seed: admin user
- [x] Both APIs: skeleton with `GET /api/health`
- [x] Web: `apiClient`, backend switcher, Vite dev proxy, auth hooks on
      `/auth/me`
- [x] Auth in Nest — `/auth/login`, `/auth/me`, `/auth/logout`:
      `AuthModule`, `AuthService`, `AuthGuard`, `@CurrentSession()`

## Next, in order

1. **Auth in Express** — the same contract: the `requireAuth` middleware,
   the error handler, `toAuthUser`. After this the switcher works end to
   end. Decide the shared error body format here (open question 7).
2. **Catalogue contract** — endpoints for categories, carmakers, models
   (by carmaker), engines (by model) and parts (with filters) in
   `packages/shared`; demo data in the seed.
3. **Catalogue endpoints in both APIs.**
4. **Grid of 12 categories** on `CataloguePage` instead of the placeholder,
   plus the grid/list toggle.
5. **Cascading Carmaker → Model → Engine filters** — state as a single
   `{ make, model, engine }` object, descendants reset, disabled until the
   parent has a value; query keys include the parent id.
6. **Filtering parts** at any selection depth via compatible engines.
7. **Loading / error / empty states** on every screen (the components exist).
8. **Pagination** — cursor-based in the API, `useInfiniteQuery` on the web.
9. **CRUD for categories and parts** — forms, `useMutation`, cache
   invalidation, request validation in both APIs.
10. **Roles** — enforce `admin` / `manager` / `client` in both APIs
    (middleware / guards) and hide actions in the UI.
11. **Orders** — list and statuses.
12. **In stock, Price list, Documents, Warranty claims** — the sidebar
    sections.
13. **Dashboard with real metrics** — replacing the mocks.
14. **Responsive** — sidebar as a drawer on mobile.
15. **Bundle optimisation** — currently ~680 kB (recharts is the largest
    part); route-level code splitting via `React.lazy`.

## Not a priority right now

Payments, delivery, cart, a public storefront for customers, a mobile app,
analytics, promo codes and bonuses, reviews, localisation, complex discount
logic, SSR.

## Technical debt

Moved to [`open-questions.md`](open-questions.md) together with the open
questions.
