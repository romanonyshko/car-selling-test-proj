# Architecture

## Monorepo

npm workspaces, everything is ESM, TypeScript 6.

```
.
├── package.json            # workspaces + root scripts (dev, build, lint, db:*)
├── tsconfig.base.json      # shared compilerOptions for Node packages and APIs
├── docker-compose.yml      # PostgreSQL 17 for local development
├── .oxlintrc.json          # one lint config for the whole repo
├── apps/
│   ├── web/                # React SPA
│   ├── api-express/        # Express 5 API, port 3001
│   └── api-nest/           # NestJS 12 API, port 3002
└── packages/
    ├── shared/             # REST contract + domain types (browser-safe)
    ├── auth/               # password hashing + JWT sessions (Node only)
    └── db/                 # Prisma schema, migrations, seed, client
```

### Dependency graph

```
shared  ←  auth  ←  db
  ↑         ↑       ↑
  ├── web   │       │
  ├── api-express ──┤
  └── api-nest ─────┘
```

- `web` depends only on `shared`. It never sees Prisma or `auth`.
- Apps never import each other.
- Packages are built to `dist/` in the order `shared → auth → db`
  (`npm run build:packages`, also run by `predev`). Apps import the built
  output, so a change in a package needs a rebuild.

## The contract (`packages/shared`)

`src/api.ts` is the single description of the REST API:

- `API_PREFIX` (`/api`) and `API_ROUTES` — route paths;
- `BACKENDS` / `Backend` — `'express' | 'nest'`;
- `AUTH_COOKIE_NAME` — the session cookie name;
- request/response types: `HealthResponse`, `LoginRequest`, `AuthUser`,
  `ApiErrorBody` (`{ message }` for every error).

`src/models.ts` holds the domain types (`Category`, `Carmaker`, `CarModel`,
`Engine`, `Part`, `PartsFilters`, `AppUser`, `UserRole`). Dates are ISO 8601
strings.

**Rule:** a new endpoint is added to `shared` first, then implemented in
Express, then in Nest, with identical paths, status codes and bodies.

### Current routes

| Method | Path | Express | Nest |
| --- | --- | --- | --- |
| GET | `/api/health` | ✅ | ✅ |
| POST | `/api/auth/login` | ✅ | ✅ |
| GET | `/api/auth/me` | ✅ | ✅ |
| POST | `/api/auth/logout` | ✅ | ✅ |

**Error body** is `ApiErrorBody`: `{ message, statusCode, error? }`. Both APIs
return it for 400, 401 and 404, including unknown routes. The one remaining
difference: on an unhandled 500 Nest omits `error` (its base exception filter
returns `{ statusCode, message }`), Express always includes it.

## Database (`packages/db`)

- PostgreSQL in Docker (`npm run db:up`), data in the `postgres-data` volume.
- `prisma/schema.prisma` — one schema for both APIs. Tables: `users`,
  `categories`, `carmakers`, `car_models`, `engines`, `parts`, plus the
  implicit many-to-many join table between `parts` and `engines`
  (`Part.compatibleEngineIds` in the contract).
- `prisma.config.ts` — schema path, migrations path, seed command, and
  `DATABASE_URL` from `packages/db/.env`.
