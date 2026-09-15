# Auto Lincoln — auto parts catalogue admin panel

npm-workspaces monorepo:

| Workspace | What it is |
| --- | --- |
| `apps/web` | React 19 + Vite SPA with a switcher between the two APIs |
| `apps/api-express` | Express 5 API (port 3001) |
| `apps/api-nest` | NestJS 12 API (port 3002) |
| `packages/shared` | REST contract and domain types used by all apps |
| `packages/db` | Prisma schema and client (PostgreSQL) |

Both APIs implement the same contract from `packages/shared`, so the web app
can talk to either of them.

## Getting started

Requires Node 24+ and Docker.

```bash
npm install

# env files (defaults work for local development)
cp packages/db/.env.example packages/db/.env
cp apps/api-express/.env.example apps/api-express/.env
cp apps/api-nest/.env.example apps/api-nest/.env

npm run db:up        # Postgres in Docker
npm run db:migrate   # apply the Prisma schema
npm run dev          # web http://localhost:5173 + both APIs
```

Health checks: `http://localhost:5173/api/express/health` and
`http://localhost:5173/api/nest/health` (through the Vite proxy).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | build packages, run web + both APIs |
| `npm run build` | build every workspace |
| `npm run lint` | oxlint |
| `npm run db:up` / `npm run db:down` | start / stop Postgres |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:generate` | regenerate the Prisma client |

## Documentation

- [`docs/product.md`](docs/product.md) — what the product is and its sections
- [`docs/architecture.md`](docs/architecture.md) — structure, layers, auth flow
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — catalogue page spec
- [`docs/roadmap.md`](docs/roadmap.md) — order of work and technical debt
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — tokens and UI conventions
- [`CLAUDE.md`](CLAUDE.md) — rules for working with Claude Code
