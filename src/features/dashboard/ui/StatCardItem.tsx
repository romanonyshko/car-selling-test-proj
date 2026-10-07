import { cn } from '@/lib/cn'
import type { StatCard } from '@auto-lincoln/contracts'

export function StatCardItem({ stat }: { stat: StatCard }) {
  const { label, value, deltaPercent } = stat
  const hasDelta = deltaPercent !== undefined && deltaPercent !== 0
  const isUp = (deltaPercent ?? 0) > 0

  return (
    <article className="relative flex h-[177px] min-w-stat-card flex-col justify-center gap-[33px] bg-surface px-5 shadow-card-1">
      <p className="text-stat-label text-ink-subtle">{label}</p>

      <p className="flex items-center gap-[25px]">
        <span className="text-stat-value font-bold text-ink">{value}</span>

        {hasDelta && (
          <span
            className={cn(
              'flex items-center gap-[9px] text-stat-delta font-bold',
              isUp ? 'text-positive' : 'text-danger',
            )}
          >
            <span aria-hidden>{isUp ? '↑' : '↓'}</span>
            <span>
              <span className="sr-only">{isUp ? 'up' : 'down'} </span>
              {Math.abs(deltaPercent)}%
            </span>
          </span>
        )}
      </p>
    </article>
  )
}
