import {
  useEffect,
  useId,
  useRef,
} from 'react'

import type { ReactNode } from 'react'

import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeDisabled?: boolean
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeDisabled = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog || !open) {
      return
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    if (!dialog.open) {
      dialog.showModal()
    }

    const initialFocus =
      dialog.querySelector<HTMLElement>(
        '[data-modal-initial-focus]',
      )

    initialFocus?.focus()

    return () => {
      if (dialog.open) {
        dialog.close()
      }

      if (previousFocus?.isConnected) {
        previousFocus.focus()
      }
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={
        description ? descriptionId : undefined
      }
      onCancel={(event) => {
        event.preventDefault()

        if (!closeDisabled) {
          onClose()
        }
      }}
      className={`
        fixed inset-0 m-auto
        w-[92vw] max-h-[85dvh]
        overflow-y-auto

        rounded-muv-modal
        border border-border
        bg-surface text-foreground

        p-0 shadow-muv-lg

        backdrop:bg-black/50

        ${sizes[size]}
      `}
    >

      {/* Cabeçalho */}

      <header className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">

        <div className="min-w-0">

          <h2
            id={titleId}
            className="text-muv-h3 font-semibold"
          >
            {title}
          </h2>

          {description && (
            <p
              id={descriptionId}
              className="mt-2 text-muv-body text-muted"
            >
              {description}
            </p>
          )}

        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={closeDisabled}
          aria-label="Fechar janela"
          className="
            flex size-10 shrink-0
            items-center justify-center
            rounded-muv-button text-muted
            transition-colors

            hover:bg-background
            hover:text-foreground

            disabled:opacity-50
          "
        >
          <X
            size={20}
            aria-hidden="true"
          />
        </button>

      </header>

      {/* Conteúdo */}

      {children && (
        <div className="p-5 sm:p-6">
          {children}
        </div>
      )}

      {/* Rodapé */}

      {footer && (
        <footer className="flex flex-wrap justify-end gap-3 border-t border-border p-5 sm:p-6">
          {footer}
        </footer>
      )}

    </dialog>
  )
}