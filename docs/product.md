# Product

A web panel for a company that sells auto parts. A manager maintains the
catalogue (categories and items), sees stock levels, and handles orders and
warranty claims. A customer finds the right part for their vehicle through
the **Carmaker → Model → Engine** filters.

The project is a learning one (internship), built from a mockup provided by
the mentor. As a learning goal, the same REST API is implemented twice —
in Express and in NestJS — and the web app can switch between them.

## Sections

The list is taken from the navigation in
`apps/web/src/components/layout/Sidebar.tsx`.

| Section | Purpose | State |
| --- | --- | --- |
| **Dashboard** | summary: number of items, orders, recent events | UI on mock data |
| **Parts online → Catalogue** | grid of categories + vehicle lookup filters | placeholder |
| **Parts online → In stock** | availability and stock levels | not started |
| **Parts online → Orders** | customer orders and their statuses | not started |
| **Parts online → Price list** | price list, export | not started |
| **Documents** | documents attached to orders | not started |
| **Warranty claims** | warranty requests | not started |
| **Support** | link at the bottom of the sidebar | not started |

## User roles

Three roles are declared in the Prisma schema and in the shared types
(`UserRole` in `packages/shared/src/models.ts`): `admin`, `manager`,
`client`. The seeded user is an `admin`.

Permission separation is not implemented yet — right now any authenticated
user sees the whole panel. The real access rules will have to be enforced
in both APIs, not only in the UI.

## Deliberately out of MVP scope

Payments, delivery, localisation, analytics, promo codes, reviews,
a mobile app.
