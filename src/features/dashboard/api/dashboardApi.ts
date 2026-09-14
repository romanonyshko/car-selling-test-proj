import { dashboardMock, type DashboardData } from './mock-data'

const MOCK_DELAY_MS = 300

export function fetchDashboard(): Promise<DashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dashboardMock), MOCK_DELAY_MS)
  })
}
