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
        <div className="grid gap-x-[68px] gap-y-5 xl:grid-cols-[527px_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <GlanceCard glance={data.glance} />
            <UpdatesCard
              latestNews={data.latestNews}
              latestReview={data.latestReview}
              requests={data.requests}
            />
          </div>

          <div className="flex flex-col gap-5">
            <ActivityChart activity={data.activity} />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.stats.map((stat) => (
                <StatCardItem key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
