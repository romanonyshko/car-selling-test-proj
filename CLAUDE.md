# CLAUDE.md

Admin panel for the "Auto Lincoln" auto parts catalogue: managing categories,
parts, stock and orders. A learning project (internship), built from a mockup
provided by the mentor.

The repo is an npm-workspaces monorepo: one web app and **two interchangeable
backends** (Express and NestJS) implementing the same REST contract. The web
app has a switcher to choose which backend it talks to.

## Stack

- **web:** React 19 · TypeScript · Vite 8 · TanStack Query v5 ·
  react-router-dom v7 · Tailwind v4
- **api-express:** Express 5 · tsx (dev)
- **api-nest:** NestJS 12 (ESM) · @nestjs/cli
- **db:** PostgreSQL 17 (docker compose) · Prisma 7 with `@prisma/adapter-pg`
- **auth:** JWT (`jose`, HS256) in an httpOnly cookie, passwords hashed with
  scrypt (`node:crypto`). Same `JWT_SECRET` in both APIs.
- Tooling: npm workspaces · TypeScript 6 · oxlint. Everything is ESM.

## Structure

```
apps/web            Vite SPA (feature-based, see below), port 5173
apps/api-express    Express API, port 3001
apps/api-nest       NestJS API, port 3002
packages/shared     REST contract (routes, DTOs) + domain types — browser-safe
packages/auth       password hashing + JWT sessions — Node only
packages/db         Prisma schema, migrations, seed, createPrismaClient()
```

Build order: `shared → auth → db → apps`. `packages/*` are built to `dist/`
and consumed by the apps. After changing them, run `npm run build:packages`
(runs automatically before `npm run dev`).

## Commands (from the repo root)

| Command | What it does |
| --- | --- |
| `npm run dev` | builds packages, then web + both APIs |
| `npm run build` | builds every workspace |
| `npm run lint` | oxlint over the whole repo |
| `npm run db:up` / `db:down` | start / stop Postgres in Docker |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | regenerate the Prisma client |
| `npm run db:seed` | create the admin user from `SEED_ADMIN_*` |
| `npm run dev -w @auto-lincoln/<name>` | run one workspace |
| `npm install <pkg> -w @auto-lincoln/<name>` | add a dependency to one workspace |

Internal dependencies are declared as `"@auto-lincoln/<name>": "*"`.

There are no tests in the project yet — no test runner is set up.

## Architecture rules

### Whole repo
- **One contract.** Routes and request/response types live in
  `packages/shared`. Both APIs implement every route in it identically —
  otherwise the backend switcher breaks. A route is added to `shared` first,
  then implemented in both APIs (in either order, each in its own branch).
  `docs/architecture.md` → "Current routes" tracks which API has what.
- **Domain entity types** — in `packages/shared/src/models.ts`.
- **`shared` stays browser-safe.** Node-only code (crypto, JWT) goes to
  `packages/auth`.
- **Database access** only through `packages/db`. Apps do not import
  `@prisma/*` directly.
- **DB models never leave an API as-is.** Map them to contract types
  (e.g. `toAuthUser`) so fields like `passwordHash` are never sent.
- Apps do not import each other.
- Relative imports inside Node packages/apps use the `.js` extension
  (`nodenext` resolution).

### apps/api-nest
- One module per feature: `src/<feature>/<feature>.{module,controller,service}.ts`,
  kebab-case file names.
- Controllers handle HTTP only; services contain the logic and return
  `null` instead of throwing HTTP errors.
- Protected routes use `@UseGuards(AuthGuard)` + `@CurrentSession()`.
- DI classes → value `import`; types in decorated parameters →
  `import type` (TS1272). Set `@HttpCode` on POST routes to match the
  contract. Details in `docs/architecture.md` → APIs.

### apps/web
- **Feature-based structure.** `src/features/<feature>/{api,hooks,model,ui}`.
  A feature does not import another feature — shared code moves up into
  `components/` or `lib/`.
- **Dependency direction:** `pages → features → components/ui → lib`.
- **Data access layer.** Only files in `features/*/api/` call
  `lib/apiClient`. A component calls a hook, the hook calls `api/`.
  Components know nothing about HTTP or which backend is selected.
- **Backend selection** — `lib/backend.ts` (store) +
  `components/layout/BackendSwitcher.tsx`. Requests go to
  `/api/<backend>/...`, the Vite dev proxy forwards them to the right API.
- **Server state — TanStack Query only** (including the current user,
  `authKeys.me()`). No `useState` + `useEffect` for fetching data. Local UI
  state — plain `useState`.
- **Query keys are factories** (`partsKeys.list(filters)`) in
  `features/*/api/`, not strings scattered across files — otherwise
  invalidation misses.
- **Pages in `pages/` — composition only.** They contain no logic.
- **Protected routes** — via `ProtectedRoute`, not via checks inside
  components.
- **Alias `@/` = `apps/web/src/`.** We do not write relative `../../`.

## How to work with me

- I write the code myself. Help me pointwise: problem → where to change it →
  a minimal example → why this way.
- Do not generate large files without an explicit request.
- Before implementing a feature — first a plan and my confirmation.
- Reply in Ukrainian.

## Documentation — read before working

- `docs/architecture.md` — before changing the structure, routes, the API
  contract or working with data
- `docs/catalogue-page.md` — before any work on `/parts/catalogue`
  (spec: layout, data models, cascading filters)
- `docs/dashboard-page.md` — before any work on the dashboard
- `docs/ui-guidelines.md` — before writing markup (tokens, component
  conventions)
- `docs/roadmap.md` — current state of the project and the next step
- `docs/open-questions.md` — known problems and technical debt;
  do not resolve them silently, ask me first

## Not a source of truth

`PROJECT-CONTEXT.md` — a generated snapshot of the project for external LLMs.
Do not read it when working on code: it goes stale after the very first
commit. The current state is always in the code and `docs/`.
