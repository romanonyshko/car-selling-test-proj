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
`auto-lincoln-api-nest/README.md`. Roles are not enforced yet, so every
account sees the same panel.

The browser calls the API directly, there is no dev proxy: REST requests go
to `http://localhost:3002/api/...`, the support chat connects to
`ws://localhost:3002/ws/chat`. The API accepts requests from
`http://localhost:5173` only (`CORS_ORIGIN` in its `.env`) — if Vite starts
on another port, requests are blocked by CORS.

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
