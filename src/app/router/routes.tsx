import { AppLayout } from '@/components/layout/AppLayout'
import { CataloguePage } from '@/pages/catalogue/CataloguePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SupportPage } from '@/pages/support/SupportPage'
import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import { ProtectedRoute } from './ProtectedRoute'

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedRoute,
})

const layoutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  id: 'layout',
  component: AppLayout,
})

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: DashboardPage,
})

const partsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'parts',
})

const partsIndexRoute = createRoute({
  getParentRoute: () => partsRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/parts/catalogue', replace: true })
  },
})

const catalogueRoute = createRoute({
  getParentRoute: () => partsRoute,
  path: 'catalogue',
  component: CataloguePage,
})

const supportRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'support',
  component: SupportPage,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRoute.addChildren([
    layoutRoute.addChildren([
      dashboardRoute,
      partsRoute.addChildren([partsIndexRoute, catalogueRoute]),
      supportRoute,
    ]),
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
