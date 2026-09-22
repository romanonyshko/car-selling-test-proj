import { Fragment } from 'react'
import { cn } from '@/lib/cn'
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
  className?: string
}

export function UpdatesCard({
  latestNews,
  latestReview,
  requests,
  className,
}: UpdatesCardProps) {
  const requestItems = [
    { label: 'All', count: requests.all },
    { label: 'Pending', count: requests.pending },
    { label: 'Approved', count: requests.approved },
    { label: 'Spam', count: requests.spam },
    { label: 'Trash', count: requests.trash },
  ]

  return (
    <section
      className={cn(
        'flex flex-col bg-surface p-5 text-section shadow-card-1',
        className,
      )}
    >
      <h2 className="mb-8 text-section font-medium text-accent">Updates</h2>

      <div className="border-b border-line pb-4">
        <h3 className="mb-3 font-bold text-ink">Recently published news</h3>
        <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="text-ink">{formatPublishedAt(latestNews.publishedAt)}</span>
          <a href="#" className="text-accent hover:underline">
            {latestNews.title}
          </a>
        </p>
      </div>

      <div className="border-b border-line py-4">
        <h3 className="mb-3 font-bold text-ink">Recent reviews</h3>
        <p className="text-ink">
          From{' '}
          <a href="#" className="text-accent hover:underline">
            {latestReview.author}
          </a>{' '}
          on{' '}
          <a href="#" className="text-accent hover:underline">
            {latestReview.postTitle}
          </a>
        </p>
        <p className="mt-4 text-ink">Text:</p>
        <p className="mt-1 leading-relaxed text-ink">{latestReview.text}</p>
      </div>

      <div className="mt-auto pt-4">
        <h3 className="mb-3 font-bold text-ink">Requests</h3>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink">
          {requestItems.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && (
                <span aria-hidden className="text-line">
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
