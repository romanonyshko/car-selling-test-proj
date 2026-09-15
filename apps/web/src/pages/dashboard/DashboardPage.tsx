import { ErrorState } from '@/components/ui/ErrorState'
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
      <p className="text-xs text-slate-400">Dashboard &rsaquo; Home</p>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-slate-900">
        Dashboard
      </h1>

      {isLoading && <Spinner />}

      {!isLoading && (isError || !data) && (
        <ErrorState onRetry={() => refetch()} />
      )}

      {!isLoading && data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <GlanceCard glance={data.glance} />
            <UpdatesCard
              latestNews={data.latestNews}
              latestReview={data.latestReview}
              requests={data.requests}
            />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <ActivityChart activity={data.activity} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
