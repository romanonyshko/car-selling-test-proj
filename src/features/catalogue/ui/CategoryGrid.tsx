import type { Category } from '@auto-lincoln/contracts'
import { CategoryCard } from './CategoryCard'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-[repeat(3,352px)] gap-x-8 gap-y-[30px]">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  )
}
