# UI

The mockup is now **implemented in the code**: `@theme` holds the mockup's
tokens, and the shell, the base components and the dashboard are built from
them. This file therefore describes one set of values again — what
`apps/web/src` renders — and keeps a short list of what is still only in
Figma.

Source of the mockup: Figma file `qVzu3KVGXpgPrWF254NRSo`
("Auto Lincoln analysis copy"), node `2:24` — two 1920x1206 screens,
`2:25` "Auto parts catalogue" and `2:206` "Dashboard".
Read on 2026-09-20, re-verified against the file in the same revision.

**Declared vs observed.** A token is *declared* when it exists in Figma as a
variable or a style; it is *observed* when it was read off a layer. Node
`2:24` declares exactly two things; every other value below is observed and
may change when the design is tokenised in Figma.

## Tokens

### Declared in Figma

| Figma name | Value | In the code |
| --- | --- | --- |
| `black / 50` | `#1F1F1F` | `--color-black-50` |
| `card 1` | drop shadow, `#1F1F1F0A`, offset `0 4`, blur `40`, spread `-4` | `--shadow-card-1` |

### Colours — `@theme` in `apps/web/src/index.css`

| Token | Value | Used for |
| --- | --- | --- |
| `--color-accent` | `#177cca` | active nav item, indicator bar, field label, header greeting, links, chart line |
| `--color-accent-soft` | `rgba(23,124,202,0.1)` | active nav item background |
| `--color-ink` | `#353535` | body text, page title, card title, current breadcrumb item |
| `--color-ink-muted` | `rgba(53,53,53,0.5)` | placeholder, parent breadcrumb, inactive sub-nav item |
| `--color-ink-subtle` | `#979797` | stat-card label |
| `--color-positive` | `#45b73b` | positive delta |
| `--color-surface` | `#ffffff` | header, sidebar, cards |
| `--color-canvas` | `#f8fbfd` | content area background (`body`) |
| `--color-field` | `#f8f8f8` | input / select background |
| `--color-line` | `rgba(31,31,31,0.1)` | all borders and dividers |
| `--color-black-50` | `#1f1f1f` | the declared Figma colour |
| `--color-danger` | `#d14343` | **not in the mockup** — error text, negative delta |

The previous `--color-brand-*` scale and the `text-slate-*` secondary text
are gone; nothing in `src/` references them any more.

### Typography

Two families, loaded from Google Fonts in `apps/web/index.html`:
`--font-sans` = Karla (400/500/700), `--font-display` = DM Sans (400/500).
`Inter` is no longer declared.

Each role from the mockup is a `--text-*` token with its line height, so the
sizes are not typed into JSX:

| Token | Size / line-height | Family | Used for |
| --- | --- | --- | --- |
| `text-crumb` | 14 / 24 | Karla | breadcrumb, small secondary text |
| `text-nav` | 19 / 30 | Karla Bold / Medium | sidebar nav and sub-nav labels |
| `text-greeting` | 18 / 24 | Karla Medium | header greeting |
| `text-title` | 32 / 37 | Karla Medium | page title |
| `text-section` | 18 / 24 | Karla | card headings and card body |
| `text-field` | 18 / 24 | Karla | input / select value and placeholder |
| `text-field-label` | 16 / 21 | DM Sans Medium | input / select label |
| `text-stat-label` | 20 / 24 | Karla | stat-card label |
| `text-stat-value` | 40 / 46 | Karla Bold | stat-card value |
| `text-stat-delta` | 22 / 26 | Karla Bold | stat-card delta |
| `text-panel-title` | 22 / 28 | Karla Medium | filter panel title — **declared, not used yet** |
| `text-card-title` | 18 / 20 | DM Sans Medium | catalogue card title — **declared, not used yet** |

`text-nav` is the mockup's 18.866px rounded to 19 — see Q2.

### Shell metrics

`--spacing-*` tokens, so `w-sidebar`, `h-header`, `h-field` … are real
utilities:

| Token | Value | Used for |
| --- | --- | --- |
| `--spacing-sidebar` | 316px | sidebar width |
| `--spacing-header` | 80px | header height |
| `--spacing-nav-item` | 72px | nav item height (raw 71.925) |
| `--spacing-nav-sub` | 62px | sub-item height (raw 62.493) |
| `--spacing-nav-group` | 305px | inner nav group width (raw 305.388) |
| `--spacing-field` | 60px | control height (input, select, button) |
| `--spacing-stat-card` | 295px | stat-card minimum width |
| `--spacing-panel` | 391px | filter panel — **declared, not used yet** |

One-off numbers straight from the mockup (content padding 34, breadcrumb →
title gap 24, title → content gap 37, dashboard column 527 + gap 68, card
height 177, chart body 477) are written as arbitrary values in the component
that owns them — see Q1.

## Layout

- `AppLayout` — full-height flex; `html, body, #root { height: 100% }`.
- Sidebar: `w-sidebar` (316), white, 1px right divider, logo slot 98x48 at
  (38,26), collapse toggle 28x28 top-right, nav group inset 9px from the
  left, "Support" pinned to the bottom (`mt-auto`).
- Header: `h-header` (80), white, 1px bottom divider, content right-aligned
  with a 40px right offset, gap 15.
- Content: `bg-canvas`, `px-[34px] pt-5 pb-[34px]`, its own vertical scroll.
- Page header (`components/ui/PageHeader`): breadcrumb → 24 → title → 37 →
  content, matching y=100 / y=148 / y=222 in the mockup.
- Dashboard: two columns `527px` + rest, gap 68; stat cards 3-up with gap 20;
  chart panel padding 20, body 477 tall, fixed 0…50k scale.
