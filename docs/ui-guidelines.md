# UI

Only what is actually in the code is recorded here. A design mockup will be
added later — until then this file describes the actual state, not the
target one.

## Tokens

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

## Layout

- `AppLayout` — full-height flex; `html, body, #root { height: 100% }`.
- Sidebar: `w-60` wide (240px), light, fixed, scrolling inside the
  navigation. Collapsing is not implemented.
- Topbar: `h-16` tall, content aligned to the right.
- Content: `p-6`, its own vertical scroll.

## Component conventions

- Card: `rounded-2xl border border-line bg-white`.
- Control (button, input, select): `h-10` tall, `rounded-lg`.
- Focus: `focus:border-brand-500 focus:ring-2 focus:ring-brand-100`.
- Spacing is a multiple of 4 — Tailwind utilities only, no arbitrary values.
- Classes are joined with `cn()` from `apps/web/src/lib/cn.ts`.
- Component variants are an object map `Record<Variant, string>`
  (see `components/ui/Button.tsx`), not chained ternaries.

## Rules

- New colours go into `@theme`, they are not hardcoded in JSX.
- Shared visual elements live in `components/ui/`, they are not duplicated
  across features.
