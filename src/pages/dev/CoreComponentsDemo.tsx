import { useState } from 'react'

import {
  ArrowRight,
  Check,
  Plus,
  Truck,
  X,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

export default function CoreComponentsDemo() {
  const [message, setMessage] = useState(
    'Nenhuma ação executada.',
  )

  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-8">

      <div>
        <p className="font-medium text-primary">
          BIBLIOTECA DE COMPONENTES
        </p>

        <h2 className="mt-2 text-muv-h1 font-bold">
          Componentes reutilizáveis
        </h2>

        <p className="mt-3 text-muted">
          Elementos compartilhados pelas interfaces do MUV.
        </p>
      </div>

      {/* Logotipo */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Logotipo
        </h2>

        <p className="mt-2 text-muted">
          Variações da identidade visual.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="flex min-h-28 flex-col items-center justify-center gap-4 rounded-muv-card border border-border p-4">
            <Logo size="sm" />

            <span className="text-muv-small text-muted">
              Pequeno
            </span>
          </div>

          <div className="flex min-h-28 flex-col items-center justify-center gap-4 rounded-muv-card border border-border p-4">
            <Logo />

            <span className="text-muv-small text-muted">
              Padrão
            </span>
          </div>

          <div className="flex min-h-28 flex-col items-center justify-center gap-4 rounded-muv-card border border-border p-4">
            <Logo variant="symbol" size="lg" />

            <span className="text-muv-small text-muted">
              Símbolo
            </span>
          </div>

          <div className="flex min-h-28 flex-col items-center justify-center gap-4 rounded-muv-card bg-primary p-4">
            <Logo variant="inverse" />

            <span className="text-muv-small text-white">
              Invertido
            </span>
          </div>

        </div>
      </Card>

      {/* Botões */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Botões
        </h2>

        <p className="mt-2 text-muted">
          Variantes, tamanhos e estados de interação.
        </p>

        <h3 className="mt-6 font-semibold">
          Variantes
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <Button
            onClick={() => setMessage('Botão principal acionado.')}
          >
            Principal
          </Button>

          <Button
            variant="secondary"
            onClick={() => setMessage('Botão secundário acionado.')}
          >
            Secundário
          </Button>

          <Button
            variant="outline"
            onClick={() => setMessage('Botão outline acionado.')}
          >
            Outline
          </Button>

          <Button
            variant="ghost"
            onClick={() => setMessage('Botão ghost acionado.')}
          >
            Ghost
          </Button>

          <Button
            variant="danger"
            onClick={() => setMessage('Ação de perigo demonstrada.')}
          >
            Perigo
          </Button>

        </div>

        <h3 className="mt-8 font-semibold">
          Tamanhos
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-3">

          <Button size="sm">
            Pequeno
          </Button>

          <Button size="md">
            Padrão
          </Button>

          <Button size="lg">
            Grande
          </Button>

        </div>

        <h3 className="mt-8 font-semibold">
          Botões com ícones
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <Button leftIcon={<Plus size={18} />}>
            Cadastrar veículo
          </Button>

          <Button rightIcon={<ArrowRight size={18} />}>
            Continuar
          </Button>

          <Button
            variant="danger"
            leftIcon={<X size={18} />}
          >
            Cancelar frete
          </Button>

        </div>

        <h3 className="mt-8 font-semibold">
          Estados
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <Button disabled>
            Desabilitado
          </Button>

          <Button loading={loading}>
            {loading ? 'Processando...' : 'Pronto'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setLoading((previous) => !previous)}
          >
            {loading
              ? 'Finalizar processamento'
              : 'Simular processamento'}
          </Button>

        </div>

        <div className="mt-6 max-w-sm">
          <Button fullWidth>
            Botão de largura total
          </Button>
        </div>

        <div
          role="status"
          className="mt-6 rounded-muv-card bg-background p-4 text-muted"
        >
          Resultado: {message}
        </div>

      </Card>

      {/* Cards */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Cards
        </h2>

        <p className="mt-2 text-muted">
          Superfícies reutilizáveis para organizar informações.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <Card padding="sm">
            <div className="flex items-center justify-between">
              <p className="text-muted">
                Fretes contratados
              </p>

              <Truck
                size={20}
                className="text-primary"
              />
            </div>

            <p className="mt-4 text-muv-h1 font-bold">
              12
            </p>

            <p className="mt-2 text-muv-small text-primary">
              Serviços ativos
            </p>
          </Card>

          <Card elevated>
            <div className="flex items-center justify-between">
              <p className="text-muted">
                Fretes concluídos
              </p>

              <Check
                size={20}
                className="text-primary"
              />
            </div>

            <p className="mt-4 text-muv-h1 font-bold">
              48
            </p>

            <p className="mt-2 text-muv-small text-primary">
              Serviços finalizados
            </p>
          </Card>

        </div>
      </Card>

      {/* Badges */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Indicadores de situação
        </h2>

        <p className="mt-2 text-muted">
          Exemplos dos estados operacionais do MUV.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <Badge variant="warning">
            Aguardando designação
          </Badge>

          <Badge variant="info">
            Pronto para início
          </Badge>

          <Badge variant="info">
            Em execução
          </Badge>

          <Badge variant="warning">
            Interrompido
          </Badge>

          <Badge variant="success">
            Concluído
          </Badge>

          <Badge variant="danger">
            Cancelado
          </Badge>

          <Badge variant="neutral">
            Encerrado sem conclusão
          </Badge>

        </div>
      </Card>

    </div>
  )
}