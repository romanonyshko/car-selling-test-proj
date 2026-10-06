import type { PartsQuery } from "@auto-lincoln/contracts";

export const catalogueKeys = {
    root: () => ['catalogue'] as const,
    categories: () => [...catalogueKeys.root(), 'categories',] as const,
    parts: (filters: PartsQuery)  => [...catalogueKeys.root(), 'parts', filters] as const
}