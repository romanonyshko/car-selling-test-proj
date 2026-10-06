# Roadmap

Order of work. Details of how things are built live in
[`architecture.md`](architecture.md); unfinished decisions and debt in
[`open-questions.md`](open-questions.md).

> **One backend since 2026-09-25.** Only the NestJS API (:3002) is
> developed; the Express API is archived. The database (Prisma schema,
> migrations, seed) lives in `auto-lincoln-api-nest`;
> `auto-lincoln-contracts` holds only the HTTP and WebSocket contract (zod
> schemas). Older items below that say "both APIs" refer to the time when
> there were two.

## Done

- [x] Monorepo on npm workspaces: `apps/{web,api-express,api-nest}`,
      `packages/{shared,auth,db}`
- [x] Split into four folders (2026-09-23):
      `auto-lincoln-web` (web), `auto-lincoln-contracts` (one package
      `@auto-lincoln/contracts` with `.`/`./auth`/`./db` + DB),
      `auto-lincoln-api-express`, `auto-lincoln-api-nest`; linked with
      `file:../auto-lincoln-contracts`
- [x] Firebase removed (Auth, Firestore, Storage); that direction is postponed
- [x] PostgreSQL 17 in Docker, Prisma schema, first migration (users +
      catalogue tables), seed of the admin user
- [x] Contract (`auto-lincoln-contracts/src/shared`): REST contract (health + auth) and domain types
- [x] Auth helpers (`auto-lincoln-contracts/src/auth`): scrypt password hashing, JWT sessions
- [x] Express API and NestJS API with the same contract: `GET /api/health`,
      `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`;
      shared `JWT_SECRET`, one session valid on both
- [x] Web: `apiClient`, `BackendSwitcher`, Vite dev proxy
- [x] Direct calls instead of the Vite proxy (2026-09-23): the browser calls
      :3001 / :3002 with `credentials: 'include'`, CORS in both APIs
- [x] Web: Vite + React + TS, Tailwind v4 tokens from the Figma mockup,
      `@/` alias, oxlint
- [x] Web: login page, route guards (`beforeLoad`), `AppLayout` / `Sidebar` / `Topbar`
      (user menu + logout)
- [x] Web: base UI components — see [`ui-guidelines.md`](ui-guidelines.md)
- [x] Web: dashboard UI on mock data — see
      [`dashboard-page.md`](dashboard-page.md)
- [x] Web: backend switcher removed — one API, `VITE_API_URL`
- [x] Dashboard on the API (2026-10-01): `GET /api/dashboard` in Nest
      (DB tables + seed), `DashboardResponse` in the contracts, the web
      reads it via `apiRequest` instead of the mock
- [x] Support chat (2026-10-05): WebSocket `WS_ROUTES.chat` in Nest (echo),
      chat events in the contracts, `/support` on the web with optimistic
      messages and connection status — see [`support-chat.md`](support-chat.md)
- [x] Catalogue categories (2026-10-06): catalogue contracts and
      `API_ROUTES`, demo data in the seed, `GET /api/categories` in Nest,
      grid of 12 category cards on `/parts/catalogue` with loading / error /
      empty states — see [`catalogue-page.md`](catalogue-page.md)
- [x] Contracts: `"sideEffects": false` — zod no longer ends up in the web
      bundle (749 → 665 kB)

## In progress

- **Catalogue page** — the category grid works on the API data. Next:
  carmakers / models / engines endpoints and the cascading filters
  (steps 4–5 below), then the grid/list toggle.

## Next, in order

Where each step happens: contract and seed → `auto-lincoln-contracts`
(then `npm run build` there); endpoints → both API folders; UI → `auto-lincoln-web`.

1. **Catalogue contract** — endpoints for categories, carmakers, models
   (by carmaker), engines (by model) and parts (with filters) in
   `auto-lincoln-contracts` (`src/shared`); demo data in the seed.
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
12. **Dashboard with real metrics** — the endpoint and the data flow are
    done; the values are still seed data, not computed from site activity.
13. **Responsive** — sidebar as a drawer on mobile. Partly done: below
    805px an expanded sidebar becomes a full-screen overlay.
14. **Bundle optimisation** — route-level code splitting via `React.lazy`.

## Not scheduled yet

No code and no position in the order above:

- Tests and contract-parity checks — open question #1
- CI
- Deployment and production routing to the two APIs — open question #3
- GitHub repos for the four folders; `file:` → git dependency on the
  contracts (needs a `prepare` script — open question #10)

## Not a priority right now

Payments, delivery, cart, a public storefront for customers, a mobile app,
analytics, promo codes and bonuses, reviews, localisation, complex discount
logic, SSR.
