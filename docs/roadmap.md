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
- [x] Auth in Express — the same contract via `requireAuth`, `errorHandler`,
      `notFound`; error body format agreed (`{ message, statusCode, error? }`)
- [x] Auth in Nest — `/auth/login`, `/auth/me`, `/auth/logout`:
      `AuthModule`, `AuthService`, `AuthGuard`, `@CurrentSession()`
- [x] Web: redesign to the Figma mockup — `@theme` tokens (colours,
      Karla / DM Sans, `--text-*` roles, shell metrics, `card 1` shadow),
      shell, base components, dashboard. Not yet done from the mockup:
      catalogue grid, filter panel, grid/list toggle — see
      `docs/ui-guidelines.md` → "Still only in the mockup".

## Next, in order

1. **Catalogue contract** — endpoints for categories, carmakers, models
   (by carmaker), engines (by model) and parts (with filters) in
   `packages/shared`; demo data in the seed.
2. **Catalogue endpoints in both APIs.**
3. **Grid of 12 categories** on `CataloguePage` instead of the placeholder,
   plus the grid/list toggle.
4. **Cascading Carmaker → Model → Engine filters** — state as a single
   `{ make, model, engine }` object, descendants reset, disabled until the
   parent has a value; query keys include the parent id.
5. **Filtering parts** at any selection depth via compatible engines.
6. **Loading / error / empty states** on every screen (the components exist).
7. **Pagination** — cursor-based in the API, `useInfiniteQuery` on the web.
8. **CRUD for categories and parts** — forms, `useMutation`, cache
   invalidation, request validation in both APIs.
9. **Roles** — enforce `admin` / `manager` / `client` in both APIs
    (middleware / guards) and hide actions in the UI.
10. **Orders** — list and statuses.
11. **In stock, Price list, Documents, Warranty claims** — the sidebar
    sections.
12. **Dashboard with real metrics** — replacing the mocks.
13. **Responsive** — sidebar as a drawer on mobile.
14. **Bundle optimisation** — currently ~680 kB (recharts is the largest
    part); route-level code splitting via `React.lazy`.

## Not a priority right now

Payments, delivery, cart, a public storefront for customers, a mobile app,
analytics, promo codes and bonuses, reviews, localisation, complex discount
logic, SSR.

## Technical debt

Moved to [`open-questions.md`](open-questions.md) together with the open
questions.
