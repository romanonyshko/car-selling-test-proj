import type { Timestamp } from 'firebase/firestore'

export interface Category {
  id: string
  title: string
  slug: string
  imageUrl: string
  order: number
}

export interface Part {
  id: string
  categoryId: string
  title: string
  articleNumber: string
  brand: string
  price: number
  currency: 'EUR' | 'USD' | 'UAH'
  inStock: number
  imageUrl?: string
  carmaker: string
  model: string
  engine: string
  createdAt?: Timestamp
}

export interface PartsFilters {
  carmaker?: string
  model?: string
  engine?: string
  search?: string
}

export type UserRole = 'admin' | 'manager' | 'client'

export interface AppUser {
  id: string
  email: string
  displayName: string
  role: UserRole
}
