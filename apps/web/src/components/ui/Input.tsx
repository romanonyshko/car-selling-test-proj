import { cn } from '@/lib/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-3 block font-display text-field-label font-medium text-accent">
          {label}
        </span>
      )}
      <input
        id={id}
        {...props}
        className={cn(
          'h-field w-full border border-line bg-field px-5 text-field text-ink outline-none placeholder:text-ink-muted focus:border-accent',
          className,
        )}
      />
    </label>
  )
}
