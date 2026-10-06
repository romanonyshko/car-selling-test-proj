export interface CarFilters {
    make?: string
    model?: string
    engine?: string
}

function toOptionalString(value: unknown): string | undefined {
    if(value === '') return undefined
    if(typeof value === 'string') return value  
    return undefined
}

export function parseCarFilters(search: Record<string, unknown>): CarFilters {
    return {
        make: toOptionalString(search.make),
        model: toOptionalString(search.model),
        engine: toOptionalString(search.engine)
    }
}