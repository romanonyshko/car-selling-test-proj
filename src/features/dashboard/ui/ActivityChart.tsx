import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { ActivityPoint } from '../api/mock-data'

/** 10000 → '10k' */
function formatThousands(value: number) {
  return value >= 1000 ? `${value / 1000}k` : String(value)
}

const tickStyle = { className: 'fill-slate-400 text-xs' }

export function ActivityChart({ activity }: { activity: ActivityPoint[] }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-800">Activity</h2>

        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span aria-hidden className="size-2 rounded-full bg-brand-500" />
          New visitors
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activity} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatThousands}
              tick={tickStyle}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-brand-500)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
