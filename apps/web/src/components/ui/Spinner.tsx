export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
      <span className="size-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label ?? 'Завантаження…'}
    </div>
  )
}
