import type { ActivityPoint } from '@auto-lincoln/contracts'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'


/** 10000 → '10k' */
function formatThousands(value: number) {
  return value >= 1000 ? `${value / 1000}k` : String(value)
}

const Y_TICKS = [0, 10000, 20000, 30000, 40000, 50000]

const tickStyle = { className: 'fill-ink text-crumb' }

export function ActivityChart({ activity }: { activity: ActivityPoint[] }) {
  return (
    <section className="bg-surface p-5 shadow-card-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-section font-medium text-ink">Activity</h2>

        <span className="flex items-center gap-[14px] text-crumb text-ink">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          New visitors
        </span>
      </div>

      <div className="mt-[21px] h-[477px]">
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
              domain={[0, 50000]}
              ticks={Y_TICKS}
              tickFormatter={formatThousands}
              tick={tickStyle}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-accent)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
