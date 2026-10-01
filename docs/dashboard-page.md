# Dashboard page (Home)

Specification for the admin panel's home page. Read before any work on `/dashboard`
(`src/pages/dashboard/`) and the `features/dashboard/` feature.

## Current implementation status

Checked against the code on 2026-10-01.

| Part | Status | Notes |
| --- | --- | --- |
| Page, 4 UI components, hook, query key | Implemented | as specified below |
| Data | Implemented | `GET /api/dashboard` (Nest, behind `AuthGuard`), values from the DB seed in `auto-lincoln-api-nest` |
| Contract types | Implemented | `DashboardResponse` and the item types from `@auto-lincoln/contracts` |
| Loading / error states | Implemented | `Spinner` / `ErrorState` with retry |
| Empty states | Implemented | `UpdatesCard`: "No news yet" / "No reviews yet" when the API returns `null` |
| Activity chart scale | Hardcoded | Y axis fixed to 0–50k (`Y_TICKS` in `ActivityChart.tsx`); real values above 50k would be clipped |
| "Updates" links | Placeholder | `href="#"` — there are no post pages |
| Updates / Posts / Media sub-pages | Planned | sidebar links lead to a 404 |

## 1. Dependency

`recharts` — for the Activity chart. No other dependencies are to be added.

## 2. Data and the access layer (`features/dashboard/`)

Feature structure: `features/dashboard/{api,hooks,ui}`.

### Contract types (`@auto-lincoln/contracts`, `dashboard/get-dashboard.ts`)

zod schemas in the contracts package; the web imports only the inferred
types (`import type`).

```ts
type GlanceStats   = { posts: number; reviews: number; pages: number }
type NewsItem      = { id: string; title: string; publishedAt: string } // ISO, UTC
type ReviewItem    = { id: string; author: string; postTitle: string; text: string }
type RequestCounts = { all: number; pending: number; approved: number; spam: number; trash: number }
type StatCard      = { id: string; label: string; value: string; deltaPercent?: number }
type ActivityPoint = { month: string; visitors: number } // month: 'Jan', 'Feb', …
type DashboardResponse = {
  glance: GlanceStats
  latestNews: NewsItem | null     // null when there is no news
  latestReview: ReviewItem | null // null when there are no reviews
  requests: RequestCounts
  stats: StatCard[]
  activity: ActivityPoint[]
}
```

The data comes from the DB seed in `auto-lincoln-api-nest` (values taken
from the design mockup). `glance` counts real rows, so it differs from the
mockup (e.g. 2 reviews instead of 16). `publishedAt` is UTC and
`UpdatesCard` shows it in the viewer's local time.

### The rest of the layer

- `api/dashboardApi.ts` — `fetchDashboard(): Promise<DashboardResponse>`,
  `apiRequest(API_ROUTES.dashboard)`. Errors are not caught — they reach
  `useQuery` as `isError`.
- `api/dashboardKeys.ts` — the key factory:
  `dashboardKeys.root()` → `['dashboard']`.
- `hooks/useDashboard.ts` — `useQuery({ queryKey: dashboardKeys.root(),
  queryFn: fetchDashboard })`.

## 3. Feature UI (`features/dashboard/ui/`)

All cards follow the card convention in
[`ui-guidelines.md`](ui-guidelines.md) (`bg-surface shadow-card-1`, padding
20, `@theme` tokens only).

- **`GlanceCard.tsx`** — the heading "At a glance" (`text-accent`), three
  rows of label + value ("2 posts", "16 reviews", "3 pages").
- **`UpdatesCard.tsx`** — the heading "Updates"; sub-blocks:
  "Recently published news" (the date "Mar 5th, 17:00" + the title as an
  accent link), "Recent reviews" (`From {author} on {postTitle}`, below it
  `Text:` and the review body), "Requests" (the row "All (1) |
  Pending (0) | …" with separators). When `latestNews` / `latestReview`
  is `null`, the block shows "No news yet" / "No reviews yet"
  (`text-ink-subtle`).
- **`StatCardItem.tsx`** — label (`text-stat-label`, `text-ink-subtle`),
  value (`text-stat-value`, bold), delta to the right of the value: "↑ N%"
  in `text-positive` when `deltaPercent > 0`, "↓ N%" in `text-danger` when
  `< 0`, nothing when `undefined` or `0`.
- **`ActivityChart.tsx`** — a recharts `LineChart`: a single visitors line,
  `type="monotone"`, colour `var(--color-accent)`, width 3, no dots;
  horizontal grid lines only (`var(--color-line)`); axes without frames;
  the Y axis formatted as "10k"; the legend "• New visitors" at the top
  right. Wrapped in a `ResponsiveContainer`.

## 4. The page (`pages/dashboard/DashboardPage.tsx`)

Composition only:

- `PageHeader` with breadcrumbs "Dashboard → Home" and the title
  "Dashboard"
- the grid: left column (`GlanceCard`, `UpdatesCard` below it), right
  column (`ActivityChart` on top, 6 `StatCardItem` below it); exact widths
  and container-query breakpoints are in
  [`ui-guidelines.md`](ui-guidelines.md) → Layout
- `isLoading` → `<Spinner>`, `isError` → `<ErrorState onRetry={refetch}>`
- data from `useDashboard()`, no computation logic in the page

## 5. Sidebar and routes

- `Sidebar.tsx`: the Dashboard item has `children` Home (`/dashboard`),
  Updates (`/dashboard/updates`), Posts (`/dashboard/posts`),
  Media (`/dashboard/media`), using the same pattern as Parts online.
- `routes.tsx`: `/dashboard` is a group route; Home is its index
  (`DashboardPage`), Updates / Posts / Media render `PlaceholderPage`.
  `/` redirects to `/dashboard`, so the Dashboard item stays highlighted on
  its sub-pages (same as Parts online). Home is matched exactly.
