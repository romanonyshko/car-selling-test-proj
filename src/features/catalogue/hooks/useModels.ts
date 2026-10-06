import { skipToken, useQuery } from "@tanstack/react-query";
import { catalogueKeys } from "../api/catalogueKeys";
import { fetchModels } from "../api/modelsApi";

export function useModels(carmakerId: string | undefined = undefined){
    return useQuery({
        queryKey: catalogueKeys.models(carmakerId),
        queryFn: carmakerId ? () => fetchModels(carmakerId) : skipToken,
    })
}