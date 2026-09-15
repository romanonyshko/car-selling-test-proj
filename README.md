# Auto Lincoln — auto parts catalogue admin panel

React 19 + TypeScript + Vite, TanStack Query for server state,
Firebase (Auth + Firestore + Storage) as the backend.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the keys from the Firebase Console
npm run dev                  # http://localhost:5173
```

To sign in, the Firebase Console must have
**Authentication → Sign-in method → Email/Password** enabled and a user
created.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | type check + production build |
| `npm run lint` | oxlint |
| `npm run preview` | preview the build locally |

## Documentation

- [`docs/product.md`](docs/product.md) — what the product is and its sections
- [`docs/architecture.md`](docs/architecture.md) — `src/` structure, layers, auth flow
- [`docs/catalogue-page.md`](docs/catalogue-page.md) — catalogue page spec
- [`docs/roadmap.md`](docs/roadmap.md) — order of work and technical debt
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — tokens and UI conventions
- [`CLAUDE.md`](CLAUDE.md) — rules for working with Claude Code
