# Auto Lincoln — auto parts catalogue admin panel (web)

React 19 + Vite SPA. It talks to one backend, the NestJS API. The project is
split into three folders next to each other:

| Folder | What it is | Port |
| --- | --- | --- |
| `auto-lincoln-web` (this repo) | web app | 5173 |
| `auto-lincoln-contracts` | `@auto-lincoln/contracts`: the HTTP and WebSocket contract (zod schemas, types, route names) | — |
| `auto-lincoln-api-nest` | NestJS API, Prisma, PostgreSQL 17 in Docker | 3002 (DB 5432) |

What is built and what is next: [`docs/roadmap.md`](docs/roadmap.md).

## Getting started

Requires Node 24 and Docker with the daemon running. All three folders must
sit side by side — the contracts package is linked as
`file:../auto-lincoln-contracts`.

```bash
# 1. contracts
cd ../auto-lincoln-contracts && npm install && npm run build

# 2. database + API (see auto-lincoln-api-nest/README.md)
cd ../auto-lincoln-api-nest && cp .env.example .env && npm install
docker compose up -d && npx prisma migrate dev && npx prisma generate && npx prisma db seed
npm run dev

# 3. this app
cd ../auto-lincoln-web && npm install
# optional, only to change the API URL (default http://localhost:3002):
# cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173` and sign in with a test account from
`auto-lincoln-api-nest/README.md`. Roles are not enforced yet (open
question #5), so every account sees the same panel.

The browser calls the API directly: REST requests go to
`http://localhost:3002/api/...`, the support chat connects to
`ws://localhost:3002/ws/chat`. Health check:
`http://localhost:3002/api/health`.

The API accepts requests from `http://localhost:5173` only (`CORS_ORIGIN`
in its `.env`). If Vite starts on another port (5173 busy), requests are
blocked by CORS.

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
- [`docs/architecture.md`](docs/architecture.md) — web app structure, layers, API calls, auth in the UI
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — catalogue page spec
- [`docs/dashboard-page.md`](docs/dashboard-page.md) — dashboard page spec
- [`docs/support-chat.md`](docs/support-chat.md) — support chat spec (WebSocket)
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — tokens, components and UI conventions
- [`docs/roadmap.md`](docs/roadmap.md) — order of work (whole project)
- [`docs/open-questions.md`](docs/open-questions.md) — open questions and technical debt (whole project)
