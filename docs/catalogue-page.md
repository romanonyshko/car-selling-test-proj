# Catalogue page (Parts online → Catalogue)

Catalogue page specification. Read before any work on
`/parts/catalogue`.

## Current implementation status

Checked against the code on 2026-10-06. The rest of this file is the
target spec, not a description of the code.

| Part | Status | Where |
| --- | --- | --- |
| Route `/parts/catalogue` (+ `/parts` redirect) | Implemented | `src/app/router/routes.tsx` |
| Page header (breadcrumbs "Parts online → Catalogue") | Implemented | `pages/catalogue/CataloguePage.tsx` |
| Category grid | Implemented — 3 columns of 352x209 cards, loading / error / empty states | `features/catalogue/ui/CategoryGrid.tsx`, `CategoryCard.tsx` |
| Category images | Implemented — the API returns `/categories/<slug>.jpg`, served from `public/categories/` | — |
| Clicking a category | Implemented — each card is a link to `/parts/catalogue/$categoryId` (hover: accent shadow, image zoom, arrow) | `features/catalogue/ui/CategoryCard.tsx` |
| Category page `/parts/catalogue/$categoryId` | Implemented — breadcrumbs with a link back to the catalogue, part count, list of parts; loading / error / empty / "Category not found" states | `pages/catalogue/CategoryPartsPage.tsx`, `features/catalogue/ui/PartRow.tsx` |
| Grid / list toggle | Planned (`PageHeader` has an `actions` slot for it) | — |
| Carmaker → Model → Engine filters | Planned | — |
| Contract schemas (`Category`, `Carmaker`, `CarModel`, `Engine`, `Part`, `PartsQuery`) | Implemented | `auto-lincoln-contracts/catalogue/`, `parts/` |
| Catalogue routes in `API_ROUTES` | Implemented | `auto-lincoln-contracts/common/api.ts` |
| DB tables + demo data | Implemented — the seed fills categories, carmakers, models, engines, parts | `auto-lincoln-api-nest/prisma/` |
| `GET /api/categories` | Implemented (auth required) | `auto-lincoln-api-nest/src/modules/catalogue/` |
| `GET /api/carmakers`, `/carmakers/:id/models`, `/models/:id/engines` | Implemented (auth required) — ordered by name, unknown id → `[]` | `auto-lincoln-api-nest/src/modules/catalogue/` |
| `GET /api/parts` filters | Implemented — `category` (required), `make` / `model` / `engine` (most precise one applied), `search` (title or article number, case-insensitive), `limit` | `auto-lincoln-api-nest/src/modules/catalogue/` |
| Parts pagination (`cursor`) | Planned — `nextCursor` is always `null` | — |
| `features/catalogue/` in the web app | Implemented for categories and parts: `catalogueKeys` (`parts(filters)` keeps the whole `PartsQuery` in the key), `fetchCategories`, `fetchParts`, `useCategories`, `useParts` (`keepPreviousData`, disabled without a category) | `src/features/catalogue/` |

## Layout

- **Main area:** grid of 12 category tiles (image + title):
  Brake system, Filters, Engine, Forks, Suspension, Damping,
  Belt / chain drive, Chassis, Engine cooling system, Hydraulic,
  Steering, Tires and wheels.
- **Right panel:** "Find your car parts" — three cascading selects:
  Carmaker → Model → Engine.
- Catalogue header has a grid/list view toggle.

## Data model

Normalized: flat lists linked by parent ids, no nesting. These are the
contract schemas in `auto-lincoln-contracts/catalogue/` and `parts/`:

```ts
interface Category { id: string; title: string; image: string; order: number }
interface Carmaker { id: string; name: string }
interface CarModel { id: string; carmakerId: string; name: string }
interface Engine   { id: string; modelId: string; name: string }
interface Part {
  id: string;
  categoryId: string;
  title: string;
  compatibleEngineIds: string[];
  // + commercial fields: articleNumber, brand, price, currency, inStock, image
}
```

In PostgreSQL (`auto-lincoln-api-nest/prisma/schema.prisma`) these are the tables
`categories`, `carmakers`, `car_models`, `engines`, `parts`.
`compatibleEngineIds` is a many-to-many relation between `parts` and
`engines`; the APIs flatten it into an id array in the response.

## Cascading filter logic

1. Child options come from the selected parent:

   ```ts
   modelOptions  = models  where carmakerId === selectedMake
   engineOptions = engines where modelId    === selectedModel
   ```

2. Changing a parent resets all descendants:
   make change clears model + engine; model change clears engine.
3. A child select is disabled until its parent has a value.
4. Filter state is a single object: `{ make, model, engine }`.

## How filters affect parts

- Engine is the most precise level; part compatibility is stored
  per engine.
- Filtering works at any selection depth:
  - **only make selected:** parts compatible with any engine of any model
    of that make;
  - **make + model:** parts compatible with any engine of that model;
  - **engine selected:** parts compatible with that engine.
- This is a single relational query in the API (a join through
  `engines → car_models`), so there is no limit on how many engines a make
  has.

## Data source

- Both APIs serve the data from PostgreSQL through endpoints described in
  `auto-lincoln-contracts` (`src/shared`) (to be added — `roadmap.md` → Next, steps 1–2). Demo
  data will come from the seed.
- The web app fetches it with TanStack Query. Query keys must include the
  parent id, e.g. `catalogueKeys.models(selectedMake)`, so each branch is
  cached separately.
- Selected filters are planned in the URL (`useSearchParams`).

## Naming note

The catalogue is actually forklift parts, so Carmaker/Model may later
be renamed to brand/series — keep naming easy to change.

---
