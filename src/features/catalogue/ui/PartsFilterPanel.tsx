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
    <div className="grid gap-6 md:grid-cols-3 xl:flex xl:flex-col xl:gap-10">
      <Select
        value={filters.make ?? ''}
        onChange={setMake}
        label="Carmaker"
        placeholder="Select make"
        options={toSelectOptions(carmakers)} />

      <Select
        value={filters.model ?? ''}
        onChange={setModel}
        label="Model"
        placeholder="Select model"
        options={toSelectOptions(models)} disabled={!filters.make}
      />

      <Select
        value={filters.engine ?? ''}
        onChange={setEngine}
        label="Engine"
        placeholder="Select engine"
        options={toSelectOptions(engines)} disabled={!filters.model}
      />
    </div>
  )
}
