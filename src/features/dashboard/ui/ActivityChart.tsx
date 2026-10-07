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

const tickStyle = { className: 'fill-ink text-chart-tick' }

export function ActivityChart({ activity }: { activity: ActivityPoint[] }) {
  return (
    <section className="bg-surface pt-[18px] pr-8 pb-[78px] pl-5 shadow-card-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-card-heading font-bold text-ink">Activity</h2>

        <span className="mr-[31px] flex items-center gap-2 text-section text-ink">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          New visitors
        </span>
      </div>

      <div className="mt-[18px] h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activity} margin={{ top: 10, right: 0, bottom: 10, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-ink-subtle)" />
            <XAxis dataKey="month" hide />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={54}
              tickMargin={20}
              interval={0}
              domain={[0, 50000]}
              ticks={Y_TICKS}
              tickFormatter={formatThousands}
              tick={tickStyle}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-accent)"
              strokeWidth={5}
              strokeLinecap="round"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
