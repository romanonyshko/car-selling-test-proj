import { useNavigate, useSearch } from "@tanstack/react-router";

export function useCarFilters() {
    const filters = useSearch({ strict: false })
    const navigate = useNavigate()

    const setMake = (id: string) => {
        const obj = {
            make: id || undefined,
            model: undefined,
            engine: undefined
        }
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...obj }),
            replace: true
        })
    }

    const setModel = (id:string) => {
         const obj = {
            make: filters.make,
            model: id || undefined,
            engine: undefined
        }
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...obj }),
            replace: true
        })
    }

     const setEngine = (id:string) => {
         const obj = {
            make: filters.make,
            model: filters.model,
            engine: id || undefined
        }
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...obj }),
            replace: true
        })
    }

    const reset = () => {
        const obj = {
             make: undefined,
            model: undefined,
            engine: undefined
        }

          navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...obj }),
            replace: true
        })
    }

    return { filters, setMake, setModel, setEngine, reset }
}

