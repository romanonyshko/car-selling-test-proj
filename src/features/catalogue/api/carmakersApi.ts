import { apiRequest } from "@/lib/apiClient";
import { type CarmakersResponse, API_ROUTES } from "@auto-lincoln/contracts";

export async function fetchCarmakers(): Promise<CarmakersResponse> {
    return await apiRequest<CarmakersResponse>(API_ROUTES.carmakers)
}
