import { cnhCategories } from '../../domain/driverProfessional'
import type { DriverProfessionalErrors, DriverProfessionalInput } from '../../domain/driverProfessional'
import Input from '../ui/Input'
import RadioGroup from '../ui/RadioGroup'
import Select from '../ui/Select'

const earOptions = [{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }]

type Props = {
  draft: DriverProfessionalInput
  errors: DriverProfessionalErrors
  processing: boolean
  change: <Key extends keyof DriverProfessionalInput>(field: Key, value: DriverProfessionalInput[Key]) => void
}

export default function DriverProfessionalFields({ draft, errors, processing, change }: Props) {
  return <>
    <Input label="Número da CNH" name="cnhNumber" inputMode="numeric" required readOnly={processing}
      value={draft.cnhNumber} error={errors.cnhNumber} onChange={(event) => change('cnhNumber', event.target.value)} />
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <Select label="Categoria" name="cnhCategory" required disabled={processing} value={draft.cnhCategory}
        error={errors.cnhCategory} onChange={(event) => change('cnhCategory', event.target.value)}>
        <option value="">Selecione</option>
        {cnhCategories.map((category) => <option key={category}>{category}</option>)}
      </Select>
      <Input label="Data de validade" name="cnhExpiresAt" type="date" required readOnly={processing}
        value={draft.cnhExpiresAt} error={errors.cnhExpiresAt} onChange={(event) => change('cnhExpiresAt', event.target.value)} />
    </div>
    <RadioGroup label="Possui EAR?" name="hasEar" options={earOptions} required disabled={processing}
      value={draft.hasEar === null ? '' : draft.hasEar ? 'yes' : 'no'} error={errors.hasEar}
      onChange={(value) => change('hasEar', value === 'yes')} />
    <p className="text-muted">A declaração de atividade remunerada é informada pelo titular.</p>
  </>
}
