import {
  useEffect,
  useState,
} from 'react'

import {
  Eye,
  Check,
  X,
} from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

import Alert from '../../components/feedback/Alert'
import Modal from '../../components/feedback/Modal'
import ConfirmDialog from '../../components/feedback/ConfirmDialog'

type DemoAction = 'contract' | 'cancel'

export default function FeedbackComponentsDemo() {
  const [modalOpen, setModalOpen] =
    useState(false)

  const [action, setAction] =
    useState<DemoAction | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [result, setResult] =
    useState('')

  useEffect(() => {
    if (!loading || !action) {
      return
    }

    const timeout = window.setTimeout(() => {
      setResult(
        action === 'contract'
          ? 'Contratação simulada com sucesso!'
          : 'Cancelamento simulado com sucesso!',
      )

      setLoading(false)
      setAction(null)
    }, 2000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [loading, action])

  function openConfirmation(
    selectedAction: DemoAction,
  ) {
    setResult('')
    setAction(selectedAction)
  }

  function closeConfirmation() {
    if (loading) {
      return
    }

    setAction(null)
    setResult('Operação não realizada.')
  }

  const isCancellation = action === 'cancel'

  return (
    <div className="space-y-8">

      {/* Apresentação */}

      <div>

        <p className="font-medium text-primary">
          COMPONENTES DE FEEDBACK
        </p>

        <h2 className="mt-2 text-muv-h1 font-bold">
          Alertas e confirmações
        </h2>

        <p className="mt-3 text-muted">
          Mensagens, janelas de interação
          e confirmações de operações.
        </p>

      </div>

      {/* Alertas */}

      <Card>

        <h2 className="text-muv-h2 font-semibold">
          Alertas
        </h2>

        <p className="mt-2 text-muted">
          Comunicação visual de informações
          e resultados.
        </p>

        <div className="mt-6 space-y-4">

          <Alert
            variant="success"
            title="Operação realizada"
          >
            O veículo foi cadastrado
            com sucesso.
          </Alert>

          <Alert
            variant="warning"
            title="Autorização pendente"
          >
            Aguarde a análise da modalidade
            solicitada.
          </Alert>

          <Alert
            variant="danger"
            title="Operação indisponível"
          >
            O veículo selecionado não possui
            capacidade suficiente.
          </Alert>

          <Alert
            variant="info"
            title="Solicitação enviada"
          >
            O prestador receberá a solicitação
            para análise.
          </Alert>

        </div>

      </Card>

      {/* Modal */}

      <Card>

        <h2 className="text-muv-h2 font-semibold">
          Modal
        </h2>

        <p className="mt-2 text-muted">
          Janela reutilizável para informações
          e formulários.
        </p>

        <div className="mt-6">

          <Button
            leftIcon={<Eye size={18} />}
            onClick={() => setModalOpen(true)}
          >
            Visualizar frete
          </Button>

        </div>

      </Card>

      {/* Confirmações */}

      <Card>

        <h2 className="text-muv-h2 font-semibold">
          Confirmações de operações
        </h2>

        <p className="mt-2 text-muted">
          Demonstração de ações que exigem
          confirmação explícita.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <Button
            leftIcon={<Check size={18} />}
            onClick={() =>
              openConfirmation('contract')
            }
          >
            Confirmar contratação
          </Button>

          <Button
            variant="danger"
            leftIcon={<X size={18} />}
            onClick={() =>
              openConfirmation('cancel')
            }
          >
            Cancelar frete
          </Button>

        </div>

        <div
          role="status"
          className="mt-6"
        >
          {result && (
            <Alert
              variant={
                result === 'Operação não realizada.'
                  ? 'info'
                  : 'success'
              }
            >
              {result}
            </Alert>
          )}
        </div>

      </Card>

      {/* Modal de demonstração */}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalhes do frete"
        description="Informações demonstrativas do serviço."
        size="md"

        footer={
          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
            data-modal-initial-focus
          >
            Fechar
          </Button>
        }
      >

        <div className="space-y-5">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <span className="font-semibold">
              Frete #MUV-00125
            </span>

            <Badge variant="info">
              Pronto para início
            </Badge>

          </div>

          <dl className="grid gap-4 sm:grid-cols-2">

            <div>
              <dt className="text-muted">
                Origem
              </dt>

              <dd className="mt-1 font-medium">
                Quixadá - CE
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Destino
              </dt>

              <dd className="mt-1 font-medium">
                Fortaleza - CE
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Modalidade
              </dt>

              <dd className="mt-1 font-medium">
                Frete de pessoas
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Passageiros
              </dt>

              <dd className="mt-1 font-medium">
                12 pessoas
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Categoria do veículo
              </dt>

              <dd className="mt-1 font-medium">
                Van
              </dd>
            </div>

            <div>
              <dt className="text-muted">
                Valor contratado
              </dt>

              <dd className="mt-1 font-semibold text-primary">
                R$ 650,00
              </dd>
            </div>

          </dl>

          <Alert variant="info">
            Este registro utiliza dados fictícios
            para demonstração do Design System.
          </Alert>

        </div>

      </Modal>

      {/* Confirmação de demonstração */}

      <ConfirmDialog
        open={action !== null}
        onClose={closeConfirmation}
        onConfirm={() => setLoading(true)}

        title={
          isCancellation
            ? 'Cancelar frete?'
            : 'Confirmar contratação?'
        }

        description={
          isCancellation
            ? 'Deseja prosseguir com a simulação de cancelamento deste frete?'
            : 'Deseja confirmar a contratação pelo valor de R$ 650,00?'
        }

        confirmLabel={
          isCancellation
            ? 'Confirmar cancelamento'
            : 'Confirmar contratação'
        }

        cancelLabel="Voltar"

        variant={
          isCancellation
            ? 'danger'
            : 'primary'
        }

        loading={loading}
      />

    </div>
  )
}