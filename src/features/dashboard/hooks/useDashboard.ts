import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '../api/dashboardApi'
import { dashboardKeys } from '../api/dashboardKeys'

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.root(),
    queryFn: fetchDashboard,
  })
}
