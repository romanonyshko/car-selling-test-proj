import type { GlanceStats } from '../api/mock-data'

export function GlanceCard({ glance }: { glance: GlanceStats }) {
  const rows = [
    { label: 'Posts', value: `${glance.posts} posts` },
    { label: 'Reviews', value: `${glance.reviews} reviews` },
    { label: 'Pages', value: `${glance.pages} pages` },
  ]

  return (
    <section className="bg-surface p-5 shadow-card-1">
      <h2 className="mb-8 text-section font-medium text-accent">At a glance</h2>

      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[105px_1fr] items-baseline border-b border-line py-3 text-section text-ink"
          >
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
