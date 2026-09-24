# Architecture (web app)

This repo is the web app. The rest of the system lives in sibling folders;
each has its own `docs/architecture.md`:

| Folder | Covers |
| --- | --- |
| `auto-lincoln-contracts` | the REST contract, current routes, auth helpers, DB schema, migrations, auth flow |
| `auto-lincoln-api-express` | Express implementation |
| `auto-lincoln-api-nest` | NestJS implementation |

## The system

```
                  @auto-lincoln/contracts  (auto-lincoln-contracts)
                  ├── "."      shared: routes, DTOs, domain types (browser-safe)
                  ├── "./auth" scrypt + JWT (Node only)
                  └── "./db"   Prisma client (Node only)
                     ▲              ▲                 ▲
                     │ "."          │ ".", auth, db   │ ".", auth, db
              auto-lincoln-web  api-express :3001  api-nest :3002
                (web :5173)          └── PostgreSQL :5432 ──┘
```

- The web app depends only on the root export `@auto-lincoln/contracts`
  (`src/shared` of the contracts package). It never sees Prisma or auth.
- The dependency is `"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"`
  — npm symlinks the folder, so the web uses its **built** `dist/`. After a
  change there, run `npm run build` in `auto-lincoln-contracts`.
- In dev, Vite resolves the symlink to
  `/@fs/…/auto-lincoln-contracts/dist/shared/*.js` and serves it; no
  `server.fs.allow` setting was needed.

The contract is imported in four files: `lib/apiClient.ts` (`API_PREFIX`,
`ApiErrorBody`), `lib/backend.ts` and `components/layout/BackendSwitcher.tsx`
(`BACKENDS`, `Backend`), `features/auth/api/authApi.ts` (`API_ROUTES`,
`AuthUser`, `LoginRequest`).

## Repo layout

```
.
├── index.html            # entry; Google Fonts (Karla + DM Sans)
├── vite.config.ts        # React + Tailwind plugins, @/ alias (no API proxy)
├── tsconfig.json         # references tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json     # src/, bundler resolution, @/* paths
├── tsconfig.node.json    # vite.config.ts
├── .oxlintrc.json
├── .env.example          # VITE_EXPRESS_API_URL, VITE_NEST_API_URL (API base URLs)
├── public/               # favicon.svg, icons.svg, categories/*.jpg
├── src/                  # see below
└── docs/
```

## Backend switching

```
component → hook → features/*/api → lib/apiClient
                                        │ BACKEND_URLS[getBackend()] + API_PREFIX + path
                                        │ fetch(…, { credentials: 'include' })
                     ┌──────────────────┴──────────────────┐
     express → http://localhost:3001/api/…      nest → http://localhost:3002/api/…
```

The browser talks to the selected API directly — in DevTools → Network the
request URL is the API's own (`localhost:3001` / `localhost:3002`). There is
no Vite proxy (removed on 2026-09-23; before that requests went to
`localhost:5173/api/<backend>/…` and Vite forwarded them).

- `lib/backend.ts` — a tiny external store (`useSyncExternalStore`), the
  choice persisted in `localStorage` (`auto-lincoln:backend`), default
  `express`. `getBackend()` is used outside React by `apiClient`.
- `components/layout/BackendSwitcher.tsx` — in the Topbar and on the login
  page. On change it calls `queryClient.resetQueries()` so data from one
  backend is never shown as data from the other.
- `lib/apiClient.ts` — `BACKEND_URLS` (from `VITE_EXPRESS_API_URL` /
  `VITE_NEST_API_URL`, defaults `http://localhost:3001` / `:3002`) and
  `apiRequest<T>()`: JSON in/out, `credentials: 'include'`, throws
  `ApiError` with the HTTP status and the `message` from the body.
- Only the selected backend is involved in a request; the other one may be
  down.

### CORS and the cookie

- `localhost:5173` and `localhost:300x` are **different origins**, so both
  APIs send CORS headers: `Access-Control-Allow-Origin: <CORS_ORIGIN>`
  (exact, `*` is not allowed with cookies) and
  `Access-Control-Allow-Credentials: true`. A POST with a JSON body is
  preceded by a preflight `OPTIONS` → 204.
- Without `credentials: 'include'` the browser neither sends `al_session`
  nor stores the cookie from `Set-Cookie`.
- They are still the **same site** (SameSite ignores ports), so
  `SameSite=Lax` works, and the cookie is scoped to the host `localhost`,
  not the port — a session created on :3001 is sent to :3002 too.
