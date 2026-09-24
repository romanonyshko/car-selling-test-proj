export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-crumb text-ink-muted">
      <span className="size-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      {label ?? 'Завантаження…'}
    </div>
  )
}
