import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <p className="text-stat-value font-bold text-ink">404</p>
        <p className="mt-2 text-section text-ink-muted">This page does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block text-section font-medium text-accent hover:underline"
        >
          Go to the dashboard
        </Link>
      </div>
    </div>
  )
}
