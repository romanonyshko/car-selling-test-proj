# UI

**[changed]** A mockup now exists, so this file no longer describes only the
code. It holds two parallel sets of values:

- **CODE** — what `apps/web/src` actually renders today.
- **MOCKUP** — the target taken from Figma. Nothing marked MOCKUP is
  implemented yet.

Never read a MOCKUP value as the current state. Where the two differ, the
difference is spelled out.

Source of the MOCKUP column: Figma file `qVzu3KVGXpgPrWF254NRSo`
("Auto Lincoln analysis copy"), node `2:24` — a section with two 1920x1206
screens, `2:25` "Auto parts catalogue" and `2:206` "Dashboard".
Read on 2026-09-20.

**Declared vs observed.** A token is *declared* when it exists in Figma as a
variable or a style; it is *observed* when it was read off a layer's
properties and has no variable behind it. Node `2:24` declares exactly two
things (see below) — every other mockup value in this file is observed and
may change when the design is tokenised.

## Tokens

### Declared in Figma **[new]**

| Figma name | Value | Note |
| --- | --- | --- |
| `black / 50` | `#1F1F1F` | the only declared colour variable |
| `card 1` | drop shadow, `#1F1F1F0A`, offset `0 4`, blur `40`, spread `-4` | card elevation |

CSS equivalent of `card 1`: `box-shadow: 0 4px 40px -4px rgba(31,31,31,0.04)`.

### In the code today **[unchanged]**

From `@theme` in `apps/web/src/index.css` — Tailwind v4 generates utilities out of
them (`bg-brand-500`, `border-line`, …):

| Token | Value | Where it is used |
| --- | --- | --- |
| `--color-brand-50` | `#eef6ff` | background of the active menu item |
| `--color-brand-100` | `#d9ebff` | input focus ring |
| `--color-brand-500` | `#2f80ed` | primary button, logo, active state |
| `--color-brand-600` | `#1f6fd8` | primary button hover, links |
| `--color-brand-700` | `#1a5cb4` | reserved |
| `--color-surface` | `#ffffff` | cards, sidebar, topbar |
| `--color-canvas` | `#f5f6f8` | page background (`body`) |
| `--color-line` | `#e6e8ec` | all borders and dividers |

Text: `#1f2430` (`body`). For secondary text the components use
`text-slate-500` / `text-slate-600`.

Font: `Inter`, then the system stack. The font file is not loaded —
the system font is rendered for now.

### Mockup colours — observed **[new]**

Not in `@theme` yet. No name in Figma; the names below are proposed, not
declared.

| Proposed token | Value | Used for |
| --- | --- | --- |
| accent | `#177cca` | active nav item text, active-item indicator bar, dropdown field label, header greeting "Hello, Martin" |
| accent 10% | `rgba(23,124,202,0.1)` | active nav item background (= accent at 10%) |
| text primary | `#353535` | page title, card title, current breadcrumb item, active sub-nav item, stat value |
| text secondary | `rgba(53,53,53,0.5)` | field placeholder, parent breadcrumb, inactive sub-nav items (= text primary at 50%) |
| text muted | `#979797` | stat-card label |
| positive | `#45b73b` | positive delta ("2%", "8%") |
| canvas | `#f8fbfd` | content area background (node `2:123` "content") |
| field bg | `#f8f8f8` | dropdown field background |
| line | `rgba(31,31,31,0.1)` | 1px dropdown field border, dividers |
| surface | `#ffffff` | header, sidebar, catalogue card, stat card |

Deltas against the code, for whoever migrates `@theme`:

- accent: CODE `#2f80ed` → MOCKUP `#177cca`.
- canvas: CODE `#f5f6f8` → MOCKUP `#f8fbfd`.
- body text: CODE `#1f2430` → MOCKUP `#353535`.
- line: CODE `#e6e8ec` (opaque) → MOCKUP `rgba(31,31,31,0.1)` (alpha).
- `--color-brand-50/100/700` and the `text-slate-*` secondary text have no
  counterpart in the mockup; secondary text there is the primary colour at
  50% alpha.
- `positive` (`#45b73b`) and `text muted` (`#979797`) are new — no code token.

### Typography — observed **[new]**

The mockup uses **two** families, neither of which is loaded today.
CODE: `'Inter'` + system stack, no font file. MOCKUP: Karla + DM Sans.

Karla:

| Weight / size / line-height | Used for |
| --- | --- |
| Bold 18.866px / normal | sidebar nav item and sub-item labels (see Q2 — possibly 16px) |
| Medium 32px / normal | page title ("Auto parts catalogue", "Dashboard") |
| Medium 18px / 24px | header greeting |
| Regular 14px / 24px | breadcrumb |
| Regular 18px / 24px | dropdown field value / placeholder |
| Regular 20px / normal | stat-card label |
| Bold 40px / normal | stat-card value |
| Bold 22px / normal | stat-card delta |