- If Vite runs on a port other than 5173, or the app is served from another
  host, `CORS_ORIGIN` in both APIs must be changed.

## Authentication in the web app

The flow itself (login → `al_session` httpOnly cookie → `/auth/me` →
logout) is described in `auto-lincoln-contracts/docs/architecture.md`. Both
APIs share `JWT_SECRET` and the cookie is scoped to the host, not the port,
so a session created through one backend is valid on the other.

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

The token is not readable from JavaScript (`document.cookie`); the browser
attaches it to requests made with `credentials: 'include'`, so `apiClient`
has no token handling. To inspect it: DevTools → Application → Cookies
(`localhost`).

## Source (`src/`)

```
src/
├── app/
│   ├── App.tsx                     # AppProviders + RouterProvider
│   ├── providers/AppProviders.tsx  # QueryClientProvider + Devtools
│   └── router/
│       ├── routes.tsx              # TanStack Router: createRouter, route tree
│       └── ProtectedRoute.tsx
├── pages/                          # composition only
│   ├── login/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx
│   ├── catalogue/CataloguePage.tsx # placeholder
│   ├── support/SupportPage.tsx     # empty
│   └── NotFoundPage.tsx
├── features/
│   ├── auth/{api,hooks,ui}
│   └── dashboard/{api,hooks,ui}    # mock data, see dashboard-page.md
├── components/
│   ├── icons/                      # SVG icon components, one per file
│   ├── layout/                     # AppLayout, Sidebar, navigation, Topbar, BackendSwitcher
│   └── ui/                         # Button, Input, Select, Spinner, ErrorState, PageHeader
└── lib/                            # apiClient, backend, queryClient, cn, useMediaQuery
```

Static files live in `public/` (`favicon.svg`, `icons.svg`,
`categories/*.jpg` — 12 category images, not referenced by the code yet).

`features/catalogue/` does not exist yet — it is created with the first
catalogue step.

### Layers

```
pages  →  features  →  components/ui  →  lib
```

A component never calls `apiClient` directly. The implemented chain is
`DashboardPage → useDashboard() → fetchDashboard()` (mock, no `apiRequest`)
and `LoginForm → useLogin() → login() → apiRequest()`. The catalogue will
follow the same shape (planned, none of these names exist yet):

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
├── /parts/catalogue    CataloguePage
└── /support            SupportPage (empty for now)
*                       NotFoundPage (root notFoundComponent)
```

The remaining sidebar sections (`in-stock`, `orders`, `price-list`,
`documents`, `warranty-claims`, dashboard sub-pages) have no routes yet —
those links lead to a 404.

Known deviations from the layer rules in the current code:

- `components/layout/Topbar.tsx` imports `features/auth` hooks — see
  `open-questions.md` #6.
- `pages/login/LoginPage.tsx` calls `useAuth()` and redirects a logged-in
  user, i.e. the page is not pure composition.
- `ProtectedRoute` redirects to `/login` without remembering the original
  location, and `useLogin` always navigates to `/`.

### Application state

| Kind of state | Where it lives |
| --- | --- |
| server data (API) | TanStack Query |
| current user | TanStack Query (`authKeys.me()`) |
| selected backend | `lib/backend.ts` + `localStorage` |
| local UI (forms, modals) | `useState` inside the component |
| sidebar collapsed / user menu open | `useState` in `Sidebar` / `Topbar`, not persisted |
| catalogue filters | planned in the URL (`useSearchParams`) so links are shareable |

No Redux, Zustand or app-level React Context is used for state. `queryClient` is a
module singleton (`lib/queryClient.ts`); `useLogin.ts` and
`BackendSwitcher.tsx` import it directly rather than via `useQueryClient()`.

`QueryClient` defaults (`lib/queryClient.ts`): `staleTime` 5 min,
`refetchOnWindowFocus: false`, `retry: 1`.

## Configuration

| File | Variables |
| --- | --- |
| `.env.local` (optional, copy from `.env.example`) | `VITE_EXPRESS_API_URL`, `VITE_NEST_API_URL` — API base URLs, bundled into the client (typed in `src/vite-env.d.ts`) |

Defaults: `http://localhost:3001` and `http://localhost:3002`. The web app
has no secrets — `VITE_*` values are public by design.

The `@/` → `src/` alias is configured in `vite.config.ts` and
`tsconfig.app.json`.

Environment of the other folders: see their `README.md`.
