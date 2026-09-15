import { cn } from '@/lib/cn'
import type { StatCard } from '../api/mock-data'

export function StatCardItem({ stat }: { stat: StatCard }) {
  const { label, value, deltaPercent } = stat
  const hasDelta = deltaPercent !== undefined && deltaPercent !== 0
  const isUp = (deltaPercent ?? 0) > 0

  return (
    <article className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-800">{value}</span>

        {hasDelta && (
          <span
            className={cn(
              'text-xs font-medium',
              isUp ? 'text-green-600' : 'text-red-600',
            )}
          >
            {isUp ? '↑' : '↓'} {Math.abs(deltaPercent)}%
          </span>
        )}
      </p>
    </article>
  )
}
