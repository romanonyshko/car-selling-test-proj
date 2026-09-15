# Catalogue page (Parts online → Catalogue)

Catalogue page specification. Read before any work on
`/parts/catalogue`.

## Layout

- **Main area:** grid of 12 category tiles (image + title):
  Brake system, Filters, Engine, Forks, Suspension, Damping,
  Belt / chain drive, Chassis, Engine cooling system, Hydraulic,
  Steering, Tires and wheels.
- **Right panel:** "Find your car parts" — three cascading selects:
  Carmaker → Model → Engine.
- Catalogue header has a grid/list view toggle.

## Data model

Normalized: flat lists linked by parent ids, no nesting.

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
}
```

The same shapes are used for static JSON now and Firestore later —
component logic must not change when we switch the data source.

## Cascading filter logic

1. Child options are derived by filtering on the selected parent:

   ```ts
   modelOptions  = models.filter(m => m.carmakerId === selectedMake)
   engineOptions = engines.filter(e => e.modelId === selectedModel)
   ```

2. Changing a parent resets all descendants:
   make change clears model + engine; model change clears engine.
3. A child select is disabled until its parent has a value.
4. Filter state is a single object: `{ make, model, engine }`.

## How filters affect parts

- Engine is the most precise level; part compatibility is stored
  as `compatibleEngineIds`.
- Filtering works at any selection depth:
  - **only make selected:** collect all engine ids under that make,
    show parts whose `compatibleEngineIds` intersect that set;
  - **make + model:** same, but only that model's engines;
  - **engine selected:** exact match on the engine id.

## Data source

- **Phase 1 (demo):** static JSON with the interfaces above.
- **Phase 2:** Firestore collections `carmakers` / `models` / `engines` /
  `parts`, fetched via TanStack Query with
  `where('carmakerId', '==', selectedMake)`.
  Query keys must include the parent id, e.g. `['models', selectedMake]`,
  so each branch is cached separately.

## Naming note

The catalogue is actually forklift parts, so Carmaker/Model may later
be renamed to brand/series — keep naming easy to change.

---
