import { skipToken, useQuery } from "@tanstack/react-query";
import { catalogueKeys } from "../api/catalogueKeys";
import { fetchEngines } from "../api/enginesApi";

export function useEngines(modelId: string | undefined = undefined){
    return useQuery({
        queryKey: catalogueKeys.engines(modelId),
        queryFn: modelId ? () => fetchEngines(modelId) : skipToken,
    })
}