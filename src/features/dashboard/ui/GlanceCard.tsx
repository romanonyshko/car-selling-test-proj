import type { GlanceStats } from '../api/mock-data'

export function GlanceCard({ glance }: { glance: GlanceStats }) {
  const rows = [
    { label: 'Posts', value: `${glance.posts} posts` },
    { label: 'Reviews', value: `${glance.reviews} reviews` },
    { label: 'Pages', value: `${glance.pages} pages` },
  ]

  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-brand-600">At a glance</h2>

      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <dt className="text-sm text-slate-500">{row.label}</dt>
            <dd className="text-sm font-medium text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
