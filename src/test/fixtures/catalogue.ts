import type {
  CarmakersResponse,
  CarModelsResponse,
  CategoriesResponse,
  EnginesResponse,
  PartsResponse,
} from '@auto-lincoln/contracts'

export const CARMAKER_ID = '1b2c3d4e-0000-4000-8000-000000000001'
export const MODEL_ID = '1b2c3d4e-0000-4000-8000-000000000002'
export const ENGINE_ID = '1b2c3d4e-0000-4000-8000-000000000003'
export const CATEGORY_ID = '3f6c2a1e-8b4d-4c7a-9e2f-1a5b6c7d8e90'
export const OTHER_CATEGORY_ID = '7a1d9c4b-2e3f-4a5b-8c6d-9e0f1a2b3c4d'

export const categories: CategoriesResponse = [
  {
    id: CATEGORY_ID,
    title: 'Brakes',
    image: '/images/categories/brakes.png',
    order: 0,
  },
  {
    id: OTHER_CATEGORY_ID,
    title: 'Suspension',
    image: '/images/categories/suspension.png',
    order: 1,
  },
]

export const carmakers: CarmakersResponse = [
  { id: CARMAKER_ID, name: 'Lincoln' },
  { id: '1b2c3d4e-0000-4000-8000-000000000011', name: 'Ford' },
]

export const models: CarModelsResponse = [
  { id: MODEL_ID, carmakerId: CARMAKER_ID, name: 'Navigator' },
  { id: '1b2c3d4e-0000-4000-8000-000000000012', carmakerId: CARMAKER_ID, name: 'Aviator' },
]

export const engines: EnginesResponse = [
  { id: ENGINE_ID, modelId: MODEL_ID, name: '3.5L V6 EcoBoost' },
  { id: '1b2c3d4e-0000-4000-8000-000000000013', modelId: MODEL_ID, name: '5.4L V8' },
]

export const brakeParts: PartsResponse = {
  items: [
    {
      id: '1b2c3d4e-0000-4000-8000-000000000021',
      categoryId: CATEGORY_ID,
      title: 'Front brake pads',
      articleNumber: 'BP-1001',
      brand: 'Brembo',
      price: 89.5,
      currency: 'EUR',
      inStock: 12,
      image: null,
      createdAt: '2026-01-15T10:00:00.000Z',
      compatibleEngineIds: [ENGINE_ID],
    },
  ],
  nextCursor: null,
}

export const suspensionParts: PartsResponse = {
  items: [
    {
      id: '1b2c3d4e-0000-4000-8000-000000000022',
      categoryId: OTHER_CATEGORY_ID,
      title: 'Rear shock absorber',
      articleNumber: 'SA-2002',
      brand: 'Bilstein',
      price: 140,
      currency: 'EUR',
      inStock: 4,
      image: '/images/parts/shock.png',
      createdAt: '2026-02-01T10:00:00.000Z',
      compatibleEngineIds: [],
    },
  ],
  nextCursor: null,
}