DM Sans:

| Weight / size / line-height | Used for |
| --- | --- |
| Medium 18px / 20px | catalogue card title (`font-variation-settings: 'opsz' 14`) |
| Medium 16px / normal | dropdown field label |

No text style is declared in Figma for any of these — all observed.

## Layout

### In the code today **[unchanged]**

- `AppLayout` — full-height flex; `html, body, #root { height: 100% }`.
- Sidebar: `w-60` wide (240px), light, fixed, scrolling inside the
  navigation. Collapsing is not implemented.
- Topbar: `h-16` tall, content aligned to the right.
- Content: `p-6`, its own vertical scroll.

### Mockup layout — observed **[new]**

Screen frame 1920x1206. Breakpoints: the mockup shows a single desktop
width, so no breakpoint set can be derived from it.

Shell:

| Region | CODE | MOCKUP |
| --- | --- | --- |
| Sidebar width | 240 (`w-60`) | 316, full height, white, 1px right divider |
| Header height | 64 (`h-16`) | 80, white, 1px bottom divider |
| Content padding | 24 (`p-6`) | 34 left (title at x=350, content frame at x=316) |
| Content background | `--color-canvas` `#f5f6f8` | `#f8fbfd` |
| Right filter panel | none | 391 wide, white, 1px left divider |

Sidebar (`menu tablet`, node `2:26`) — raw Figma values; the "possibly"
column is an **unconfirmed** inference, see Q2:

| Item | Raw Figma | Possibly intended (unconfirmed) |
| --- | --- | --- |
| nav item height | 71.925 | 61 |
| sub-item height | 62.493 | 53 |
| inner nav group width | 305.388 | 259 |
| active indicator bar width | 4.716 | 4 |
| sub-item corner radius (left corners) | 14.149 | 12 |
| nav icon (square) | 21.224 | 18 |
| trailing chevron frame (square) | 29.478 | 25 |
| nav label font size | 18.866 | 16 |

Other sidebar facts (not affected by the scaling question): logo 98x48 at
(38,26); collapse toggle 28.3x28.3 top-right; "Support" row pinned near the
bottom at y=1105; nav icon at x=21; sub-item label x-offset 80.18; active
item background `rgba(23,124,202,0.1)` with the indicator bar at the item's
right edge, full item height.

Header (node `2:162`): content right-aligned, right offset 40, top 27; cart
icon 24 square; avatar / chevron 25.

Content (node `2:123`): breadcrumb at y=100 — flex, gap 8, 8x8 dot
separators; page title at y=148.

Catalogue grid: 3 columns, card 352x209, column gap 32, row gap 30.

Right filter panel (node `2:172`): panel title "Find your car parts" at
(80,40); collapse toggle 32x32 at (32,39); dropdown blocks at y=111, 244,
377.

Dashboard: stat card 295x177, grid pitch 315 horizontal / 194 vertical;
chart panel (node `2:324`) 925x562, padding 20, gridlines every 80px,
y-axis labels 0..50k.

## Component conventions

### In the code today **[unchanged]**

- Card: `rounded-2xl border border-line bg-white`.
- Control (button, input, select): `h-10` tall, `rounded-lg`.
- Focus: `focus:border-brand-500 focus:ring-2 focus:ring-brand-100`.
- Classes are joined with `cn()` from `apps/web/src/lib/cn.ts`.
- Component variants are an object map `Record<Variant, string>`
  (see `components/ui/Button.tsx`), not chained ternaries.

**[changed]** "Spacing is a multiple of 4 — Tailwind utilities only, no
arbitrary values" used to live in this list. It is still the rule in force
for the code, but the mockup contradicts it — the rule is parked in Q1 below
until the project owner decides. Do not silently break it and do not
silently drop it.

### Mockup components — observed **[new]**

Every component below is described as it appears in the mockup; none of it is
implemented.

**Catalogue card** (node `2:150`) — white, **no border**, **no
border-radius**, `overflow: hidden`, shadow = declared effect `card 1`.
Structure: image band 147 tall → 1px full-width divider → body with padding
20 horizontal / 21 vertical → title (DM Sans Medium 18/20, `#353535`), inner
text width 312. Differs from the CODE card (`rounded-2xl border border-line`,
no shadow) on all three of radius, border and elevation.

**Dropdown field** (block node `2:175`) — label → 12px gap → field; blocks
stacked with gap 4; a hidden "Error text" node (18 tall) sits below each
field, so an error slot must be reserved. Field: 327x60, padding 20
horizontal / 18 vertical, background `#f8f8f8`, 1px border
`rgba(31,31,31,0.1)`, **no radius**, trailing chevron 24 square. Label is DM
Sans Medium 16 in the accent colour `#177cca`; value / placeholder is Karla
Regular 18/24, placeholder at `rgba(53,53,53,0.5)`.
CODE control is `h-10` + `rounded-lg` — both differ.

