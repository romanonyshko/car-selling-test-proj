# Dashboard page (Home)

Specification for the admin panel's home page. Read before any work on `/dashboard`
(`src/pages/dashboard/`) and the `features/dashboard/` feature.

## Current implementation status

Checked against the code on 2026-09-22.

| Part | Status | Notes |
| --- | --- | --- |
| Page, 4 UI components, hook, query key | Implemented | as specified below |
| Data | Partially implemented — mock only | `fetchDashboard()` resolves `dashboardMock` after a `setTimeout` of 300 ms; no HTTP request, no API route |
| Loading / error states | Implemented | `Spinner` / `ErrorState` with retry |
| Activity chart scale | Hardcoded | Y axis fixed to 0–50k (`Y_TICKS` in `ActivityChart.tsx`); real values above 50k would be clipped |
| "Updates" links | Placeholder | `href="#"` — there are no post pages |
| Dashboard API endpoint + contract types | Planned | `roadmap.md` → Next, step 12 |
| Updates / Posts / Media sub-pages | Planned | sidebar links lead to a 404 |

Moving to real API endpoints is not part of this specification: only
`api/dashboardApi.ts` changes, the rest of the code does not.

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
  returns the mock with a 300 ms delay (so the loading states work).
  Components never import the mock *values*; the UI components do import
  the *types* from `mock-data.ts`.
- `api/dashboardKeys.ts` — the key factory:
  `dashboardKeys.root()` → `['dashboard']`.
- `hooks/useDashboard.ts` — `useQuery({ queryKey: dashboardKeys.root(),
  queryFn: fetchDashboard })`.

The types live in `mock-data.ts` for now and are not to be moved into
`auto-lincoln-contracts` (`src/shared`) — they will become contract types when the dashboard gets
real API endpoints.

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
  Pending (0) | …" with separators).
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
