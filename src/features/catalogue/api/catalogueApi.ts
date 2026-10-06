import { apiRequest } from "@/lib/apiClient";
import { type CategoriesResponse, API_ROUTES } from "@auto-lincoln/contracts";

export async function fetchCategories(): Promise<CategoriesResponse> {

    return await apiRequest<CategoriesResponse>(API_ROUTES.categories)
}