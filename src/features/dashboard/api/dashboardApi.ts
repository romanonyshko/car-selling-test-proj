import { apiRequest } from '@/lib/apiClient'
import { API_ROUTES, type DashboardResponse } from '@auto-lincoln/contracts'


export async function fetchDashboard(): Promise<DashboardResponse> {
  return await apiRequest<DashboardResponse>(API_ROUTES.dashboard)
}
