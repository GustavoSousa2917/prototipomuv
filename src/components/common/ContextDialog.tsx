import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { useAuth } from '../../contexts/authContext'
import { contextLabel } from '../../domain/accountAccess'
import Alert from '../feedback/Alert'
import Button from '../ui/Button'
import ContextChoices from './ContextChoices'

export default function ContextDialog({ trigger, accountMenu = false }: {
  trigger: ReactNode
  accountMenu?: boolean
}) {
  const { user, access, logout } = useAuth()
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [logoutError, setLogoutError] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const pending = useRef(false)
  const title = useRef<HTMLHeadingElement>(null)
  const contexts = access?.contexts ?? []

  useEffect(() => {
    const panel = dialog.current
    if (open && panel && !panel.open) {
      panel.showModal()
      title.current?.focus()
    }
  }, [open])

  function close() {
    dialog.current?.close()
  }

  async function handleLogout() {
    if (pending.current) return
    pending.current = true
    setLogoutError(false)
    setLoggingOut(true)
    const result = await logout()
    pending.current = false
    setLoggingOut(false)
    if (result === 'storageError') setLogoutError(true)
    else if (result === 'loggedOut') close()
  }

  return (
    <>
      <button
        type="button"
        aria-label={accountMenu ? 'Opções da conta' : undefined}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => {
          setLogoutError(false)
          setOpen(true)
        }}
        className={accountMenu
          ? 'grid size-11 shrink-0 place-items-center rounded-muv-button hover:bg-primary-light'
          : 'flex w-full items-center gap-3 rounded-muv-button px-3 py-3 text-left hover:bg-primary-light'}
      >
        {trigger}
      </button>
      <dialog
        ref={dialog}
        id={id}
        aria-labelledby={id + '-title'}
        onClose={() => setOpen(false)}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-muv-panel border border-border bg-surface p-5 text-foreground shadow-muv-lg backdrop:bg-black/40 sm:p-6"
      >
        {open && (
          <div className="min-w-0 space-y-4">
            <h2 ref={title} tabIndex={-1} id={id + '-title'} className="text-muv-h2 font-bold">
              {accountMenu ? 'Conta e contexto' : 'Trocar contexto'}
            </h2>
            <p className="break-words font-semibold">{user?.fullName}</p>
            {access?.activeContext && (
              <p className="break-words text-muted">Contexto ativo: {contextLabel(access.activeContext)}</p>
            )}
            {contexts.length > 1
              ? <ContextChoices contexts={contexts} onCancel={close} onComplete={close} />
              : <Button variant="secondary" onClick={close}>Fechar</Button>}
            {accountMenu && <Button variant="outline" loading={loggingOut} onClick={handleLogout}>Sair da conta</Button>}
            {logoutError && <Alert role="alert" variant="danger">Não foi possível encerrar a sessão. Tente novamente.</Alert>}
          </div>
        )}
      </dialog>
    </>
  )
}
