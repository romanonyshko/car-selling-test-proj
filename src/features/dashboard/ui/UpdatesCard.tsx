import { Fragment } from 'react'
import type { NewsItem, RequestCounts, ReviewItem } from '../api/mock-data'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function withOrdinal(day: number) {
  // 11–13 — виняток: 11th, 12th, 13th, а не 11st/12nd/13rd.
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

/** '2026-03-05T17:00:00' → 'Mar 5th, 17:00' */
function formatPublishedAt(iso: string) {
  const date = new Date(iso)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${MONTHS[date.getMonth()]} ${withOrdinal(date.getDate())}, ${hours}:${minutes}`
}

interface UpdatesCardProps {
  latestNews: NewsItem
  latestReview: ReviewItem
  requests: RequestCounts
}

export function UpdatesCard({
  latestNews,
  latestReview,
  requests,
}: UpdatesCardProps) {
  const requestItems = [
    { label: 'All', count: requests.all },
    { label: 'Pending', count: requests.pending },
    { label: 'Approved', count: requests.approved },
    { label: 'Spam', count: requests.spam },
    { label: 'Trash', count: requests.trash },
  ]

  return (
    <section className="rounded-2xl border border-line bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-brand-600">Updates</h2>

      <div className="border-b border-line pb-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">
          Recently published news
        </h3>
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span className="text-slate-500">
            {formatPublishedAt(latestNews.publishedAt)}
          </span>
          <a href="#" className="font-medium text-brand-600 hover:underline">
            {latestNews.title}
          </a>
        </p>
      </div>

      <div className="border-b border-line py-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">
          Recent reviews
        </h3>
        <p className="text-sm text-slate-500">
          From{' '}
          <a href="#" className="text-brand-600 hover:underline">
            {latestReview.author}
          </a>{' '}
          on{' '}
          <a href="#" className="text-brand-600 hover:underline">
            {latestReview.postTitle}
          </a>
        </p>
        <p className="mt-3 text-sm text-slate-500">Text:</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {latestReview.text}
        </p>
      </div>

      <div className="pt-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-800">Requests</h3>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
          {requestItems.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && (
                <span aria-hidden className="text-slate-300">
                  |
                </span>
              )}
              <span>{`${item.label} (${item.count})`}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
