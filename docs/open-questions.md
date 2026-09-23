# Open questions and technical debt

A list of what is deliberately unfinished or not yet decided — for the
whole project (all four folders: `auto-lincoln-web`, `auto-lincoln-contracts`,
`auto-lincoln-api-express`, `auto-lincoln-api-nest`). This file is the
single list; the other folders link here. None of this should be resolved
silently while working on another task — ask first.

Question numbers are stable — other docs link to them. Last checked against
the code on 2026-09-22 (`dev`, `d8039ac`); #3, #7, #9–#11 and the `.env`
item updated on 2026-09-23 after the split into four folders (not yet
committed).

| # | Topic | Status |
| --- | --- | --- |
| 1 | Contract parity between the APIs | Open |
| 2 | Request validation | Open |
| 3 | Production routing to two backends | Dev: resolved with direct calls + CORS (2026-09-23); production: open |
| 4 | `Part.price` type | Open (no parts endpoints yet) |
| 5 | Roles are not enforced | Open |
| 6 | `components/layout` imports `features/auth` | Open |
| 7 | Error bodies are not byte-identical | Partially resolved (same fields and statuses for 400/401/404) |
| 8 | Refresh tokens | Open |
| 9 | Keeping the contracts version in sync | Open (new, after the split) |
| 10 | Git dependency on the contracts needs a build step | Open (new, after the split) |
| 11 | Dependency versions drift without a shared lockfile | Open (new, after the split) |

## Open questions

### 1. How is contract parity between the two APIs verified?

Both APIs must return the same paths, status codes and bodies — otherwise
the backend switcher breaks. Right now this relies on discipline only.

Current state: no tests, no CI, no OpenAPI file in the repo.

Options: a shared set of HTTP tests run against both APIs (e.g. Vitest +
`fetch` against ports 3001 and 3002), or an OpenAPI description generated
from / checked against `auto-lincoln-contracts` (`src/shared`).

### 2. Request validation

Neither API validates request bodies beyond manual `typeof` checks
(`/auth/login` is the only route with a body today). Nest
usually uses `class-validator` DTOs, Express has no built-in option. To keep
the contract single-sourced, a schema library shared through
`auto-lincoln-contracts` (`src/shared`) (e.g. zod) could validate on both sides — not decided.

### 3. Production routing to two backends

The `/api/express` and `/api/nest` prefixes exist only in the Vite **dev**
proxy. A production build (`vite preview` or static hosting) has no proxy,
so API calls will fail. A reverse proxy (nginx / Caddy) or a deploy target
has to be chosen before anything is deployed.

**Update 2026-09-23 — dev switched to direct calls.** The Vite proxy was
removed: the browser calls `http://localhost:3001` / `:3002` directly
(`BACKEND_URLS` in `src/lib/apiClient.ts`, `credentials: 'include'`), both
APIs send CORS headers for `CORS_ORIGIN` (Express: `middleware/cors.ts`,
Nest: `app.enableCors`). Locally the shared session keeps working.

Still open for production — the web and the two APIs are separate projects
deployed separately. Two ways forward:

- **Reverse proxy** in front of all three (same origin, `/api/express` and
  `/api/nest` rewritten like the Vite proxy does today). The cookie and the
  code stay as they are.
- **Keep direct calls** (what dev does now). On different production
  domains the cookie would need `SameSite=None; Secure`, `CORS_ORIGIN` must
  be the production web origin, and a cookie set by one API domain is not
  sent to the other — the shared session breaks unless both APIs sit under
  one parent domain (cookie `Domain=`) or the same host.

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

### 7. Error bodies are not byte-identical

Resolved for 400/401/404: `ApiErrorBody` is `{ message, statusCode, error? }`
and both APIs return it, unknown routes included — same statuses and field
values.

