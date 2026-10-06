import { apiRequest } from "@/lib/apiClient";
import { type CarModelsResponse, API_ROUTES } from "@auto-lincoln/contracts";

export async function fetchModels(carmakerId: string): Promise<CarModelsResponse> {
    return await apiRequest<CarModelsResponse>(API_ROUTES.carmakerModels(carmakerId))
}
