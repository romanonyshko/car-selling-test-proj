export type CatalogueView = 'grid' | 'list'

export interface CatalogueSearch {
  view?: 'list'
}

export function parseCatalogueSearch(search: Record<string, unknown>): CatalogueSearch {
  return { view: search.view === 'list' ? 'list' : undefined }
}
