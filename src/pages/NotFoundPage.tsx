import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <p className="text-4xl font-semibold text-slate-900">404</p>
        <p className="mt-2 text-sm text-slate-500">Такої сторінки немає.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-brand-600 underline">
          На головну
        </Link>
      </div>
    </div>
  )
}
