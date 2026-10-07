import type { GlanceStats } from "@auto-lincoln/contracts"

export function GlanceCard({ glance }: { glance: GlanceStats }) {
  const rows = [
    { label: 'Posts', value: `${glance.posts} posts` },
    { label: 'Reviews', value: `${glance.reviews} reviews` },
    { label: 'Pages', value: `${glance.pages} pages` },
  ]

  return (
    <section className="bg-surface px-[22px] pt-[34px] pb-8 shadow-card-1">
      <h2 className="mb-[35px] text-card-heading font-bold text-accent">At a glance</h2>

      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid h-[48.5px] grid-cols-[143px_1fr] items-center border-b-2 border-divider text-card-body text-ink"
          >
            <dt className="font-medium">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
