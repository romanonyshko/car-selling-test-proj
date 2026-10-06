export const catalogueKeys = {
    root: () => ['catalogue'] as const,
    categories: () => [...catalogueKeys.root(), 'categories'] as const
}