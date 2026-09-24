import { AppLayout } from '@/components/layout/AppLayout'
import { Spinner } from '@/components/ui/Spinner'
import { meQueryOptions } from '@/features/auth/api/authQueries'
import { queryClient } from '@/lib/queryClient'
import { CataloguePage } from '@/pages/catalogue/CataloguePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
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
    if (user) throw redirect({ to: '/dashboard', replace: true })
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

const rootIndexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard', replace: true })
  },
})

const dashboardGroupRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'dashboard',
})

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardGroupRoute,
  path: '/',
  component: DashboardPage,
})

const updatesRoute = createRoute({
  getParentRoute: () => dashboardGroupRoute,
  path: 'updates',
  component: () => <PlaceholderPage crumbs={['Dashboard', 'Updates']} title="Updates" />,
})

const postsRoute = createRoute({
  getParentRoute: () => dashboardGroupRoute,
  path: 'posts',
  component: () => <PlaceholderPage crumbs={['Dashboard', 'Posts']} title="Posts" />,
})

const mediaRoute = createRoute({
  getParentRoute: () => dashboardGroupRoute,
  path: 'media',
  component: () => <PlaceholderPage crumbs={['Dashboard', 'Media']} title="Media" />,
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

const inStockRoute = createRoute({
  getParentRoute: () => partsRoute,
  path: 'in-stock',
  component: () => <PlaceholderPage crumbs={['Parts online', 'In stock']} title="In stock" />,
})

const ordersRoute = createRoute({
  getParentRoute: () => partsRoute,
  path: 'orders',
  component: () => <PlaceholderPage crumbs={['Parts online', 'Orders']} title="Orders" />,
})

const priceListRoute = createRoute({
  getParentRoute: () => partsRoute,
  path: 'price-list',
  component: () => <PlaceholderPage crumbs={['Parts online', 'Price list']} title="Price list" />,
})

const documentsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'documents',
  component: () => <PlaceholderPage crumbs={['Documents']} title="Documents" />,
})

const warrantyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: 'warranty-claims',
  component: () => <PlaceholderPage crumbs={['Warranty claims']} title="Warranty claims" />,
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
      rootIndexRoute,
      dashboardGroupRoute.addChildren([dashboardRoute, updatesRoute, postsRoute, mediaRoute]),
      partsRoute.addChildren([
        partsIndexRoute,
        catalogueRoute,
        inStockRoute,
        ordersRoute,
        priceListRoute,
      ]),
      documentsRoute,
      warrantyRoute,
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
