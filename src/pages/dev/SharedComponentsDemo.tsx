import { useState } from 'react'

import {
  Plus,
  Truck,
  Search,
  Bell,
  RotateCcw,
} from 'lucide-react'

import Avatar from '../../components/common/Avatar'
import PageHeader from '../../components/common/PageHeader'

import EmptyState from '../../components/feedback/EmptyState'
import Loading from '../../components/feedback/Loading'
import Alert from '../../components/feedback/Alert'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

type ListState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'

export default function SharedComponentsDemo() {
  const [listState, setListState] =
    useState<ListState>('empty')

  const [message, setMessage] =
    useState('')

  return (
    <div className="space-y-8">

      <PageHeader
        eyebrow="Componentes compartilhados"
        title="Identificação e estados de interface"
        description="Padrões reutilizáveis para perfis, cabeçalhos e listagens do MUV."
        headingLevel={2}
      />

      {/* Avatares */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Avatares
        </h2>

        <p className="mt-2 text-muted">
          Identificação visual de usuários e prestadores.
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-6">

          <div className="space-y-2 text-center">
            <Avatar name="Maria Silva" size="sm" />

            <p className="text-muv-small text-muted">
              Pequeno
            </p>
          </div>

          <div className="space-y-2 text-center">
            <Avatar name="João Ferreira" size="md" />

            <p className="text-muv-small text-muted">
              Padrão
            </p>
          </div>

          <div className="space-y-2 text-center">
            <Avatar name="Ana Oliveira" size="lg" />

            <p className="text-muv-small text-muted">
              Grande
            </p>
          </div>

          <div className="space-y-2 text-center">
            <Avatar name="Carlos Santos" size="xl" />

            <p className="text-muv-small text-muted">
              Perfil
            </p>
          </div>

          <div className="space-y-2 text-center">
            <Avatar name="" size="lg" />

            <p className="text-muv-small text-muted">
              Genérico
            </p>
          </div>

        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">

          <div className="flex items-center gap-4 rounded-muv-card border border-border p-4">

            <Avatar name="Maria Silva" size="lg" />

            <div className="min-w-0">
              <p className="font-semibold">
                Maria Silva
              </p>

              <p className="text-muted">
                Cliente
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 rounded-muv-card border border-border p-4">

            <Avatar
              name="Transportadora Sertão"
              size="lg"
            />

            <div className="min-w-0">
              <p className="font-semibold">
                Transportadora Sertão
              </p>

              <p className="text-muted">
                Prestador
              </p>
            </div>

          </div>

        </div>
      </Card>

      {/* Cabeçalhos */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Cabeçalhos de página
        </h2>

        <div className="mt-6 space-y-8">

          <PageHeader
            title="Meus fretes"
            description="Acompanhe seus serviços contratados."
            headingLevel={3}
          />

          <div className="border-t border-border" />

          <PageHeader
            eyebrow="Gestão operacional"
            title="Meus veículos"
            description="Gerencie os veículos vinculados ao seu cadastro."
            headingLevel={3}
            actions={
              <Button
                leftIcon={<Plus size={18} />}
                onClick={() =>
                  setMessage('Cadastro de veículo acionado.')
                }
              >
                Cadastrar veículo
              </Button>
            }
          />

          <div className="border-t border-border" />

          <PageHeader
            title="Prestadores"
            description="Encontre prestadores disponíveis para sua solicitação."
            headingLevel={3}
            actions={
              <>
                <Button
                  variant="secondary"
                  leftIcon={<Search size={18} />}
                  onClick={() =>
                    setMessage('Pesquisa acionada.')
                  }
                >
                  Pesquisar
                </Button>

                <Button
                  onClick={() =>
                    setMessage('Nova solicitação acionada.')
                  }
                >
                  Solicitar frete
                </Button>
              </>
            }
          />

          <div role="status">
            {message && (
              <Alert variant="info">
                {message}
              </Alert>
            )}
          </div>

        </div>
      </Card>

      {/* Estados vazios */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Estados vazios
        </h2>

        <p className="mt-2 text-muted">
          Apresentação de páginas que ainda não possuem registros.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">

          <Card>
            <EmptyState
              icon={<Truck size={30} />}
              title="Nenhum frete contratado"
              description="Seus fretes serão apresentados aqui após a contratação."
              action={
                <Button
                  onClick={() =>
                    setListState('success')
                  }
                >
                  Exibir dados de exemplo
                </Button>
              }
            />
          </Card>

          <Card>
            <EmptyState
              icon={<Bell size={30} />}
              title="Nenhuma notificação"
              description="Você está em dia com suas notificações."
            />
          </Card>

        </div>
      </Card>

      {/* Estados de carregamento */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Indicadores de carregamento
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <Card padding="sm">
            <Loading
              size="sm"
              inline
              message="Atualizando..."
            />
          </Card>

          <Card padding="sm">
            <Loading
              size="md"
              message="Carregando..."
            />
          </Card>

          <Card padding="sm">
            <Loading
              size="lg"
              message="Consultando fretes..."
            />
          </Card>

        </div>
      </Card>

      {/* Demonstração de listagem */}

      <Card>
        <h2 className="text-muv-h2 font-semibold">
          Estados de uma listagem
        </h2>

        <p className="mt-2 text-muted">
          Alterne entre os possíveis resultados
          de uma consulta ao sistema.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <Button
            variant={listState === 'loading' ? 'primary' : 'secondary'}
            aria-pressed={listState === 'loading'}
            onClick={() => setListState('loading')}
          >
            Carregando
          </Button>

          <Button
            variant={listState === 'empty' ? 'primary' : 'secondary'}
            aria-pressed={listState === 'empty'}
            onClick={() => setListState('empty')}
          >
            Sem registros
          </Button>

          <Button
            variant={listState === 'error' ? 'primary' : 'secondary'}
            aria-pressed={listState === 'error'}
            onClick={() => setListState('error')}
          >
            Erro
          </Button>

          <Button
            variant={listState === 'success' ? 'primary' : 'secondary'}
            aria-pressed={listState === 'success'}
            onClick={() => setListState('success')}
          >
            Com registros
          </Button>

        </div>

        <div className="mt-6 rounded-muv-card border border-border bg-background p-4">

          {listState === 'loading' && (
            <Loading
              message="Carregando seus fretes..."
              size="lg"
            />
          )}

          {listState === 'empty' && (
            <EmptyState
              icon={<Truck size={30} />}
              title="Nenhum frete encontrado"
              description="Não existem fretes disponíveis nesta consulta."
            />
          )}

          {listState === 'error' && (
            <div className="space-y-4">

              <Alert
                variant="danger"
                title="Não foi possível carregar os fretes"
                role="alert"
              >
                Ocorreu uma falha simulada durante a consulta.
              </Alert>

              <Button
                variant="outline"
                leftIcon={<RotateCcw size={18} />}
                onClick={() => setListState('success')}
              >
                Tentar novamente
              </Button>

            </div>
          )}

          {listState === 'success' && (
            <Card padding="sm">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <p className="font-semibold">
                  Frete #MUV-00125
                </p>

                <Badge variant="info">
                  Pronto para início
                </Badge>

              </div>

              <p className="mt-4 font-medium">
                Quixadá - CE → Fortaleza - CE
              </p>

              <p className="mt-2 text-muted">
                Frete de pessoas — 12 passageiros
              </p>

              <p className="mt-4 font-semibold text-primary">
                R$ 650,00
              </p>

              <p className="mt-2 text-muv-small text-muted">
                Registro fictício para demonstração.
              </p>

            </Card>
          )}

        </div>
      </Card>

    </div>
  )
}