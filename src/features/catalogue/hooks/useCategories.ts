import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/catalogueApi";
import { catalogueKeys } from "../api/catalogueKeys";

export function useCategories(){
    return useQuery({
        queryKey: catalogueKeys.categories(),
        queryFn: fetchCategories
    })
}