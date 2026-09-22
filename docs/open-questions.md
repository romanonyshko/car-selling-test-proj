# Open questions and technical debt

A list of what is deliberately unfinished or not yet decided. None of this
should be resolved silently while working on another task — ask first.

Question numbers are stable — other docs link to them. Last checked against
the code on 2026-09-22 (`dev`, `d8039ac`).

| # | Topic | Status |
| --- | --- | --- |
| 1 | Contract parity between the APIs | Open |
| 2 | Request validation | Open |
| 3 | Production routing to two backends | Open |
| 4 | `Part.price` type | Open (no parts endpoints yet) |
| 5 | Roles are not enforced | Open |
| 6 | `components/layout` imports `features/auth` | Open |
| 7 | Error body on 500 | Partially resolved (400/401/404 done) |
| 8 | Refresh tokens | Open |

## Open questions

### 1. How is contract parity between the two APIs verified?

Both APIs must return the same paths, status codes and bodies — otherwise
the backend switcher breaks. Right now this relies on discipline only.

Current state: no tests, no CI, no OpenAPI file in the repo.

Options: a shared set of HTTP tests run against both APIs (e.g. Vitest +
`fetch` against ports 3001 and 3002), or an OpenAPI description generated
from / checked against `packages/shared`.

### 2. Request validation

Neither API validates request bodies beyond manual `typeof` checks
(`/auth/login` is the only route with a body today). Nest
usually uses `class-validator` DTOs, Express has no built-in option. To keep
the contract single-sourced, a schema library shared through
`packages/shared` (e.g. zod) could validate on both sides — not decided.

### 3. Production routing to two backends

The `/api/express` and `/api/nest` prefixes exist only in the Vite **dev**
proxy. A production build (`vite preview` or static hosting) has no proxy,
so API calls will fail. A reverse proxy (nginx / Caddy) or a deploy target
has to be chosen before anything is deployed.

### 4. `Part.price` type

In the database the price is `Decimal(10, 2)`, in the contract it is
`number`. Prisma returns a `Decimal` object, so the mapping (number vs.
string with fixed precision) has to be decided when parts endpoints appear.

### 5. Roles are not enforced

`admin` / `manager` / `client` exist in the schema and the types, but
nothing checks them — any authenticated user sees the whole panel. The role
is already in the JWT payload (`{ sub, role }`) and in `res.locals.session` /
`request.authSession`, but no middleware or guard reads it. Checks
must live in the APIs, not only in the UI.

### 6. `components/layout` imports from `features/auth`

`Topbar` uses `useAuth` / `useLogout`, which goes against the
`pages → features → components` direction. Either accept it as an exception
for the app shell, or move the layout under `app/`.

### 7. Error body on 500

Resolved for 400/401/404: `ApiErrorBody` is `{ message, statusCode, error? }`
and both APIs return it, unknown routes included.

Still open: on an unhandled 500 Nest returns `{ statusCode, message }` without
`error`, Express always sends `error`. No global `ExceptionFilter` is
registered in `apps/api-nest/src/main.ts`. Either accept it (`error` is
optional in the contract) or add one.

### 8. Refresh tokens

Right now there is a single JWT valid for 7 days, stored only in the cookie.
It cannot be revoked before it expires (logout only deletes the cookie in
this browser). An access + refresh token pair with a sessions table would
allow short-lived tokens and "sign out everywhere" — at the cost of a new
table, a `/auth/refresh` route in both APIs and refresh logic on the web.

## Technical debt

- No tests — no runner is set up. No CI (`.github/` does not exist), no
  formatter (no Prettier / Biome / `.editorconfig`), no git hooks.
- **No registration, password change or reset** — the only user comes from
  the seed.
- **No rate limiting on `/auth/login`** — password guessing is unthrottled.
- **Sidebar sections without routes** — the links lead to a 404:
  In stock, Orders, Price list, Documents, Warranty claims, Support,
  and also Updates, Posts, Media under Dashboard. This is deliberate: the
  menu items match the mockup, the pages will come later.
- **`.env` duplication** — `DATABASE_URL` is repeated in `packages/db`,
  `api-express` and `api-nest`; `JWT_SECRET` must be kept in sync by hand.
- **npm install scripts** of `prisma`, `@prisma/engines` and `esbuild` —
  *unclear*: previously noted as blocked by npm's `allowScripts` policy; there
  is no `.npmrc` or `allowScripts` setting in the repo, so this depends on the
  local npm setup and cannot be confirmed from the code.
- **`npm audit`** (2026-09-22) reports 4 high-severity issues in transitive
  dependencies of the Prisma CLI (`deepmerge-ts`, `mysql2`, via
  `@prisma/config`); `npm audit fix --force` would install `prisma@6.19.3`,
  a breaking downgrade.
- **Fonts come from the Google Fonts CDN** (`apps/web/index.html`, Karla +
  DM Sans). Works, but it is an external request on every load; self-hosting
  (`@fontsource`) is the next step if that matters.
- Bundle 684 kB in one JS chunk (largest contributor not measured), no route-level
  code splitting; Vite warns about the > 500 kB chunk.
- The dashboard runs on mock data
  (`apps/web/src/features/dashboard/api/mock-data.ts`), there are no real
  metrics. `ActivityChart` has a fixed 0–50k Y scale, so larger real values
  would be clipped.
- **Duplicated code in the two APIs:** `config/env.ts` (differs only in the
  default port; `required()` also repeats in `packages/db/prisma/seed.ts`),
  the session-cookie options, `toAuthUser`, and the `Session` type (also
  typed by hand in `apps/api-express/src/types/express.d.ts`).
- **Layer-rule deviations and the unused `state.from` after login** — listed
  in `architecture.md` → "Route tree".
- **Placeholders in the UI:** `href="#"` links in `UpdatesCard`, a decorative
  cart icon in `Topbar`, `Select` is not used anywhere yet,
  `public/icons.svg` and `src/assets/vite.svg` are not referenced.
- `Sidebar.tsx` has a bare `//need check this` comment above the Dashboard
  sub-items — what it refers to is unclear.
- UI language is mixed: Ukrainian (login, errors) and English (mockup
  labels).
