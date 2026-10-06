import { useQuery } from "@tanstack/react-query";
import { catalogueKeys } from "../api/catalogueKeys";
import { fetchCarmakers } from "../api/carmakersApi";

export function useCarmakers() {
    return useQuery({
        queryKey: catalogueKeys.carmakers(),
        queryFn: () => fetchCarmakers(),
    })
}