# Auto Lincoln — auto parts catalogue admin panel (web)

An admin panel for a company that sells auto parts: a manager browses the
parts catalogue, filters it by car, sees the dashboard and talks to customers
in a support chat.

React 19 + Vite SPA. It talks to one backend, the NestJS API. The project is
split into three folders that sit next to each other:

| Folder | What it is | Port |
| --- | --- | --- |
| `auto-lincoln-web` (this repo) | web app | 5173 |
| `auto-lincoln-contracts` | `@auto-lincoln/contracts`: the HTTP and WebSocket contract (zod schemas, types, route names) | — |
| `auto-lincoln-api-nest` | NestJS API, Prisma, PostgreSQL 17 in Docker | 3002 (DB 5432) |

## Live demo

**https://car-selling-test-proj.vercel.app**

| Email | Password | Role |
| --- | --- | --- |
| `client@autolincoln.local` | `client12345` | client |
| `test@autolincoln.local` | `test12345` | manager |
| `admin@autolincoln.local` | `admin12345` | admin |

Roles are not enforced yet, so every account sees the same panel. These are
seeded test accounts with demo data only.

The API runs on Render's free plan and sleeps after 15 minutes without
traffic. The first request after that takes about a minute; if the page
shows an error or a 504, wait a moment and refresh.

| Part | Where |
| --- | --- |
| Web app | Vercel, deployed from `main` |
| API | Render, `https://auto-lincoln-api.onrender.com` (health check: `/api/health`) |
| Database | Neon, PostgreSQL |

### How production is wired

- REST requests go to `/api/...` on the app's own domain; `vercel.json`
  forwards them to the API. To the browser the API is the same site, so the
  `httpOnly` session cookie works in every browser, Safari included.
- Vercel cannot proxy WebSockets, so the support chat connects to the API
  directly (`VITE_WS_URL`). Before connecting it gets a 60-second ticket from
  `POST /api/auth/ws-ticket` and passes it in the URL, because the session
  cookie is not sent to the API's own domain.
- Vercel environment: only `VITE_WS_URL=wss://auto-lincoln-api.onrender.com`.
  `VITE_API_URL` stays unset — a production build calls `/api` on its own
  domain.
- The API only accepts the chat from the origin in its `CORS_ORIGIN`
  (`https://car-selling-test-proj.vercel.app`), so per-deployment preview
  URLs show "Access denied." in the chat. Use the main URL above.

## Pages

| Route | What it shows |
| --- | --- |
| `/login` | sign-in form; signed-in users are redirected to the dashboard |
| `/dashboard` | "At a glance", latest news and review, request counts, activity chart, stat cards |
| `/parts/catalogue` | category grid or list (`?view=list`), filter panel Carmaker → Model → Engine |
| `/parts/catalogue/$categoryId` | parts of one category, filtered by the same panel |
| `/support` | real-time support chat over WebSocket |

Other menu items (Updates, Posts, Media, In stock, Orders, Price list,
Documents, Warranty claims) are placeholders.

## Stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript, Tailwind CSS v4 (CSS-first tokens in `src/index.css`) |
| Routing | TanStack Router, code-based routes in `src/app/router/routes.tsx` |
| Server state | TanStack Query (query keys per feature, devtools in development) |
| Charts | Recharts |
| Contract | `@auto-lincoln/contracts` — route names, request/response types shared with the API |
| Tooling | Vite 8, oxlint |

## Getting started

Requires Node 24 and Docker with the daemon running. The contracts package
is installed from GitHub
(`git+https://github.com/romanonyshko/auto-lincoln-contracts.git`) and builds
itself on install, so it does not need to be cloned.

```bash
# 1. database + API (see auto-lincoln-api-nest/README.md)
cd ../auto-lincoln-api-nest && cp .env.example .env && npm install
docker compose up -d && npx prisma migrate dev && npx prisma generate && npx prisma db seed
npm run dev

# 2. this app
cd ../auto-lincoln-web && npm install
# optional, only to change the API URL (default http://localhost:3002):
# cp .env.example .env.local
npm run dev
```

Open `http://localhost:5173` and sign in with a test account from
`auto-lincoln-api-nest/README.md`. Roles are not enforced yet, so every
account sees the same panel.

The browser calls the API directly, there is no dev proxy: REST requests go
to `http://localhost:3002/api/...`, the support chat connects to
`ws://localhost:3002/ws/chat`. The API accepts requests from
`http://localhost:5173` only (`CORS_ORIGIN` in its `.env`) — if Vite starts
on another port, requests are blocked by CORS.

After changing `auto-lincoln-contracts`, push it to GitHub and run
`npm update @auto-lincoln/contracts` here (and in the API) — otherwise the
app keeps the version pinned in `package-lock.json`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | type-check + production build |
| `npm run preview` | serve the production build |
| `npm run lint` | oxlint |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | run the tests once |
| `npm run test:coverage` | tests with a coverage report |

## Project structure

```
src/
  app/            providers and the router (routes, auth guards)
  pages/          one component per route; composes features
  features/       auth, catalogue, dashboard, support — each with
                  api/ (fetchers + query keys), hooks/, model/, ui/
  components/
    layout/       AppLayout, Sidebar, Topbar, PanelLayout (page + side panel)
    ui/           Button, Input, Select, PageHeader, Spinner, ErrorState
    icons/        SVG icons copied from the mockup
  lib/            apiClient (fetch wrapper), queryClient, small helpers
  index.css       Tailwind theme: colours, type scale and layout sizes from the mockup
```

## Key decisions

- **Session cookie, not tokens.** The API sets an `httpOnly` `al_session`
  cookie; every request is sent with `credentials: 'include'`. Route guards
  in `routes.tsx` call `/auth/me` through React Query before rendering.
- **One shared contract.** Route names and DTO types come from
  `@auto-lincoln/contracts`, so the web app and the API cannot drift apart
  silently.
- **URL is the state for the catalogue.** Filters (`make`, `model`,
  `engine`) and the view mode (`view=list`) live in search params, validated
  in the route — a filtered page can be bookmarked or shared.
- **Design tokens, not magic numbers.** Colours, type sizes and layout sizes
  measured from the Figma mockup are Tailwind theme tokens in
  `src/index.css`.
- **Container queries for layout.** The dashboard switches between one and
  two columns by the width of the content area, not the viewport, because
  the sidebar can be collapsed.
