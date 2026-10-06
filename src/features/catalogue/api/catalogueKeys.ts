import type { PartsQuery } from "@auto-lincoln/contracts";

export const catalogueKeys = {
    root: () => ['catalogue'] as const,
    carmakers: () => [...catalogueKeys.root(), 'carmakers'] as const,
    models: (carmakerId: string | undefined) => [...catalogueKeys.root(), 'models', carmakerId] as const,
    engines: (modelId: string | undefined) => [...catalogueKeys.root(), 'engines', modelId] as const,
    categories: () => [...catalogueKeys.root(), 'categories'] as const,
    parts: (filters: PartsQuery) => [...catalogueKeys.root(), 'parts', filters] as const
}