# Dashboard page (Home)

Specification for the admin panel's home page. Read before any work on `/`
(`apps/web/src/pages/dashboard/`) and the `features/dashboard/` feature.

The implementation runs on mock data. Moving to real API endpoints is not
part of this specification: only `api/dashboardApi.ts` changes, the rest of
the code does not.

## 1. Dependency

`recharts` — for the Activity chart. No other dependencies are to be added.

## 2. Data and the access layer (`features/dashboard/`)

Feature structure: `features/dashboard/{api,hooks,ui}`.

### `api/mock-data.ts` — types and data

```ts
interface GlanceStats   { posts: number; reviews: number; pages: number }
interface NewsItem      { id: string; title: string; publishedAt: string } // ISO
interface ReviewItem    { id: string; author: string; postTitle: string; text: string }
interface RequestCounts { all: number; pending: number; approved: number; spam: number; trash: number }
interface StatCard      { id: string; label: string; value: string; deltaPercent?: number }
interface ActivityPoint { month: string; visitors: number }
interface DashboardData {
  glance: GlanceStats
  latestNews: NewsItem
  latestReview: ReviewItem
  requests: RequestCounts
  stats: StatCard[]
  activity: ActivityPoint[]
}
```

The mock values come from the design mockup:

- **glance:** posts 2, reviews 16, pages 3
- **latestNews:** "Season sale beginning!", `2026-03-05T17:00`
- **latestReview:** author Ketty Richardson, on the post "Season sale
  beginning!", text: "Rev up your savings with our season sale on car parts!
  Upgrade your ride without breaking the bank. Don't miss out on these hot
  deals to keep your vehicle running smoothly and stylishly all year round!"
- **requests:** all 1, pending 0, approved 1, spam 0, trash 0
- **stats** (6 cards): Time on website "14.7" +2, Visitors "620" +10,
  Categories "400" with no delta, Comments "12.1" +8, Covers "340" +20,
  Articles "120" with no delta
- **activity:** 9 points Jan–Sep, values 5000–35000 shaped as "decline,
  a small plateau, a peak, levelling off" (like the curve in the mockup)

### The rest of the layer

- `api/dashboardApi.ts` — `fetchDashboard(): Promise<DashboardData>`,
  returns the mock with a ~300 ms delay (so the loading states work).
  Components never import `mock-data` directly.
- `api/dashboardKeys.ts` — the key factory:
  `dashboardKeys.root()` → `['dashboard']`.
- `hooks/useDashboard.ts` — `useQuery({ queryKey: dashboardKeys.root(),
  queryFn: fetchDashboard })`.

The types live in `mock-data.ts` for now and are not to be moved into
`packages/shared` — they will become contract types when the dashboard gets
real API endpoints.

## 3. Feature UI (`features/dashboard/ui/`)

All cards follow the conventions in `docs/ui-guidelines.md`
(`rounded-2xl border border-line bg-white`, spacing a multiple of 4,
`brand-*` tokens from `@theme`, no hardcoded colours).

- **`GlanceCard.tsx`** — the heading "At a glance" (`text-brand-600`),
  three rows of label + value ("2 posts", "16 reviews", "3 pages").
- **`UpdatesCard.tsx`** — the heading "Updates"; sub-blocks:
  "Recently published news" (the date "Mar 5th, 17:00" + the title as a
  `brand-600` link), "Recent reviews" (`From {author} on {postTitle}`, below
  it `Text:` and the review body), "Requests" (the row "All (1) |
  Pending (0) | …" with separators). The links are `href="#"` for now —
  there are no post pages.
- **`StatCardItem.tsx`** — label (`text-slate-500`, small), value (large,
  semibold), delta to the right of the value: "↑ N%" in green
  (`text-green-600`) when `deltaPercent > 0`, "↓ N%" in red when `< 0`,
  nothing when `undefined`.
- **`ActivityChart.tsx`** — a recharts `LineChart`: a single visitors line,
  `type="monotone"`, colour `var(--color-brand-500)`, width 2, no dots;
  horizontal grid lines only (the `line` colour); axes without frames,
  labels `text-slate-400`; the Y axis formatted as "10k"; the legend
  "• New visitors" at the top right. Wrapped in a `ResponsiveContainer`.

## 4. The page (`pages/dashboard/DashboardPage.tsx`)

Composition only:

- breadcrumbs "Dashboard → Home" (`text-slate-400`, small) above the `h1`
  heading "Dashboard"
- the grid: left column (`GlanceCard`, `UpdatesCard` below it) ~1/3 of the
  width, right column ~2/3 (`ActivityChart` on top, 6 `StatCardItem` in a
  3×2 grid below it); a single column on narrow screens
- `isLoading` → `<Spinner>`, `isError` → `<ErrorState onRetry={refetch}>`
- data from `useDashboard()`, no computation logic in the page

## 5. Sidebar and routes

- `Sidebar.tsx`: add `children` to the Dashboard item: Home (`/`),
  Updates (`/dashboard/updates`), Posts (`/dashboard/posts`),
  Media (`/dashboard/media`) — using the same pattern as Parts online.
- `routes.tsx`: a route for Home only (`index`, already exists). Updates /
  Posts / Media have no routes and lead to a 404 — deliberately, like
  In stock / Orders.
