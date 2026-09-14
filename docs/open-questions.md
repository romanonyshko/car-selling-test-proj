# Open questions and technical debt

A list of what is deliberately unfinished or not yet decided. None of this
should be resolved silently while working on another task — ask first.

## Open questions

### 1. The types in `src/types/models.ts` contradict the catalogue spec

`models.ts` was written as a sketch before `docs/catalogue-page.md` existed.
The differences:

- `Category`: the code has `imageUrl` plus a redundant `slug`, the spec has
  `image` and no `slug`;
- `Part`: the code stores compatibility as the strings `carmaker` / `model` /
  `engine`, the spec uses `compatibleEngineIds: string[]`;
- `PartsFilters`: the code has `carmaker`, the spec has `make`.

**Agreed:** the spec is newer, so the types get aligned to it. The commercial
fields from the code (`articleNumber`, `brand`, `price`, `currency`,
`inStock`) stay as an extension of `Part`.

### 2. Firestore limit in catalogue Phase 2

`array-contains` accepts a single value only, `array-contains-any` accepts
at most 30. The "only a make is selected → show every part under it" scenario
collects all engine ids under that make; if there are more than 30, the query
cannot be made in a single call.

Options: denormalise `compatibleMakeIds` / `compatibleModelIds` into the
`Part` document, or split the query into chunks. In Phase 1 (JSON in memory)
the limit does not apply.

### 3. Firestore Security Rules are not written

The database is in default mode. The `admin` / `manager` / `client` roles
exist in the types and are checked nowhere — neither in the UI nor on the
database side.

## Technical debt

- No tests — no runner is set up.
- **Sidebar sections without routes** — the links lead to a 404:
  In stock, Orders, Price list, Documents, Warranty claims, Support,
  and also Updates, Posts, Media under Dashboard. This is deliberate: the
  menu items match the mockup, the pages will come later.
- The `Inter` font is declared in CSS but the font file is not loaded —
  the system font is rendered instead.
- Bundle ~1.16 MB (Firebase + recharts), no route-level code splitting.
- The dashboard runs on mock data
  (`features/dashboard/api/mock-data.ts`), there are no real metrics.
