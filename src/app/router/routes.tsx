import { AppLayout } from '@/components/layout/AppLayout'
import { CataloguePage } from '@/pages/catalogue/CataloguePage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'parts', element: <Navigate to="/parts/catalogue" replace /> },
          { path: 'parts/catalogue', element: <CataloguePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
