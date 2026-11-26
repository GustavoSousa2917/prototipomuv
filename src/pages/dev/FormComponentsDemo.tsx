import { useState } from 'react'
import type { FormEvent } from 'react'

import { Check, RotateCcw } from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'

const initialValues = {
  name: '',
  modality: '',
  notes: '',
}

export default function FormComponentsDemo() {
  const [values, setValues] = useState(initialValues)

  const [attempted, setAttempted] = useState(false)

  const [message, setMessage] = useState('')

  const nameError =
    attempted && !values.name.trim()
      ? 'O nome é obrigatório.'
      : undefined

  const modalityError =
    attempted && !values.modality
      ? 'Selecione uma modalidade.'
      : undefined

  function updateField(
    field: keyof typeof initialValues,
    value: string,
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }))

    setMessage('')
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setAttempted(true)

    if (!values.name.trim() || !values.modality) {
      setMessage(
        'Revise os campos obrigatórios antes de continuar.',
      )

      return
    }

    setMessage(
      'Formulário validado com sucesso!',
    )
  }

  function handleReset() {
    setValues(initialValues)
    setAttempted(false)
    setMessage('')
  }

  const isSuccess =
    message === 'Formulário validado com sucesso!'

  return (
    <div className="space-y-8">

      <div>
        <p className="font-medium text-primary">
          BIBLIOTECA DE FORMULÁRIOS
        </p>

        <h2 className="mt-2 text-muv-h1 font-bold">
          Componentes de formulário
        </h2>

        <p className="mt-3 text-muted">
          Campos reutilizáveis, validação e acessibilidade.
        </p>
      </div>

      {/* Tipos de campos */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Campos de entrada
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <Input
            label="Nome completo"
            placeholder="Digite seu nome"
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="exemplo@email.com"
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
          />

          <Input
            label="Quantidade de passageiros"
            type="number"
            min={1}
            placeholder="Ex.: 4"
          />

          <Input
            label="Data do frete"
            type="date"
          />

          <Input
            label="Campo desabilitado"
            value="Informação indisponível"
            disabled
          />

          <Input
            label="Campo com erro"
            error="Este campo precisa ser preenchido."
            placeholder="Digite uma informação"
          />

        </div>
      </Card>

      {/* Formulário interativo */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Formulário interativo
        </h2>

        <p className="mt-2 text-muted">
          Demonstração de preenchimento e validação.
        </p>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="mt-6 max-w-2xl space-y-6"
        >

          <Input
            label="Nome completo"
            name="name"
            placeholder="Digite seu nome"
            value={values.name}
            onChange={(event) =>
              updateField('name', event.target.value)
            }
            error={nameError}
            required
          />

          <Select
            label="Modalidade"
            name="modality"
            value={values.modality}
            onChange={(event) =>
              updateField('modality', event.target.value)
            }
            error={modalityError}
            required
          >
            <option value="">
              Selecione uma modalidade
            </option>

            <option value="PESSOA">
              Frete de pessoas
            </option>

            <option value="ENCOMENDA">
              Frete de encomendas
            </option>
          </Select>

          <Textarea
            label="Observações"
            name="notes"
            placeholder="Adicione informações complementares"
            value={values.notes}
            onChange={(event) =>
              updateField('notes', event.target.value)
            }
            helperText={`${values.notes.length}/500 caracteres`}
            maxLength={500}
          />

          <div className="flex flex-wrap gap-3">

            <Button
              type="submit"
              leftIcon={<Check size={18} />}
            >
              Validar formulário
            </Button>

            <Button
              variant="secondary"
              onClick={handleReset}
              leftIcon={<RotateCcw size={18} />}
            >
              Limpar
            </Button>

          </div>

          <div role="status">
            {message && (
              <div
                className={`
                  rounded-muv-card p-4 font-medium
                  ${isSuccess
                    ? 'bg-success-light text-success'
                    : 'bg-danger-light text-danger'
                  }
                `}
              >
                {message}
              </div>
            )}
          </div>

        </form>
      </Card>

    </div>
  )
}