# Roadmap

## Done

- [x] Setup: Vite + React + TS, Tailwind v4, `@/` alias, oxlint
- [x] Folder structure, layers, dependency rules
- [x] Firebase SDK, config via `.env.local`
- [x] Auth: `AuthProvider`, `useLogin` / `useLogout`, `LoginForm`
- [x] Routing + `ProtectedRoute`
- [x] Layout: Sidebar, Topbar, `AppLayout`
- [x] Base UI components: Button, Input, Select, Spinner, ErrorState

## Next, in order

1. **Types matching the spec** — align `src/types/models.ts` with
   `docs/catalogue-page.md` (`Category`, `Carmaker`, `CarModel`, `Engine`,
   `Part.compatibleEngineIds`).
2. **Phase 1: static JSON** — demo data shaped by those same interfaces,
   accessed through the `features/catalogue/api/` layer so components do not
   know the source.
3. **Grid of 12 categories** on `CataloguePage` instead of the placeholder,
   plus the grid/list toggle.
4. **Cascading Carmaker → Model → Engine filters** — state as a single
   `{ make, model, engine }` object, descendants reset, disabled until the
   parent has a value.
5. **Filtering parts** at any selection depth via `compatibleEngineIds`.
6. **Dashboard on mock data** — see `docs/dashboard-page.md`.
7. **Loading / error / empty states** on every screen (the components exist).
8. **Phase 2: Firestore** — the `carmakers` / `models` / `engines` / `parts`
   collections, query keys including the parent id
   (`['models', selectedMake]`), composite indexes. The
   `array-contains-any` limit (30) gets decided here too.
9. **Pagination** — Firestore `limit` + `startAfter`, via `useInfiniteQuery`.
10. **CRUD for categories and parts** — forms, `useMutation`, cache
    invalidation.
11. **Firestore Security Rules** + separating the `admin` / `manager` /
    `client` roles.
12. **Orders** — list and statuses.
13. **In stock, Price list, Documents, Warranty claims** — the sidebar
    sections.
14. **Dashboard with real metrics** — replacing the mocks.
15. **Responsive** — sidebar as a drawer on mobile.
16. **Bundle optimisation** — currently ~1.16 MB (Firebase + recharts);
    route-level code splitting via `React.lazy`.

## Not a priority right now

Payments, delivery, cart, a public storefront for customers, a mobile app,
analytics, promo codes and bonuses, reviews, localisation, complex discount
logic, SSR.

## Technical debt

Moved to [`open-questions.md`](open-questions.md) together with the open
questions.