Found during the split (2026-09-23), existed before it: the **key order**
differs. Express sends `{"message","statusCode","error"}`, Nest sends
`{"message","error","statusCode"}`. Equal as JSON objects, not as bytes.
Harmless for the web (it reads fields), but a byte-level parity test (#1)
would fail.

Still open: on an unhandled 500 Nest returns `{ statusCode, message }` without
`error`, Express always sends `error`. No global `ExceptionFilter` is
registered in `auto-lincoln-api-nest/src/main.ts`. Either accept it (`error` is
optional in the contract) or add one.

### 8. Refresh tokens

Right now there is a single JWT valid for 7 days, stored only in the cookie.
It cannot be revoked before it expires (logout only deletes the cookie in
this browser). An access + refresh token pair with a sessions table would
allow short-lived tokens and "sign out everywhere" — at the cost of a new
table, a `/auth/refresh` route in both APIs and refresh logic on the web.

### 9. Keeping the contracts version in sync

`@auto-lincoln/contracts` is consumed by three projects. With `file:` links
all three always see the current `dist/` — but only after `npm run build`
in `auto-lincoln-contracts`; forgetting it silently leaves stale types and
code. Once the link becomes a git dependency, each project pins its own
commit/tag, so the web and the two APIs can run **different contract
versions** — exactly what breaks the backend switcher. Needs a rule: version
tags on the contracts (`version` in its `package.json` is `0.0.0`), and
bumping all three consumers together.

### 10. Git dependency on the contracts needs a build step

`dist/` and the generated Prisma client (`src/db/generated`) are not
committed. A git dependency installs the repo as-is, so it would have no
`dist/`. Options: a `prepare` script (`prisma generate && tsc`) that npm runs
on install (needs the dev dependencies and `DATABASE_URL`-free generation),
or committing/publishing built output. Deliberately postponed until the
GitHub repos exist.

### 11. Dependency versions drift without a shared lockfile

The monorepo had one `package-lock.json`. During the split a fresh
`npm install` in each folder resolved newer versions within the same `^`
ranges (NestJS 12.1.0 instead of 12.0.3, TanStack Query 5.103.2 instead of
5.102.8, oxlint, tsx, `@types/node`, …). They were pinned back to the
monorepo versions, and each folder now has its own lockfile. From now on
the four lockfiles evolve independently; shared tools (`typescript`,
`@types/node`, `oxlint`) can diverge between folders.

## Technical debt

- No tests — no runner is set up. No CI (`.github/` does not exist), no
  formatter (no Prettier / Biome / `.editorconfig`), no git hooks.
- **No registration, password change or reset** — users only come from the
  seed (an admin and a test manager).
- **No rate limiting on `/auth/login`** — password guessing is unthrottled.
- **Sidebar sections without routes** — the links lead to a 404:
  In stock, Orders, Price list, Documents, Warranty claims, Support,
  and also Updates, Posts, Media under Dashboard. This is deliberate: the
  menu items match the mockup, the pages will come later.
- **`.env` duplication — now across three separate projects.**
  `DATABASE_URL` is repeated in `auto-lincoln-contracts/.env`,
  `auto-lincoln-api-express/.env` and `auto-lincoln-api-nest/.env`;
  `JWT_SECRET` must be identical in both APIs and is kept in sync by hand.
  Before the split all three sat in one repo; now they are in different
  folders (later different repos) with nothing that checks them.
- **npm install scripts** of `prisma`, `@prisma/engines` and `esbuild` —
  *unclear*: previously noted as blocked by npm's `allowScripts` policy; there
  is no `.npmrc` or `allowScripts` setting in the repo, so this depends on the
  local npm setup and cannot be confirmed from the code.
- **`npm audit`** (2026-09-22, same in `auto-lincoln-contracts` on 2026-09-23) reports 4 high-severity issues in transitive
  dependencies of the Prisma CLI (`deepmerge-ts`, `mysql2`, via
  `@prisma/config`); `npm audit fix --force` would install `prisma@6.19.3`,
  a breaking downgrade.
- **Fonts come from the Google Fonts CDN** (`index.html`, Karla +
  DM Sans). Works, but it is an external request on every load; self-hosting
  (`@fontsource`) is the next step if that matters.
- Bundle 684 kB in one JS chunk (largest contributor not measured), no route-level
  code splitting; Vite warns about the > 500 kB chunk.
- The dashboard runs on mock data
  (`src/features/dashboard/api/mock-data.ts`), there are no real
  metrics. `ActivityChart` has a fixed 0–50k Y scale, so larger real values
  would be clipped.
- **Duplicated code in the two APIs:** `config/env.ts` (differs only in the
  default port; `required()` also repeats in `auto-lincoln-contracts/prisma/seed.ts`),
  the session-cookie options, `toAuthUser`, and the `Session` type (also
  typed by hand in `auto-lincoln-api-express/src/types/express.d.ts`).
- **Layer-rule deviations and the unused `state.from` after login** — listed
  in `architecture.md` → "Route tree".
- **Placeholders in the UI:** `href="#"` links in `UpdatesCard`, a decorative
  cart icon in `Topbar`, `Select` is not used anywhere yet,
  `public/icons.svg` and `src/assets/vite.svg` are not referenced.
- `Sidebar.tsx` has a bare `//need check this` comment above the Dashboard
  sub-items — what it refers to is unclear.
- UI language is mixed: Ukrainian (login, errors) and English (mockup
  labels).