**Stat card** (node `2:361`) — 295x177, white, padding 20, flex column, gap
32. Label row → value row (value + gap 15 + arrow + delta).

**Variants and states seen in the mockup:**

- Nav item: default / active (accent background at 10% + accent label +
  indicator bar). No hover, focus or disabled state is drawn.
- Sub-nav item: active (`#353535`) / inactive (`rgba(53,53,53,0.5)`).
- Breadcrumb item: parent (`rgba(53,53,53,0.5)`) / current (`#353535`).
- Dropdown field: placeholder / filled; error is present as a hidden node
  only, so its styling is unknown.
- Stat delta: positive (`#45b73b`) only — no negative variant drawn.
- Sidebar and filter panel each have a collapse toggle, but the collapsed
  state itself is not in this frame.

No focus, hover, disabled or loading state exists anywhere in the mockup.
Those stay the code's own decision.

## Rules

- **[unchanged]** New colours go into `@theme`, they are not hardcoded in JSX.
  This applies to the mockup colours too: when they land, they land as tokens.
- **[unchanged]** Shared visual elements live in `components/ui/`, they are not
  duplicated across features.
- **[new]** Do not mix CODE and MOCKUP values in one component. Migrate a
  component to the mockup wholesale, or leave it on the current tokens.
- **[new]** When you write a mockup value into the code, move its row from the
  MOCKUP table into the code table in this file in the same change.
- **[new]** Observed values are provisional. If a token later shows up as a
  Figma variable, the declared value wins.
- **[new]** Sidebar numbers must not be typed straight from the raw Figma
  values until Q2 is answered.

## Open questions

Recorded verbatim, unanswered. Do not resolve them in code without the
project owner. Related: `docs/open-questions.md`.

**Q1.** The existing rule "Spacing is a multiple of 4 — Tailwind utilities
only, no arbitrary values" is incompatible with the mockup, which uses py-21,
py-18, row gap 30, nav item height 71.925, sub-item height 62.493. Drop the
4px rule, or round the mockup values to the grid?

**Q2.** Every sidebar dimension divides by ~1.1791 into a round number
(18.866→16, 21.224→18, 29.478→25, 4.716→4, 14.149→12, 62.493→53,
71.925→61, 305.388→259; 8 of 8 match). This suggests the sidebar group was
scaled up in Figma and the intended values are the divided ones. This is an
arithmetic inference by the main agent, NOT a fact reported by Figma. Should
the divided values be used?

## Changed in this revision

Revision date 2026-09-20. Source: Figma `qVzu3KVGXpgPrWF254NRSo`, node `2:24`.

- **[changed]** Intro: the "no mockup exists, code only" premise is gone.
  The file now carries CODE and MOCKUP values side by side, with the source
  cited and a declared/observed convention defined.
- **[new]** "Tokens → Declared in Figma": the two declared items on node
  `2:24` — colour `black / 50` `#1F1F1F` and effect `card 1`.
- **[new]** "Tokens → Mockup colours — observed": 10 proposed colour tokens
  plus an explicit delta list against `@theme`.
- **[new]** "Tokens → Typography — observed": Karla (8 roles) and DM Sans
  (2 roles). The code still declares only `Inter` and loads no font file.
- **[new]** "Layout → Mockup layout — observed": shell comparison table,
  sidebar dimensions with raw and unconfirmed-intended values, header,
  content, catalogue grid, filter panel, dashboard.
- **[new]** "Component conventions → Mockup components — observed":
  catalogue card, dropdown field, stat card, plus the variants and states
  that actually appear in the frame.
- **[changed]** The "spacing is a multiple of 4" bullet moved out of the
  conventions list into a note pointing at Q1; it is still in force for the
  code but is no longer stated as compatible with the mockup.
- **[new]** "Rules": four rules about migrating mockup values.
- **[new]** "Open questions": Q1 (4px spacing grid) and Q2 (~1.1791 sidebar
  scaling), both unresolved.
- **[unchanged]** Every pre-existing statement about the code — `@theme`
  table, `Inter`, `AppLayout` / `w-60` / `h-16` / `p-6`, card and control
  classes, focus ring, `cn()`, `Record<Variant, string>`, and the two
  original rules — is kept verbatim.
- Not covered by the mockup and therefore still undefined: breakpoints
  (one desktop width only), hover / focus / disabled / loading states,
  collapsed sidebar and collapsed filter panel, error-state styling,
  negative stat delta.
