import { Fragment } from 'react'
import { cn } from '@/lib/cn'
import type { NewsItem, RequestCounts, ReviewItem } from '@auto-lincoln/contracts'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function withOrdinal(day: number) {
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
  latestNews: NewsItem | null
  latestReview: ReviewItem | null
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
        'bg-surface px-[22px] pt-[34px] pb-[44px] text-card-body text-ink shadow-card-1',
        className,
      )}
    >
      <h2 className="mb-[39px] text-card-heading font-bold text-accent">Updates</h2>

      <h3 className="font-bold">Recently published news</h3>
      {latestNews ? (
        <p className="mt-[15px] grid h-[47px] grid-cols-[163px_1fr] items-center border-b-2 border-divider">
          <span>{formatPublishedAt(latestNews.publishedAt)}</span>
          <a href="#" className="text-accent hover:underline">
            {latestNews.title}
          </a>
        </p>
      ) : (
        <p className="mt-[15px] text-ink-subtle">No news yet</p>
      )}

      <h3 className="mt-[13px] font-bold">Recent reviews</h3>
      {latestReview ? (
        <div className="mt-[27px] max-w-[440px]">
          <p>
            From{' '}
            <a href="#" className="font-medium text-accent hover:underline">
              {latestReview.author}
            </a>{' '}
            on{' '}
            <a href="#" className="text-accent hover:underline">
              {latestReview.postTitle}
            </a>
          </p>
          <p className="mt-[23px] text-ink-soft">Text:</p>
          <p className="mt-[23px]">{latestReview.text}</p>
        </div>
      ) : (
        <p className="mt-[27px] text-ink-subtle">No reviews yet</p>
      )}

      <h3 className="mt-[49px] font-bold">Requests</h3>
      <p className="mt-[21px] flex flex-wrap items-center text-section leading-[21px]">
        {requestItems.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && <span aria-hidden className="h-[21px] w-[2px] bg-accent" />}
            <span className={index > 0 ? 'px-[10px]' : 'pr-[10px]'}>
              {`${item.label} (${item.count})`}
            </span>
          </Fragment>
        ))}
      </p>
    </section>
  )
}