- `prisma/migrations/` — committed; `npm run db:migrate` creates new ones.
- `prisma/seed.ts` — idempotent `upsert` of the admin user from
  `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
- `src/index.ts` — re-exports the generated client and
  `createPrismaClient(url)` (driver adapter `@prisma/adapter-pg`). The
  generated client (`src/generated/`) is not committed.
- Two tsconfigs: `tsconfig.json` type-checks everything (editor, `noEmit`),
  `tsconfig.build.json` compiles only `src/` to `dist/`.

## Authentication

### `packages/auth`

- `hashPassword` / `verifyPassword` — scrypt with a random salt, stored as
  `salt:hash`, compared with `timingSafeEqual`.
- `signSession` / `verifySession` — HS256 JWT via `jose`, payload
  `{ sub: userId, role }`, 7 days (`SESSION_MAX_AGE_MS`).

### Flow

Implemented in Nest; Express is next.

1. `POST /auth/login` checks the password and sets the JWT in the
   `al_session` cookie (`httpOnly`, `sameSite: 'lax'`, `path: '/'`,
   `secure` in production). The body is the `AuthUser` — the token is
   **never** in the body. Missing fields → 400, wrong email or password →
   401 with the same message.
2. `GET /auth/me` verifies the cookie and loads the user from the DB → 200
   `AuthUser` or 401.
3. `POST /auth/logout` clears the cookie → 204.

The token is not readable from JavaScript (`document.cookie`); the browser
attaches it to every same-origin request, so `apiClient` has no token
handling. To inspect it: DevTools → Application → Cookies.

Both APIs use the same `JWT_SECRET`, and cookies are scoped to the host, not
the port — so a session created through one backend is valid on the other.

### In the web app

- `features/auth/api/authApi.ts` — `login`, `logout`, `fetchCurrentUser`
  (401 → `null`, not an error).
- `hooks/useAuth.ts` — `useQuery(authKeys.me())`, returns
  `{ user, isLoading }`. There is no auth context — the current user is
  server state.
- `hooks/useLogin.ts` — `useLogin` puts the user into the `me` cache and
  navigates to `/`; `useLogout` clears the whole cache and navigates to
  `/login`.
- `ProtectedRoute` shows a `Spinner` while `isLoading` (does not redirect),
  then redirects to `/login` if there is no user.

## Backend switching (web)

```
component → hook → features/*/api → lib/apiClient → fetch('/api/<backend>/…')
                                                          │ Vite dev proxy
                                     /api/express/* → http://localhost:3001/api/*
                                     /api/nest/*    → http://localhost:3002/api/*
```

- `lib/backend.ts` — a tiny external store (`useSyncExternalStore`), the
  choice persisted in `localStorage` (`auto-lincoln:backend`), default
  `express`. `getBackend()` is used outside React by `apiClient`.
- `components/layout/BackendSwitcher.tsx` — in the Topbar and on the login
  page. On change it calls `queryClient.resetQueries()` so data from one
  backend is never shown as data from the other.
- `lib/apiClient.ts` — `apiRequest<T>()`, JSON in/out, throws `ApiError`
  with the HTTP status and the `message` from the body.
- The browser always talks to its own origin, so the cookie needs no CORS
  configuration. Proxy targets can be overridden with `EXPRESS_API_URL` /
  `NEST_API_URL` in `apps/web/.env.local`.

## APIs

### `apps/api-express`

```
src/
├── main.ts            # imports config/env first, then listens
├── app.ts             # createApp(): json parser, routers under /api
├── config/env.ts      # loads .env, validates PORT / DATABASE_URL / JWT_SECRET
├── lib/prisma.ts      # a single PrismaClient
└── routes/health.ts
```

Express 5 forwards errors from async handlers to the error middleware on its
own — no `try/catch` wrappers are needed.

### `apps/api-nest`

```
src/
├── main.ts                     # env first, reflect-metadata, cookie-parser, prefix /api
├── app.module.ts               # imports PrismaModule, AuthModule
├── config/env.ts
├── prisma/prisma.module.ts     # @Global, provides PrismaClient
├── health/health.controller.ts
└── auth/
    ├── auth.module.ts              # AuthController + AuthService + AuthGuard
    ├── auth.controller.ts          # login / me / logout
    ├── auth.service.ts             # validateCredentials, findById (no HTTP here)
    ├── auth.guard.ts               # verifies the cookie JWT → request.authSession
    ├── current-session.decorator.ts  # @CurrentSession() → { userId, role }
    ├── auth.types.ts               # Session, AuthenticatedRequest
    └── to-auth-user.ts             # User (DB) → AuthUser
```

Nest runs as native ESM (`"type": "module"`, top-level `await` in `main.ts`).

Conventions and pitfalls:

- File names are kebab-case (`auth.service.ts`); one module per feature.
- Inject the database with `constructor(private readonly prisma: PrismaClient)`.
  Classes used for DI are imported with a **value** import — with
  `import type` the class disappears at runtime and DI fails.
- Types used in decorated parameters (`@Body() body: LoginRequest`,
  `@Res() res: Response`) must be imported with **`import type`**, otherwise
  `emitDecoratorMetadata` + `verbatimModuleSyntax` fail with TS1272.
- POST returns 201 by default — set `@HttpCode(...)` to match the contract.
- `@Res({ passthrough: true })` to set cookies and still `return` the body.
- Errors are thrown as Nest exceptions (`UnauthorizedException`,
  `BadRequestException`); services return `null`, controllers decide the
  HTTP status.
- `@CurrentSession()` only works on routes with `@UseGuards(AuthGuard)`.

## Web app (`apps/web/src`)

```
src/
├── app/
│   ├── App.tsx                     # AppProviders + RouterProvider
│   ├── providers/AppProviders.tsx  # QueryClientProvider + Devtools
│   └── router/
│       ├── routes.tsx              # createBrowserRouter, route tree
│       └── ProtectedRoute.tsx
├── pages/                          # composition only
│   ├── login/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx
│   ├── catalogue/CataloguePage.tsx # placeholder
│   └── NotFoundPage.tsx
├── features/
│   ├── auth/{api,hooks,ui}
│   └── dashboard/{api,hooks,ui}    # mock data, see dashboard-page.md
├── components/
│   ├── layout/                     # AppLayout, Sidebar, Topbar, BackendSwitcher
│   └── ui/                         # Button, Input, Select, Spinner, ErrorState
└── lib/                            # apiClient, backend, queryClient, cn
```

`features/catalogue/` does not exist yet — it is created with the first
catalogue step.

### Layers

```
pages  →  features  →  components/ui  →  lib
```

A component never calls `apiClient` directly:

```
CataloguePage → useCategories() → categoriesApi.fetchCategories() → apiRequest()
   (pages)        (features/hooks)        (features/api)                (lib)
```

### Route tree

```
/login                  LoginPage                       public
/                       ProtectedRoute → AppLayout
├── index               DashboardPage
├── /parts              → redirects to /parts/catalogue
└── /parts/catalogue    CataloguePage
*                       NotFoundPage
```

The remaining sidebar sections (`in-stock`, `orders`, `price-list`,
`documents`, `warranty-claims`, dashboard sub-pages) have no routes yet —
those links lead to a 404.

### Application state

| Kind of state | Where it lives |
| --- | --- |
| server data (API) | TanStack Query |
| current user | TanStack Query (`authKeys.me()`) |
| selected backend | `lib/backend.ts` + `localStorage` |
| local UI (forms, modals) | `useState` inside the component |
| catalogue filters | planned in the URL (`useSearchParams`) so links are shareable |

`QueryClient` defaults (`lib/queryClient.ts`): `staleTime` 5 min,
`refetchOnWindowFocus: false`, `retry: 1`.

## Configuration

Each workspace reads its own `.env` (not committed; copy from `.env.example`):

| File | Variables |
| --- | --- |
| `packages/db/.env` | `DATABASE_URL`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` |
| `apps/api-express/.env` | `PORT`, `DATABASE_URL`, `JWT_SECRET` |
| `apps/api-nest/.env` | `PORT`, `DATABASE_URL`, `JWT_SECRET` |
| `apps/web/.env.local` (optional) | `EXPRESS_API_URL`, `NEST_API_URL` |

`JWT_SECRET` must be identical in both APIs. The web app has no secrets —
nothing is exposed through `VITE_*` variables.

The `@/` → `apps/web/src/` alias is configured in `apps/web/vite.config.ts`
and `apps/web/tsconfig.app.json`.
