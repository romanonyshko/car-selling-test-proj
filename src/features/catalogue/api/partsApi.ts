import { apiRequest } from "@/lib/apiClient";
import { type PartsQuery, type PartsResponse, API_ROUTES } from "@auto-lincoln/contracts";

export async function fetchParts(filters: PartsQuery): Promise<PartsResponse> {
    const entries = Object.entries(filters)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])

    const params = new URLSearchParams(entries).toString()
    const path = params ? `${API_ROUTES.parts}?${params}` : API_ROUTES.parts

    return await apiRequest<PartsResponse>(path)
}
