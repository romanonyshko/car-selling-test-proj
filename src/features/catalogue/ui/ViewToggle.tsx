import type { ComponentType } from 'react'
import { GridIcon } from '@/components/icons/GridIcon'
import { ListIcon } from '@/components/icons/ListIcon'
import { cn } from '@/lib/cn'
import type { CatalogueView } from '../model/catalogueView'

const options: { value: CatalogueView; label: string; Icon: ComponentType }[] = [
  { value: 'grid', label: 'Grid view', Icon: GridIcon },
  { value: 'list', label: 'List view', Icon: ListIcon },
]

interface ViewToggleProps {
  view: CatalogueView
  onChange: (view: CatalogueView) => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-4">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={view === value}
          title={label}
          onClick={() => onChange(value)}
          className={cn(
            'size-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent',
            view === value ? 'text-accent' : 'text-ink-muted hover:text-ink',
          )}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
