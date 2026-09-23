# CLAUDE.md

Admin panel for the "Auto Lincoln" auto parts catalogue: managing categories,
parts, stock and orders. A learning project (internship), built from a mockup
provided by the mentor.

This repo is **the web app only** — a Vite SPA. It talks to **two
interchangeable backends** (Express and NestJS) that implement the same REST
contract; a switcher in the UI chooses which one.

## The project is split into four folders

```
~/Documents/programing/auto-lincoln/
  auto-lincoln-web/           ← this repo: web app, port 5173
  auto-lincoln-contracts/     ← @auto-lincoln/contracts: REST contract, auth, Prisma/DB, docker-compose
  auto-lincoln-api-express/   ← Express API, port 3001
  auto-lincoln-api-nest/      ← NestJS API, port 3002
```

Each folder is an independent npm project with its own `CLAUDE.md`. Work on
an API or on the database happens **in that folder**, not here. Until the
GitHub repos exist, the contracts package is linked as
`"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"` (a symlink).

## Stack

React 19 · TypeScript 6 · Vite 8 · TanStack Query v5 · react-router-dom v7 ·
Tailwind v4 · Recharts · oxlint. Everything is ESM.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on 5173 (the APIs must be started separately) |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | serve the production build (port 4173 — not in the APIs' `CORS_ORIGIN` by default) |
| `npm run lint` | oxlint |

There are no tests in the project yet — no test runner is set up.

To run the whole system: `npm run db:up` in `auto-lincoln-contracts`, then
`npm run dev` in each API folder and here.

## The contract

- The web app imports **only** the root export `@auto-lincoln/contracts`
  (routes, DTOs, domain types — browser-safe). Never `/auth` or `/db`: those
  are Node-only and must not end up in the bundle.
- The contract is changed in `auto-lincoln-contracts`, rebuilt there
  (`npm run build`), and only then used here. A new route is added to the
  contract first, then implemented in both APIs.
- The web never knows which backend answers — both must behave identically.

## Architecture rules

- **Feature-based structure.** `src/features/<feature>/{api,hooks,model,ui}`.
  A feature does not import another feature — shared code moves up into
  `components/` or `lib/`.
- **Dependency direction:** `pages → features → components/ui → lib`.
- **Data access layer.** Only files in `features/*/api/` call
  `lib/apiClient`. A component calls a hook, the hook calls `api/`.
  Components know nothing about HTTP or which backend is selected.
- **Backend selection** — `lib/backend.ts` (store) +
  `components/layout/BackendSwitcher.tsx`. The browser calls the selected
  API **directly**: `BACKEND_URLS` in `lib/apiClient.ts`
  (`VITE_EXPRESS_API_URL` → :3001, `VITE_NEST_API_URL` → :3002), always with
  `credentials: 'include'`. There is no Vite proxy. The APIs allow the web
  origin through CORS (`CORS_ORIGIN`, default `http://localhost:5173`).
- **Server state — TanStack Query only** (including the current user,
  `authKeys.me()`). No `useState` + `useEffect` for fetching data. Local UI
  state — plain `useState`.
- **Query keys are factories** (`partsKeys.list(filters)`) in
  `features/*/api/`, not strings scattered across files — otherwise
  invalidation misses.
- **Pages in `pages/` — composition only.** They contain no logic.
- **Protected routes** — via `ProtectedRoute`, not via checks inside
  components.
- **Alias `@/` = `src/`.** We do not write relative `../../`.
- The session is an httpOnly cookie (`al_session`) — the web has no token
  handling and no secrets. `VITE_*` variables end up in the bundle: only
  public values (API URLs) go there.

## How to work with me

- I write the code myself. Help me pointwise: problem → where to change it →
  a minimal example → why this way.
- Do not generate large files without an explicit request.
- Before implementing a feature — first a plan and my confirmation.
- Reply in Ukrainian.

## Documentation — read before working

- `docs/architecture.md` — before changing the structure, layers, the API
  client or auth handling in the web app
- `docs/catalogue-page.md` — before any work on `/parts/catalogue`
  (spec: layout, data models, cascading filters)
- `docs/dashboard-page.md` — before any work on the dashboard
- `docs/ui-guidelines.md` — before writing markup (tokens, component
  conventions)
- `docs/product.md` — what the product is, its sections and their status
- `docs/roadmap.md` — current state of the whole project and the next step
- `docs/open-questions.md` — known problems and technical debt for all four
  folders; do not resolve them silently, ask me first
- `docs/migration/` — record of the split from the monorepo (2026-09-23)

Routes, DTOs, the DB schema and the auth flow are documented in
`auto-lincoln-contracts/docs/architecture.md`.
