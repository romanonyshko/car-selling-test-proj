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
        <span className="mb-1.5 block text-xs font-medium text-slate-500">
          {label}
        </span>
      )}
      <select
        {...props}
        className={cn(
          'h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          !props.value && 'text-slate-400',
          className,
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-800">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
