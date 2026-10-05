/** Minimal class joiner, so clsx is not pulled in for two lines. */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}
