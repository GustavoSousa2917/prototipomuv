import {
  CircleAlert,
  CircleCheck,
} from 'lucide-react'

import Button from '../ui/Button'
import Modal from './Modal'

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void

  title: string
  description: string

  confirmLabel?: string
  cancelLabel?: string

  variant?: 'primary' | 'danger'
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Voltar',
  variant = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger'

  const Icon = isDanger
    ? CircleAlert
    : CircleCheck

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      closeDisabled={loading}

      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            data-modal-initial-focus
          >
            {cancelLabel}
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {loading
              ? 'Processando...'
              : confirmLabel
            }
          </Button>
        </>
      }
    >

      <div className="flex justify-center">

        <div
          className={`
            flex size-16
            items-center justify-center
            rounded-full

            ${isDanger
              ? 'bg-danger-light text-danger'
              : 'bg-success-light text-success'
            }
          `}
        >
          <Icon
            size={32}
            aria-hidden="true"
          />
        </div>

      </div>

    </Modal>
  )
}