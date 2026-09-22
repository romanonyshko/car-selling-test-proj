import { cn } from '@/lib/cn'
import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  placeholder?: string
  options: SelectOption[]
}

export function Select({
  label,
  placeholder = 'Select…',
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-3 block font-display text-field-label font-medium text-accent">
          {label}
        </span>
      )}

      <span className="relative block">
        <select
          {...props}
          className={cn(
            'h-field w-full appearance-none border border-line bg-field px-5 pr-[52px] text-field outline-none focus:border-accent',
            props.value ? 'text-ink' : 'text-ink-muted',
            className,
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-ink">
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute top-1/2 right-5 size-6 -translate-y-1/2 text-ink"
        >
          <path d="m6 9.5 6 6 6-6" />
        </svg>
      </span>
    </label>
  )
}
