# Product

A web panel for a company that sells auto parts. A manager maintains the
catalogue (categories and items), sees stock levels, and handles orders and
warranty claims. A customer finds the right part for their vehicle through
the **Carmaker → Model → Engine** filters.

The project is a learning one (internship), built from a mockup provided by
the mentor. As a learning goal, the same REST API is implemented twice —
in Express and in NestJS — and the web app can switch between them.

## Current implementation status

Checked against the code on 2026-09-22. Order of the remaining work:
[`roadmap.md`](roadmap.md).

| Area | Status | What exists |
| --- | --- | --- |
| Login / logout | Implemented | `/login`, JWT in an httpOnly cookie, works against either API |
| Two APIs + backend switcher | Implemented | health + auth routes only |
| Dashboard | Partially implemented | full UI on mock data, no API — [`dashboard-page.md`](dashboard-page.md) |
| Parts online → Catalogue | Partially implemented | route + text placeholder — [`catalogue-page.md`](catalogue-page.md) |
| In stock, Orders, Price list | Planned | sidebar links only, lead to a 404 |
| Documents, Warranty claims, Support | Planned | sidebar links only, lead to a 404 |
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
| **Support** | link at the bottom of the sidebar |

The Dashboard item also has Home, Updates, Posts and Media sub-items in the
sidebar; only Home has a route.

## User roles

Three roles are declared in the Prisma schema and in the shared types
(`UserRole` in `auto-lincoln-contracts/src/shared/models.ts`): `admin`, `manager`,
`client`. The seed creates an `admin` and a test `manager`
(`test@autolincoln.local`); a new user defaults to `manager` (Prisma
schema). Users only come from the seed — there is no registration.

Permission separation is not implemented yet — right now any authenticated
user sees the whole panel. The real access rules will have to be enforced
in both APIs, not only in the UI.

## Deliberately out of MVP scope

Payments, delivery, localisation, analytics, promo codes, reviews,
a mobile app. Full list: [`roadmap.md`](roadmap.md) → "Not a priority
right now".
