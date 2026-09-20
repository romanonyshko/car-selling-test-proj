import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <p className="text-stat-value font-bold text-ink">404</p>
        <p className="mt-2 text-section text-ink-muted">Такої сторінки немає.</p>
        <Link
          to="/"
          className="mt-6 inline-block text-section font-medium text-accent hover:underline"
        >
          На головну
        </Link>
      </div>
    </div>
  )
}
