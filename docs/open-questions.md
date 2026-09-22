# Open questions and technical debt

A list of what is deliberately unfinished or not yet decided. None of this
should be resolved silently while working on another task — ask first.

## Open questions

### 1. How is contract parity between the two APIs verified?

Both APIs must return the same paths, status codes and bodies — otherwise
the backend switcher breaks. Right now this relies on discipline only.

Options: a shared set of HTTP tests run against both APIs (e.g. Vitest +
`fetch` against ports 3001 and 3002), or an OpenAPI description generated
from / checked against `packages/shared`.

### 2. Request validation

Neither API validates request bodies beyond manual `typeof` checks. Nest
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
nothing checks them — any authenticated user sees the whole panel. Checks
must live in the APIs, not only in the UI.

### 6. `components/layout` imports from `features/auth`

`Topbar` uses `useAuth` / `useLogout`, which goes against the
`pages → features → components` direction. Either accept it as an exception
for the app shell, or move the layout under `app/`.

### 7. Error body on 500

Resolved for 400/401/404: `ApiErrorBody` is `{ message, statusCode, error? }`
and both APIs return it, unknown routes included.

Still open: on an unhandled 500 Nest returns `{ statusCode, message }` without
`error`, Express always sends `error`. Either accept it (`error` is optional
in the contract) or add a global Nest `ExceptionFilter`.

### 8. Refresh tokens

Right now there is a single JWT valid for 7 days, stored only in the cookie.
It cannot be revoked before it expires (logout only deletes the cookie in
this browser). An access + refresh token pair with a sessions table would
allow short-lived tokens and "sign out everywhere" — at the cost of a new
table, a `/auth/refresh` route in both APIs and refresh logic on the web.

## Technical debt

- No tests — no runner is set up.
- **No registration, password change or reset** — the only user comes from
  the seed.
- **No rate limiting on `/auth/login`** — password guessing is unthrottled.
- **Sidebar sections without routes** — the links lead to a 404:
  In stock, Orders, Price list, Documents, Warranty claims, Support,
  and also Updates, Posts, Media under Dashboard. This is deliberate: the
  menu items match the mockup, the pages will come later.
- **`.env` duplication** — `DATABASE_URL` is repeated in `packages/db`,
  `api-express` and `api-nest`; `JWT_SECRET` must be kept in sync by hand.
- **npm install scripts** of `prisma`, `@prisma/engines` and `esbuild` are
  blocked by npm's `allowScripts` policy (not approved yet). Builds work, but
  it may matter for Prisma CLI commands on a fresh machine.
- **`npm audit`** reports high-severity issues in transitive dependencies of
  the Prisma CLI (`deepmerge-ts`, `mysql2`); the suggested fix upgrades to a
  Prisma 8 release candidate.
- **Fonts come from the Google Fonts CDN** (`apps/web/index.html`, Karla +
  DM Sans). Works, but it is an external request on every load; self-hosting
  (`@fontsource`) is the next step if that matters.
- Bundle ~680 kB, no route-level code splitting.
- The dashboard runs on mock data
  (`apps/web/src/features/dashboard/api/mock-data.ts`), there are no real
  metrics.
- UI language is mixed: Ukrainian (login, errors) and English (mockup
  labels).
