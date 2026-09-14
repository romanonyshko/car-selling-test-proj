# Architecture

## Current `src/` structure

```
src/
├── app/
│   ├── App.tsx                     # AppProviders + RouterProvider
│   ├── providers/AppProviders.tsx  # QueryClientProvider → AuthProvider → Devtools
│   └── router/
│       ├── routes.tsx              # createBrowserRouter, route tree
│       └── ProtectedRoute.tsx      # redirect to /login for unauthenticated users
├── pages/
│   ├── login/LoginPage.tsx
│   ├── dashboard/DashboardPage.tsx # placeholder
│   ├── catalogue/CataloguePage.tsx # placeholder
│   └── NotFoundPage.tsx
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts          # login / logout via firebase/auth
│   │   ├── hooks/useAuth.ts        # reads AuthContext
│   │   ├── hooks/useLogin.ts       # useLogin / useLogout (useMutation)
│   │   ├── model/authContext.ts    # createContext<AuthContextValue>
│   │   ├── model/AuthProvider.tsx  # subscribes to onAuthStateChanged
│   │   └── ui/LoginForm.tsx
│   └── catalogue/{api,hooks,model,ui}/   # created, still empty
├── components/
│   ├── layout/AppLayout.tsx        # Sidebar + Topbar + <Outlet />
│   ├── layout/Sidebar.tsx          # navigation, the source of truth for sections
│   ├── layout/Topbar.tsx           # user name + sign out
│   └── ui/                         # Button, Input, Select, Spinner, ErrorState
├── lib/
│   ├── firebase.ts                 # initializeApp, auth, db, storage
│   ├── queryClient.ts              # QueryClient with defaults
│   ├── firestore.ts                # converter<T>() — injects doc.id into the model
│   └── cn.ts                       # class joining
├── types/models.ts                 # Category, Part, PartsFilters, AppUser, UserRole
└── index.css                       # @import 'tailwindcss' + @theme tokens
```

The empty `features/catalogue/*` folders are a placeholder for the next
step, not forgotten code.

## Layers and dependency direction

```
pages  →  features  →  components/ui  →  lib
```

A component never imports `firebase/*` directly. The chain is always the
same:

```
CataloguePage → useCategories() → categoriesApi.fetchCategories() → Firestore
   (pages)        (features/hooks)        (features/api)
```

The point is that replacing the backend only touches the `api/` layer, and
hooks can be tested by swapping a single module.

## Auth flow

1. `AuthProvider` (`features/auth/model/AuthProvider.tsx`) subscribes to
   `onAuthStateChanged` on mount and holds `{ user, isLoading }`.
2. Firebase itself persists the session in IndexedDB — after a refresh the
   user stays signed in, but the answer arrives asynchronously. Hence
   `isLoading`.
3. When `isLoading === true`, `ProtectedRoute` shows a `Spinner` and **does
   not redirect** — otherwise the user would be thrown out to `/login` on
   every page reload.
4. No user → `<Navigate to="/login" replace state={{ from }} />`.
5. A user → `AppLayout` renders with an `<Outlet />`.
6. On success `useLogin` navigates to `/`; `useLogout` calls
   `queryClient.clear()` so the previous user's data does not stay in the
   cache.

## Route tree

```
/login                  LoginPage                       public
/                       ProtectedRoute → AppLayout
├── index               DashboardPage
├── /parts              → redirects to /parts/catalogue
└── /parts/catalogue    CataloguePage
*                       NotFoundPage
```

The remaining sidebar sections (`in-stock`, `orders`, `price-list`,
`documents`, `warranty-claims`) have no routes yet — those links lead to
a 404.

## Application state

| Kind of state | Where it lives |
| --- | --- |
| server data (Firestore) | TanStack Query |
| authentication | `AuthContext` (a wrapper over Firebase) |
| local UI (forms, modals) | `useState` inside the component |
| catalogue filters | planned in the URL (`useSearchParams`) so links are shareable |

There is no global store manager (Redux/Zustand) and none is needed yet.

`QueryClient` defaults (`lib/queryClient.ts`): `staleTime` 5 min,
`refetchOnWindowFocus: false`, `retry: 1`.

## Firestore

The models are described in `src/types/models.ts`: `Category`, `Part`,
`PartsFilters`, `AppUser`.

`lib/firestore.ts` contains `converter<T>()` — Firestore does not store `id`
inside the document, so the converter injects `snapshot.id` when reading and
strips `id` when writing.

**The collection structure is not agreed yet.** The key constraint that will
drive the decision: Firestore has no joins, and filtering on several fields
at once (`carmaker` + `model` + `engine`) requires composite indexes. That
is the next topic to discuss.

Security Rules are not written yet — the database is in default mode.

## Configuration

The Firebase config comes from `.env.local` (`VITE_FIREBASE_*`), typed in
`src/vite-env.d.ts`. The file is in `.gitignore`. These keys are not a
secret — they end up in the client bundle; data protection is built on
Security Rules.

The `@/` → `src/` alias is configured in `vite.config.ts` and
`tsconfig.app.json`.
