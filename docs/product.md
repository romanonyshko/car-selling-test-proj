# Product

A web panel for a company that sells auto parts. A manager maintains the
catalogue (categories and items), sees stock levels, and handles orders and
warranty claims. A customer finds the right part for their vehicle through
the **Carmaker → Model → Engine** filters.

The UI follows a Figma mockup. The backend is a NestJS API
(`auto-lincoln-api-nest`); the web app and the API share one contract
package, `@auto-lincoln/contracts`.

## Current implementation status

Checked against the code on 2026-10-05. Order of the remaining work:
[`roadmap.md`](roadmap.md).

| Area | Status | What exists |
| --- | --- | --- |
| Login / logout | Implemented | `/login`, JWT in an httpOnly cookie |
| API | Implemented | NestJS: health, auth, dashboard, support chat (WebSocket) |
| Dashboard | Implemented | full UI on `GET /api/dashboard`, values from the DB seed — [`dashboard-page.md`](dashboard-page.md) |
| Parts online → Catalogue | Partially implemented | route + text placeholder — [`catalogue-page.md`](catalogue-page.md) |
| In stock, Orders, Price list | Planned | sidebar links only, lead to a 404 |
| Support | Implemented (echo) | `/support`, WebSocket chat; the Nest API echoes the user's text — [`support-chat.md`](support-chat.md) |
| Documents, Warranty claims | Planned | sidebar links only, lead to a 404 |
| Roles | Planned | declared in schema and types, not enforced (open question #5) |

## Sections

The list is taken from the navigation in
`src/components/layout/Sidebar.tsx`.

| Section | Purpose |
| --- | --- |
| **Dashboard** | summary: number of items, orders, recent events |
| **Parts online → Catalogue** | grid of categories + vehicle lookup filters |
| **Parts online → In stock** | availability and stock levels |
| **Parts online → Orders** | customer orders and their statuses |
| **Parts online → Price list** | price list, export |
| **Documents** | documents attached to orders |
| **Warranty claims** | warranty requests |
| **Support** | chat with support over a WebSocket; link at the bottom of the sidebar |

The Dashboard item also has Home, Updates, Posts and Media sub-items in the
sidebar; only Home has a route.

## User roles

Three roles are declared in the Prisma schema of `auto-lincoln-api-nest`
(`UserRole`): `admin`, `manager`, `client`; a new user defaults to
`manager`. There is no registration — the test accounts are listed in
`auto-lincoln-api-nest/README.md`.

Permission separation is not implemented yet — right now any authenticated
user sees the whole panel. The real access rules will have to be enforced
in the API, not only in the UI.

## Deliberately out of MVP scope

Payments, delivery, localisation, analytics, promo codes, reviews,
a mobile app. Full list: [`roadmap.md`](roadmap.md) → "Not a priority
right now".
