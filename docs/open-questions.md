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

## Technical debt

- No tests — no runner is set up.
- **Login does not work yet** — the web app calls `/auth/*`, which neither
  API implements (roadmap steps 1–2).
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
- The `Inter` font is declared in CSS but the font file is not loaded —
  the system font is rendered instead.
- Bundle ~680 kB, no route-level code splitting.
- The dashboard runs on mock data
  (`apps/web/src/features/dashboard/api/mock-data.ts`), there are no real
  metrics.
- UI language is mixed: Ukrainian (login, errors) and English (mockup
  labels).
