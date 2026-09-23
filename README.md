# Auto Lincoln — auto parts catalogue admin panel (web)

React 19 + Vite SPA with a switcher between two interchangeable APIs.
The project is split into four folders next to each other:

| Folder | What it is | Port |
| --- | --- | --- |
| `auto-lincoln-web` (this repo) | web app | 5173 |
| `auto-lincoln-contracts` | `@auto-lincoln/contracts`: REST contract, auth helpers, Prisma schema/migrations/seed, docker-compose (PostgreSQL 17) | 5432 |
| `auto-lincoln-api-express` | Express 5 API | 3001 |
| `auto-lincoln-api-nest` | NestJS 12 API | 3002 |

Both APIs implement the same contract (today: health and auth), so the web
app can talk to either of them. What is built and what is next:
[`docs/roadmap.md`](docs/roadmap.md).

## Getting started

Requires Node (the dev dependencies target Node 24) and Docker with the
daemon running. All four folders must sit side by side — the contracts
package is linked as `file:../auto-lincoln-contracts`.

```bash
# 1. database + contracts (see auto-lincoln-contracts/README.md)
cd ../auto-lincoln-contracts
cp .env.example .env && npm install
npm run db:up && npm run build && npm run migrate:deploy && npm run seed

# 2. each API in its own terminal (see their README.md)
cd ../auto-lincoln-api-express && cp .env.example .env && npm install && npm run dev
cd ../auto-lincoln-api-nest    && cp .env.example .env && npm install && npm run dev

# 3. this app
cd ../auto-lincoln-web
npm install
# optional, only to change the API URLs (defaults: :3001 / :3002):
# cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173` and sign in with a seeded account
(`auto-lincoln-contracts/.env`): `admin@autolincoln.local` / `admin12345`
(admin) or `test@autolincoln.local` / `test12345` (manager). Roles are not
enforced yet (open question #5), so both see the same panel.

The browser calls the APIs directly — in DevTools → Network requests go to
`http://localhost:3001/api/...` (Express) or `http://localhost:3002/api/...`
(Nest), depending on the switcher. Health checks:
`http://localhost:3001/api/health`, `http://localhost:3002/api/health`.

The APIs accept requests from `http://localhost:5173` only (`CORS_ORIGIN`
in their `.env`). If Vite starts on another port (5173 busy), requests are
blocked by CORS. Production setup: `docs/open-questions.md` #3.

After changing anything in `auto-lincoln-contracts`, run `npm run build`
there — this app uses its `dist/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | type-check + production build |
| `npm run preview` | serve the production build |
| `npm run lint` | oxlint |

There is no `test` script — the project has no tests yet.

## Documentation

- [`docs/product.md`](docs/product.md) — what the product is, its sections and their status
- [`docs/architecture.md`](docs/architecture.md) — web app structure, layers, backend switching, auth in the UI
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — catalogue page spec
- [`docs/dashboard-page.md`](docs/dashboard-page.md) — dashboard page spec
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — tokens, components and UI conventions
- [`docs/roadmap.md`](docs/roadmap.md) — order of work (whole project)
- [`docs/open-questions.md`](docs/open-questions.md) — open questions and technical debt (whole project)
- [`docs/migration/`](docs/migration/) — how the monorepo was split
- [`CLAUDE.md`](CLAUDE.md) — rules for working with Claude Code
