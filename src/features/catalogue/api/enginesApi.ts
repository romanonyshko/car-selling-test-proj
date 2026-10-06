import { apiRequest } from "@/lib/apiClient";
import { type EnginesResponse, API_ROUTES } from "@auto-lincoln/contracts";

export async function fetchEngines(modelId: string): Promise<EnginesResponse> {
    return await apiRequest<EnginesResponse>(API_ROUTES.modelEngines(modelId))
}
