import { CheckIcon } from '@/components/icons/CheckIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { cn } from '@/lib/cn'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function Select({
  label,
  placeholder = 'Select…',
  options,
  value,
  onChange,
  disabled,
  className,
}: SelectProps) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [isExpanded, setIsOpen] = useState(false)
  const isOpen = isExpanded && !disabled
  const [activeIndex, setActiveIndex] = useState(0)

  const items: SelectOption[] = [{ value: '', label: placeholder }, ...options]
  const selected = options.find((option) => option.value === value)
  const optionId = (index: number) => `${id}-option-${index}`

  function open() {
    if (disabled) return
    setActiveIndex(Math.max(0, items.findIndex((item) => item.value === value)))
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function choose(index: number) {
    const item = items[index]
    if (item && item.value !== value) onChange(item.value)
    close()
  }

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const list = listRef.current
    list.focus({ preventScroll: true })
    if (list.getBoundingClientRect().bottom > window.innerHeight) list.scrollIntoView({ block: 'end' })

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex, id])

  function handleButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      open()
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = items.length - 1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(last, index + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(0, index - 1))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        setIsOpen(false)
        break
      default:
        if (event.key.length === 1) {
          const letter = event.key.toLowerCase()
          const match = items.findIndex(
            (item, index) => index > 0 && item.label.toLowerCase().startsWith(letter),
          )
          if (match !== -1) setActiveIndex(match)
        }
    }
  }

  return (
    <div ref={rootRef} className="block">
      {label && (
        <span id={`${id}-label`} className="mb-3 block font-display text-field-label font-medium text-accent">
          {label}
        </span>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-list`}
          aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          onKeyDown={handleButtonKeyDown}
          className={cn(
            'flex h-field w-full items-center justify-between gap-3 border bg-field px-5 text-left text-field outline-none transition-colors',
            'focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50',
            isOpen ? 'border-accent' : 'border-line enabled:hover:border-ink-subtle',
            className,
          )}
        >
          <span id={`${id}-value`} className={cn('truncate', selected ? 'text-ink' : 'text-ink-muted')}>
            {selected?.label ?? placeholder}
          </span>
          <span className={cn('size-6 shrink-0 text-ink transition-transform', isOpen && 'rotate-180')}>
            <ChevronDownIcon />
          </span>
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-activedescendant={optionId(activeIndex)}
            onKeyDown={handleListKeyDown}
            className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto border border-line bg-surface py-2 shadow-card-hover outline-none"
          >
            {items.map((item, index) => {
              const isSelected = item.value === value
              const isPlaceholder = index === 0

              return (
                <li
                  key={item.value || 'placeholder'}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActiveIndex(index)}
                  onClick={() => choose(index)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 px-5 py-3 transition-colors',
                    index === activeIndex && 'bg-accent-soft',
                    isPlaceholder ? 'text-ink-muted' : isSelected ? 'font-medium text-accent' : 'text-ink',
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && !isPlaceholder && (
                    <span className="size-5 shrink-0">
                      <CheckIcon />
                    </span>
                  )}
                </li>
              )
            })}

            {options.length === 0 && (
              <li role="presentation" className="px-5 py-3 text-crumb text-ink-muted">
                No options
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
