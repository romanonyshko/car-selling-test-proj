import { Select, type SelectOption } from '@/components/ui/Select'
import { useCarFilters } from '../hooks/useCarFilters'
import { useCarmakers } from '../hooks/useCarmakers'
import { useEngines } from '../hooks/useEngines'
import { useModels } from '../hooks/useModels'

type InputItem = {
  id: string;
  name: string;
};

function toSelectOptions(list: InputItem[] | undefined): SelectOption[] {
  if (list === undefined) return [];
  return list.map(item => ({
    value: item.id,
    label: item.name
  }));
}

export function PartsFilterPanel() {
  const { filters, setMake, setModel, setEngine } = useCarFilters()

  const { data: carmakers } = useCarmakers()
  const { data: models } = useModels(filters.make)
  const { data: engines } = useEngines(filters.model)

  return (
    <div className="flex flex-col gap-10">
      <Select
        value={filters.make ?? ''}
        onChange={(event) => setMake(event.target.value)}
        label="Carmaker"
        placeholder="Select make"
        options={toSelectOptions(carmakers)} />

      <Select
        value={filters.model ?? ''}
        onChange={(event) => setModel(event.target.value)}
        label="Model"
        placeholder="Select model"
        options={toSelectOptions(models)} disabled={!filters.make}
      />

      <Select
        value={filters.engine ?? ''}
        onChange={(event) => setEngine(event.target.value)}
        label="Engine"
        placeholder="Select engine"
        options={toSelectOptions(engines)} disabled={!filters.model}
      />
    </div>
  )
}
