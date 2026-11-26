import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, RotateCcw } from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Checkbox from '../../components/ui/Checkbox'
import RadioGroup from '../../components/ui/RadioGroup'

const modalities = [
  { value: 'PESSOA', label: 'Frete de pessoas', description: 'Transporte de passageiros entre localidades.' },
  { value: 'ENCOMENDA', label: 'Frete de encomendas', description: 'Coleta e entrega de volumes e mercadorias.' },
]

const requestTypes = [
  { value: 'DIRECIONADA', label: 'Solicitação direcionada', description: 'Enviar a solicitação para um prestador específico.' },
  { value: 'ABERTA', label: 'Solicitação aberta', description: 'Receber propostas de diferentes prestadores elegíveis.' },
]

export default function SelectionComponentsDemo() {
  const [vehicleModalities, setVehicleModalities] = useState<string[]>([])
  const [requestModality, setRequestModality] = useState('')
  const [requestType, setRequestType] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [message, setMessage] = useState('')

  const vehicleError = attempted && vehicleModalities.length === 0
  const modalityError = attempted && !requestModality ? 'Selecione uma modalidade.' : undefined
  const requestTypeError = attempted && !requestType ? 'Selecione o tipo de solicitação.' : undefined

  function toggleVehicleModality(modality: string) {
    setVehicleModalities((previous) => previous.includes(modality)
      ? previous.filter((item) => item !== modality)
      : [...previous, modality])
    setMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttempted(true)
    if (vehicleModalities.length === 0 || !requestModality || !requestType) {
      setMessage('Revise as seleções obrigatórias.')
      return
    }
    setMessage('Todas as seleções foram validadas!')
  }

  function handleReset() {
    setVehicleModalities([])
    setRequestModality('')
    setRequestType('')
    setAttempted(false)
    setMessage('')
  }

  const isSuccess = message === 'Todas as seleções foram validadas!'

  return (
    <div className="space-y-8">
      <div>
        <p className="font-medium text-primary">CONTROLES DE SELEÇÃO</p>
        <h2 className="mt-2 text-muv-h1 font-bold">Checkbox e RadioGroup</h2>
        <p className="mt-3 text-muted">Demonstração de seleções múltiplas e exclusivas.</p>
      </div>
      <Card>
        <h2 className="text-muv-h2 font-semibold">Estados do Checkbox</h2>
        <div className="mt-6 space-y-5">
          <Checkbox label="Opção disponível" />
          <Checkbox label="Opção selecionada" defaultChecked />
          <Checkbox label="Opção desabilitada" disabled />
          <Checkbox label="Opção selecionada e desabilitada" defaultChecked disabled />
          <Checkbox label="Aceite dos termos de uso" required error="Exemplo de mensagem de validação." />
        </div>
      </Card>
      <Card>
        <h2 className="text-muv-h2 font-semibold">Seleções interativas</h2>
        <p className="mt-2 text-muted">Exemplos independentes de seleções utilizadas nos módulos do MUV.</p>
        <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-8">
          <fieldset className="min-w-0 space-y-4" aria-describedby={vehicleError ? 'demo-vehicle-modalities-error' : undefined}>
            <legend className="font-semibold">
              Modalidades atendidas pelo veículo
              <span aria-hidden="true" className="ml-1 text-danger">*</span>
            </legend>
            <p className="text-muted">Selecione pelo menos uma modalidade. Um veículo pode atender às duas.</p>
            {modalities.map((modality) => (
              <Checkbox
                key={modality.value}
                name="vehicleModalities"
                value={modality.value}
                label={modality.label}
                description={modality.description}
                checked={vehicleModalities.includes(modality.value)}
                aria-invalid={vehicleError || undefined}
                aria-describedby={vehicleError ? 'demo-vehicle-modalities-error' : undefined}
                onChange={() => toggleVehicleModality(modality.value)}
              />
            ))}
            {vehicleError && (
              <p id="demo-vehicle-modalities-error" className="text-muv-small font-medium text-danger">
                Selecione pelo menos uma modalidade.
              </p>
            )}
          </fieldset>
          <div className="border-t border-border" />
          <RadioGroup
            name="requestModality"
            label="Modalidade da solicitação"
            options={modalities}
            value={requestModality}
            onChange={(value) => { setRequestModality(value); setMessage('') }}
            helperText="Cada solicitação possui apenas uma modalidade."
            error={modalityError}
            required
          />
          <div className="border-t border-border" />
          <RadioGroup
            name="requestType"
            label="Tipo de solicitação"
            options={requestTypes}
            value={requestType}
            onChange={(value) => { setRequestType(value); setMessage('') }}
            variant="card"
            orientation="horizontal"
            error={requestTypeError}
            required
          />
          <div className="space-y-2 rounded-muv-card bg-background p-4">
            <h3 className="font-semibold">Resumo das seleções</h3>
            <p className="text-muted">
              Modalidades do veículo:{' '}
              {vehicleModalities.length > 0
                ? modalities.filter((item) => vehicleModalities.includes(item.value)).map((item) => item.label).join(' e ')
                : 'Nenhuma selecionada'}
            </p>
            <p className="text-muted">
              Modalidade da solicitação:{' '}
              {modalities.find((item) => item.value === requestModality)?.label ?? 'Não selecionada'}
            </p>
            <p className="text-muted">
              Tipo de solicitação:{' '}
              {requestTypes.find((item) => item.value === requestType)?.label ?? 'Não selecionado'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" leftIcon={<Check size={18} />}>Validar seleções</Button>
            <Button variant="secondary" onClick={handleReset} leftIcon={<RotateCcw size={18} />}>Limpar seleções</Button>
          </div>
          <div role="status">
            {message && (
              <div className={`rounded-muv-card p-4 font-medium ${isSuccess ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
