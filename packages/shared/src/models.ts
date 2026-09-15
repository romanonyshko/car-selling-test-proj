/**
 * Domain entities shared by web and both APIs.
 * Catalogue shapes follow docs/catalogue-page.md. Dates are ISO 8601 strings.
 */

export interface Category {
  id: string
  title: string
  image: string
  order: number
}

export interface Carmaker {
  id: string
  name: string
}

export interface CarModel {
  id: string
  carmakerId: string
  name: string
}

export interface Engine {
  id: string
  modelId: string
  name: string
}

export type Currency = 'EUR' | 'USD' | 'UAH'

export interface Part {
  id: string
  categoryId: string
  title: string
  compatibleEngineIds: string[]
  // Commercial fields — an extension of the spec.
  articleNumber: string
  brand: string
  price: number
  currency: Currency
  inStock: number
  image?: string
  createdAt?: string
}

export interface PartsFilters {
  make?: string
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
