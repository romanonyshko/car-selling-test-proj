# CLAUDE.md

Admin panel for the "Auto Lincoln" auto parts catalogue: managing categories,
parts, stock and orders. A learning project (internship), built from a mockup
provided by the mentor.

## Stack

React 19 · TypeScript · Vite 8 · TanStack Query v5 · react-router-dom v7 ·
Tailwind v4 · Firebase 12 (Auth + Firestore + Storage) · oxlint

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server at http://localhost:5173 |
| `npm run build` | `tsc -b` + production build |
| `npm run lint` | oxlint |
| `npm run preview` | preview the build |

There are no tests in the project yet — no test runner is set up.

## Architecture rules

- **Feature-based structure.** `src/features/<feature>/{api,hooks,model,ui}`.
  A feature does not import another feature — shared code moves up into
  `components/` or `lib/`.
- **Dependency direction:** `pages → features → components/ui → lib`.
- **Data access layer.** Only files in `features/*/api/` import `firebase/*`.
  A component calls a hook, the hook calls `api/`. Components know nothing
  about Firebase.
- **Server state — TanStack Query only.** No `useState` + `useEffect` for
  fetching data. Local UI state — plain `useState`.
- **Query keys are factories** (`partsKeys.list(filters)`) in
  `features/*/api/`, not strings scattered across files — otherwise
  invalidation misses.
- **Pages in `pages/` — composition only.** They contain no logic.
- **Protected routes** — via `ProtectedRoute`, not via checks inside
  components.
- **Domain entity types** — in `src/types/models.ts`.
- **Alias `@/` = `src/`.** We do not write relative `../../`.

## How to work with me

- I write the code myself. Help me pointwise: problem → where to change it →
  a minimal example → why this way.
- Do not generate large files without an explicit request.
- Before implementing a feature — first a plan and my confirmation.
- Reply in Ukrainian.

## Documentation — read before working

- `docs/architecture.md` — before changing the structure, routes or working
  with data
- `docs/catalogue-page.md` — before any work on `/parts/catalogue`
  (spec: layout, data models, cascading filters)
- `docs/ui-guidelines.md` — before writing markup (tokens, component
  conventions)
- `docs/roadmap.md` — current state of the project and the next step
- `docs/open-questions.md` — known problems and technical debt;
  do not resolve them silently, ask me first

## Not a source of truth

`PROJECT-CONTEXT.md` — a generated snapshot of the project for external LLMs.
Do not read it when working on code: it goes stale after the very first
commit. The current state is always in the code and `docs/`.
