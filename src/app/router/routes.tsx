import { AppLayout } from '@/components/layout/AppLayout'
import { Spinner } from '@/components/ui/Spinner'
import { meQueryOptions } from '@/features/auth/api/authQueries'
import { queryClient } from '@/lib/queryClient'
import { CataloguePage } from '@/pages/catalogue/CataloguePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SupportPage } from '@/pages/support/SupportPage'
import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'

function fetchSessionUser() {
  return queryClient.ensureQueryData(meQueryOptions).catch(() => null)
}

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: async () => {
    const user = await fetchSessionUser()
    if (user) throw redirect({ to: '/', replace: true })
  },
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: async () => {
    const user = await fetchSessionUser()
    if (!user) throw redirect({ to: '/login', replace: true })
  },
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

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <Spinner label="Перевіряємо сесію…" />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
