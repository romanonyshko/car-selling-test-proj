/** Мінімальний склеювач класів — щоб не тягнути clsx заради двох рядків. */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}
