import type { PartsQuery } from "@auto-lincoln/contracts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { catalogueKeys } from "../api/catalogueKeys";
import { fetchParts } from "../api/partsApi";

export function useParts(filters: PartsQuery){
    return useQuery({
        queryKey: catalogueKeys.parts(filters),
        queryFn: () => fetchParts(filters),
        placeholderData: keepPreviousData,
        enabled: !!filters.category
    })
}