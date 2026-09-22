import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ActivityChart } from '@/features/dashboard/ui/ActivityChart'
import { GlanceCard } from '@/features/dashboard/ui/GlanceCard'
import { StatCardItem } from '@/features/dashboard/ui/StatCardItem'
import { UpdatesCard } from '@/features/dashboard/ui/UpdatesCard'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard()

  return (
    <div>
      <PageHeader crumbs={['Dashboard', 'Home']} title="Dashboard" />

      {isLoading && <Spinner />}

      {!isLoading && (isError || !data) && (
        <ErrorState onRetry={() => refetch()} />
      )}

      {!isLoading && data && (
        // Breakpoints are container queries: the available width depends on
        // the sidebar, not only on the viewport.
        // 1520 = 527 + 68 + 3 × stat-card (295) + 2 × 20 — two columns only
        // when the stat cards still fit 3-up; 925 / 610 = 3-up / 2-up.
        <div className="@container">
          <div className="grid gap-x-[68px] gap-y-5 @min-[1520px]:grid-cols-[527px_minmax(0,1fr)]">
            <div className="flex flex-col gap-5">
              <GlanceCard glance={data.glance} />
              <UpdatesCard
                className="flex-1"
                latestNews={data.latestNews}
                latestReview={data.latestReview}
                requests={data.requests}
              />
            </div>

            <div className="@container flex flex-col gap-5">
              <ActivityChart activity={data.activity} />

              <div className="grid gap-5 @min-[610px]:grid-cols-2 @min-[925px]:grid-cols-3">
                {data.stats.map((stat) => (
                  <StatCardItem key={stat.id} stat={stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
