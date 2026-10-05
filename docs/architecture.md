# Architecture (web app)

This repo is the web app. The rest of the system lives in sibling folders:

| Folder | Covers |
| --- | --- |
| `auto-lincoln-contracts` | the HTTP and WebSocket contract: zod schemas, inferred types, `API_ROUTES`, `WS_ROUTES`, the cookie name — see its `README.md` |
| `auto-lincoln-api-nest` | the NestJS API, Prisma schema, migrations, seed, PostgreSQL in Docker — see its `README.md` |

## The system

```
           @auto-lincoln/contracts  (zod schemas + types, browser-safe)
                 ▲                         ▲
                 │                         │
         auto-lincoln-web  ──HTTP/WS──▶  auto-lincoln-api-nest :3002
           (web :5173)                         │
                                         PostgreSQL :5432
```

- The web app and the API import the same package, so request and response
  shapes are defined once. The web imports only types and constants
  (`import type` for the schemas' inferred types); zod itself stays out of
  the bundle thanks to `"sideEffects": false` in the contracts.
- The dependency is `"@auto-lincoln/contracts": "file:../auto-lincoln-contracts"`
  — npm symlinks the folder, so the web uses its **built** `dist/`. After a
  change there, run `npm run build` in `auto-lincoln-contracts`.

The contract is imported in `lib/apiClient.ts` (`API_PREFIX`,
`ApiErrorBody`), `features/auth/api/authApi.ts` (`API_ROUTES`,
`LoginRequest`, `LoginResponse`), `features/dashboard/api/dashboardApi.ts`
and `features/dashboard/ui/*` (`DashboardResponse` and its item types),
`features/support/api/chatSocket.ts` (`WS_ROUTES`, `ClientChatEvent`,
`ServerChatEvent`) and `features/support/model/chatReducer.ts`
(`ChatMessage`, `ServerChatEvent`).

## Repo layout

```
.
├── index.html            # entry; Google Fonts (Karla + DM Sans)
├── vite.config.ts        # React + Tailwind plugins, @/ alias (no API proxy)
├── tsconfig.json         # references tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json     # src/, bundler resolution, @/* paths
├── tsconfig.node.json    # vite.config.ts
├── .oxlintrc.json
├── .env.example          # VITE_API_URL (API base URL)
├── public/               # favicon.svg, icons.svg, categories/*.jpg
├── src/                  # see below
└── docs/
```

## API calls

```
component → hook → features/*/api → lib/apiClient
                                        │ API_URL + API_PREFIX + path
                                        │ fetch(…, { credentials: 'include' })
                                        ▼
                               http://localhost:3002/api/…

SupportChat → useSupportChat → features/support/api/chatSocket
                                        │ new WebSocket(WS_URL + WS_ROUTES.chat)
                                        ▼
                               ws://localhost:3002/ws/chat
```

The browser talks to the API directly — in DevTools → Network the request
URL is `localhost:3002`. There is no Vite proxy.

- `lib/apiClient.ts` — `API_URL` (from `VITE_API_URL`, default
  `http://localhost:3002`), `WS_URL` (the same URL with `http` → `ws`) and
  `apiRequest<T>()`: JSON in/out, `credentials: 'include'`, throws
  `ApiError` with the HTTP status and the `message` from the body.
- The support chat does not go through `apiRequest`; its socket is opened
  in `features/support/api/chatSocket.ts` — see `support-chat.md`.

### CORS and the cookie

- `localhost:5173` and `localhost:3002` are **different origins**, so the
  API sends CORS headers: `Access-Control-Allow-Origin: <CORS_ORIGIN>`
  (exact, `*` is not allowed with cookies) and
  `Access-Control-Allow-Credentials: true`. A POST with a JSON body is
  preceded by a preflight `OPTIONS` → 204.
- Without `credentials: 'include'` the browser neither sends `al_session`
  nor stores the cookie from `Set-Cookie`.
- They are still the **same site** (SameSite ignores ports), so
  `SameSite=Lax` works. The WebSocket handshake to the same host carries
  the cookie too; the chat gateway also checks the `Origin` header.
- If Vite runs on a port other than 5173, or the app is served from another
  host, `CORS_ORIGIN` in the API must be changed.

## Authentication in the web app

Flow: login → `al_session` httpOnly cookie → `/auth/me` → logout. The
routes are listed in `auto-lincoln-api-nest/README.md`.

- `features/auth/api/authApi.ts` — `login`, `logout`, `fetchCurrentUser`
  (401 → `null`, not an error).
- `api/authQueries.ts` — `meQueryOptions` (`authKeys.me()` +
  `fetchCurrentUser`), shared by `useAuth` and the route guards.
- `hooks/useAuth.ts` — `useQuery(meQueryOptions)`, returns
  `{ user, isLoading }`. There is no auth context — the current user is
  server state.
- `hooks/useLogin.ts` — `useLogin` puts the user into the `me` cache and
  navigates to `/dashboard`; `useLogout` clears the whole cache and navigates to
  `/login`.
- Route guards are `beforeLoad` in `app/router/routes.tsx`: they read the
  user with `queryClient.ensureQueryData(meQueryOptions)` (same cache as
  `useAuth`). The pathless `protected` route redirects to `/login` without a
  user; `/login` redirects to `/dashboard` with one. A failed `/auth/me` (API down,
  5xx) counts as "no session", so `/login` still opens. While the check is
  pending the router shows `defaultPendingComponent` (a `Spinner`).

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
│       └── routes.tsx              # TanStack Router: route tree, beforeLoad guards, createRouter
├── pages/                          # composition only
│   ├── login/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx
│   ├── catalogue/CataloguePage.tsx # placeholder
│   ├── support/SupportPage.tsx     # PageHeader + SupportChat
│   ├── PlaceholderPage.tsx         # generic "in progress" page
│   └── NotFoundPage.tsx
├── features/
│   ├── auth/{api,hooks,ui}
│   ├── dashboard/{api,hooks,ui}    # GET /api/dashboard, see dashboard-page.md
│   └── support/{api,hooks,model,ui} # WebSocket chat, see support-chat.md
├── components/
│   ├── icons/                      # SVG icon components, one per file
│   ├── layout/                     # AppLayout, Sidebar, navigation, Topbar
│   └── ui/                         # Button, Input, Select, Spinner, ErrorState, PageHeader
└── lib/                            # apiClient, queryClient, cn, useMediaQuery
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
`DashboardPage → useDashboard() → fetchDashboard() → apiRequest()`
and `LoginForm → useLogin() → login() → apiRequest()`. The support chat has
the same shape over a WebSocket instead of `apiRequest`:
`SupportChat → useSupportChat() → connectChat() → WebSocket(WS_URL)`. The catalogue will
follow the same shape (planned, none of these names exist yet):

```
CataloguePage → useCategories() → categoriesApi.fetchCategories() → apiRequest()
   (pages)        (features/hooks)        (features/api)                (lib)
```

### Route tree

```
/login                  LoginPage                       public
(pathless)              protected (beforeLoad guard) → AppLayout
├── /                   → redirects to /dashboard
├── /dashboard          DashboardPage
├── /dashboard/updates  PlaceholderPage
├── /dashboard/posts    PlaceholderPage
├── /dashboard/media    PlaceholderPage
├── /parts              → redirects to /parts/catalogue
├── /parts/catalogue    CataloguePage
├── /parts/in-stock     PlaceholderPage
├── /parts/orders       PlaceholderPage
├── /parts/price-list   PlaceholderPage
├── /documents          PlaceholderPage
├── /warranty-claims    PlaceholderPage
└── /support            SupportPage (WebSocket chat)
*                       NotFoundPage (root notFoundComponent)
```

Every sidebar link has a route; sections without real content render
`PlaceholderPage`.

Known deviations from the layer rules in the current code:

- `components/layout/Topbar.tsx` imports `features/auth` hooks — see
  `open-questions.md` #6.
- The `protected` guard redirects to `/login` without remembering the
  original location, and `useLogin` always navigates to `/dashboard`.

### Application state

| Kind of state | Where it lives |
| --- | --- |
| server data (API) | TanStack Query |
| current user | TanStack Query (`authKeys.me()`) |
| support chat (WebSocket stream) | `useReducer(chatReducer)` in `useSupportChat` — a deliberate exception to TanStack Query, see `support-chat.md` |
| local UI (forms, modals) | `useState` inside the component |
| sidebar collapsed / user menu open | `useState` in `Sidebar` / `Topbar`, not persisted |
| catalogue filters | planned in the URL (`useSearchParams`) so links are shareable |

No Redux, Zustand or app-level React Context is used for state. `queryClient` is a
module singleton (`lib/queryClient.ts`); `useLogin.ts` and the route guards
import it directly rather than via `useQueryClient()`.

`QueryClient` defaults (`lib/queryClient.ts`): `staleTime` 5 min,
`refetchOnWindowFocus: false`, `retry: 1`.

## Configuration

| File | Variables |
| --- | --- |
| `.env.local` (optional, copy from `.env.example`) | `VITE_API_URL` — API base URL, bundled into the client (typed in `src/vite-env.d.ts`) |

Default: `http://localhost:3002`. The web app has no secrets — `VITE_*`
values are public by design.

The `@/` → `src/` alias is configured in `vite.config.ts` and
`tsconfig.app.json`.

Environment of the API: see `auto-lincoln-api-nest/README.md`.