- Scrollbars are 9px with an accent thumb (`index.css`), as in the mockup.
- Breakpoints: the mockup has a single desktop width, so the only responsive
  rules in the code are the ones that already existed (`sm:` / `lg:` / `xl:`
  on the dashboard grids).

## Component conventions

- **Card** — `bg-surface shadow-card-1`, **no border, no radius**, padding 20.
- **Control** (button, input, select) — `h-field` (60), no radius,
  background `--color-field`, 1px `--color-line` border.
- **Field label** — DM Sans Medium 16 in the accent colour, 12px above the
  field.
- **Focus** — `focus:border-accent` (the mockup draws no focus state; this is
  the code's own decision).
- Classes are joined with `cn()` from `apps/web/src/lib/cn.ts`.
- Component variants are an object map `Record<Variant, string>`
  (see `components/ui/Button.tsx`), not chained ternaries.
- Nav item states: default / active (accent background at 10% + accent label
  + 5px indicator bar at the item's right edge). Hover is the code's own
  addition — the mockup draws no hover, focus, disabled or loading state.

## Still only in the mockup

Not implemented, because the data and the logic for it do not exist yet:

- **Catalogue grid** — 3 columns, card 352x209, column gap 32, row gap 30;
  card = image band 147 → 1px divider → body padding 20/21 → title
  (`text-card-title`).
- **Right filter panel** (node `2:172`) — 391 wide, 1px left divider, title
  at (80,40), collapse toggle 32x32 at (32,39), dropdown blocks at y=111 /
  244 / 377, each 327 wide.
- **Grid / list toggle** (node `2:128`) — two 24px icons, gap 16, aligned
  with the page title at its right edge. `PageHeader` already takes an
  `actions` slot for it.
- **Dropdown error slot** — each dropdown block has a hidden "Error text"
  node 18 tall; the slot is not reserved in `Select` yet (belongs with form
  validation).
- **Sidebar badge** — the mockup shows a blue `3` pill next to "Updates".
- **Collapsed states** — the sidebar and the filter panel each have a
  collapse toggle; the collapsed frame itself is not in the mockup, and the
  toggle in the code is a button with no handler.
- **Logo** — in Figma it is a raster image 98x48 reading "Auto Detail"
  (node `2:111`). The code renders an "Auto Lincoln" wordmark in the same
  98x48 slot. Needs a decision: export the asset, or keep a wordmark.
- **Nav icons** — the mockup uses `material-symbols`; the code draws its own
  inline SVGs of the same 21px size.

## Rules

- New colours go into `@theme`, they are not hardcoded in JSX.
- Type sizes go into `@theme` as `--text-*` roles with a line height; JSX
  uses the role, not a px value.
- Shared visual elements live in `components/ui/`, they are not duplicated
  across features.
- Observed values are provisional. If a token later shows up as a Figma
  variable, the declared value wins.
- When a value that is listed under "Still only in the mockup" lands in the
  code, move it into the sections above in the same change.

## Open questions

**Q1 — the 4px spacing grid.** The old rule "spacing is a multiple of 4,
Tailwind utilities only, no arbitrary values" is incompatible with the mockup
(py-21, py-18, row gap 30, item height 71.925). **What was done:** the rule
was dropped. Repeated values became `--spacing-*` / `--text-*` tokens;
genuinely one-off numbers are arbitrary values in the component that owns
them. Needs the owner's confirmation.

**Q2 — the ~1.1791 sidebar scale.** Every sidebar dimension divides by
~1.1791 into a round number (18.866→16, 71.925→61, 305.388→259; 8 of 8),
which suggests the group was scaled up in Figma. **What was done:** the
mockup is reproduced as it renders — the raw values rounded to whole pixels
(19 / 72 / 62 / 305 / 21 / 5), not the divided ones, so the result matches
the Figma screenshot. If the owner confirms the scaling was accidental, four
tokens change: `--text-nav`, `--spacing-nav-item`, `--spacing-nav-sub`,
`--spacing-nav-group`.

Both answers are written into the code by the implementer, not by the
project owner. Related: `docs/open-questions.md`.

## Changed in this revision

Revision date 2026-09-20 (second pass). The mockup was implemented.

- **[changed]** The file no longer carries parallel CODE and MOCKUP columns —
  the code *is* the mockup now, except for the list under "Still only in the
  mockup".
- **[new]** `@theme` rewritten: 12 colours, 2 font families, 12 `--text-*`
  roles, 8 `--spacing-*` shell metrics, `--shadow-card-1`.
- **[removed]** `--color-brand-50/100/500/600/700`, `--color-line` `#e6e8ec`,
  `--color-canvas` `#f5f6f8`, body colour `#1f2430`, the `Inter` stack, and
  every `text-slate-*` in `src/`.
- **[new]** Karla and DM Sans are actually loaded (Google Fonts,
  `apps/web/index.html`).
- **[new]** `components/ui/PageHeader.tsx` — breadcrumb + title + `actions`
  slot, shared by the dashboard and the catalogue.
- **[changed]** Sidebar, Topbar, AppLayout, Button, Input, Select, Spinner,
  ErrorState, BackendSwitcher, the four dashboard components and all four
  pages are rebuilt on the new tokens.
- **[new]** 9px accent scrollbar, as drawn in the mockup.
- **[new]** Findings that the previous revision of this file missed: the
  grid/list toggle (`2:128`), the content scrollbar (`2:124`), the logo being
  a raster "Auto Detail" image, the `material-symbols` nav icons, and the
  dashboard's "At a glance" / "Updates" cards and "Updates 3" badge.
- **[changed]** Q1 and Q2 are now answered *in the code* and still flagged
  for the owner.
