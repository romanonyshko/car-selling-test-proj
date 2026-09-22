# Auto Lincoln — auto parts catalogue admin panel

npm-workspaces monorepo:

| Workspace | What it is | Port |
| --- | --- | --- |
| `apps/web` | React 19 + Vite SPA with a switcher between the two APIs | 5173 |
| `apps/api-express` | Express 5 API | 3001 |
| `apps/api-nest` | NestJS 12 API | 3002 |
| `packages/shared` | REST contract and domain types used by all apps | — |
| `packages/auth` | password hashing and JWT sessions (used by both APIs) | — |
| `packages/db` | Prisma schema, migrations, seed and client (PostgreSQL 17) | 5432 |

Both APIs implement the same contract from `packages/shared` (today: health
and auth), so the web app can talk to either of them. What is built and what
is next: [`docs/roadmap.md`](docs/roadmap.md).

## Getting started

Requires Node and Docker (with the daemon running). Node version: no
`engines` field or `.nvmrc` pins it; the dev dependencies target Node 24
(`@types/node` ^24).

```bash
npm install

# env files (the example defaults work for local development)
cp packages/db/.env.example packages/db/.env
cp apps/api-express/.env.example apps/api-express/.env
cp apps/api-nest/.env.example apps/api-nest/.env
# optional, only to change the proxy targets:
# cp apps/web/.env.example apps/web/.env.local

npm run dev
```

`npm run dev` first runs `predev`:

1. `db:up` — starts Postgres in Docker and waits for its healthcheck;
2. `build:packages` — builds `shared → auth → db` (includes `prisma generate`);
3. `db:deploy` — applies committed migrations (`prisma migrate deploy`);
4. `db:seed` — creates the admin user from `SEED_ADMIN_*` in
   `packages/db/.env` (idempotent).

Then `concurrently` starts web, Express and Nest. Open
`http://localhost:5173` and sign in with the seeded admin.

Health checks through the Vite proxy:
`http://localhost:5173/api/express/health` and
`http://localhost:5173/api/nest/health`.

The `/api/<backend>` proxy exists only in the Vite dev server — there is no
production setup yet (see `docs/open-questions.md` #3).

## Scripts (from the repo root)

| Command | What it does |
| --- | --- |
| `npm run dev` | `predev` (above), then web + both APIs |
| `npm run build` | build every workspace |
| `npm run build:packages` | build `shared`, `auth`, `db` — needed after changing a package |
| `npm run lint` | oxlint |
| `npm run db:up` / `npm run db:down` | start / stop Postgres |
| `npm run db:migrate` | `prisma migrate dev` — create and apply a new migration |
| `npm run db:deploy` | `prisma migrate deploy` — apply committed migrations |
| `npm run db:generate` | regenerate the Prisma client |
| `npm run db:seed` | create the admin user |

There is no `test` script — the project has no tests yet.

## Documentation

- [`docs/product.md`](docs/product.md) — what the product is, its sections and their status
- [`docs/architecture.md`](docs/architecture.md) — structure, layers, auth flow, configuration
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — catalogue page spec
- [`docs/dashboard-page.md`](docs/dashboard-page.md) — dashboard page spec
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — tokens, components and UI conventions
- [`docs/roadmap.md`](docs/roadmap.md) — order of work
- [`docs/open-questions.md`](docs/open-questions.md) — open questions and technical debt
- [`CLAUDE.md`](CLAUDE.md) — rules for working with Claude Code
