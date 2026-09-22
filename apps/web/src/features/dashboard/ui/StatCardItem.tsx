import { cn } from '@/lib/cn'
import type { StatCard } from '../api/mock-data'

export function StatCardItem({ stat }: { stat: StatCard }) {
  const { label, value, deltaPercent } = stat
  const hasDelta = deltaPercent !== undefined && deltaPercent !== 0
  const isUp = (deltaPercent ?? 0) > 0

  return (
    <article className="flex h-[177px] min-w-stat-card flex-col gap-8 bg-surface p-5 shadow-card-1">
      <p className="text-stat-label text-ink-subtle">{label}</p>

      <p className="flex items-center gap-[15px]">
        <span className="text-stat-value font-bold text-ink">{value}</span>

        {hasDelta && (
          <span
            className={cn(
              'text-stat-delta font-bold',
              isUp ? 'text-positive' : 'text-danger',
            )}
          >
            {isUp ? '↑' : '↓'} {Math.abs(deltaPercent)}%
          </span>
        )}
      </p>
    </article>
  )
}
