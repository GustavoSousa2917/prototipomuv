import { authorizationDate } from './authorizationPresentation'
import Badge from '../ui/Badge'
import { authorizationStatus, authorizationStatuses } from '../../domain/providerAuthorization'
import type { AuthorizationAttempt, AuthorizationStatus, Submission } from '../../domain/providerAuthorization'

const badgeVariants = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger', NOT_REQUESTED: 'neutral' } as const

export function AuthorizationBadge({ status }: { status: AuthorizationStatus | 'NOT_REQUESTED' }) {
  return <Badge variant={badgeVariants[status]}>{status === 'NOT_REQUESTED' ? 'Não solicitada' : authorizationStatuses[status]}</Badge>
}

export function SubmissionDetails({ submission }: { submission: Submission }) {
  return <div className="space-y-3">
    <dl className="grid gap-3 sm:grid-cols-2">
      {Object.entries(submission.fields).map(([label, value]) => (
        <div key={label}><dt className="text-muted">{label}</dt><dd>{value || 'Não informado'}</dd></div>
      ))}
      <div><dt className="text-muted">Modalidade pretendida</dt><dd>{submission.intended ? 'Sim' : 'Não'}</dd></div>
    </dl>
    <div>
      <p className="font-semibold">Regiões de atendimento</p>
      {submission.regions.length ? <ul className="list-disc pl-5">
        {submission.regions.map(({ code, name, uf }) => <li key={code}>{name} · {uf} ({code})</li>)}
      </ul> : <p>Sem municípios</p>}
      <p className="text-muted">Catálogo {submission.catalogEdition}</p>
    </div>
  </div>
}

export function AttemptDecision({ attempt }: { attempt: AuthorizationAttempt }) {
  const { decision } = attempt
  if (!decision) return null
  return <div className="space-y-2">
    <p>Decisão em {authorizationDate(decision.decidedAt)} por {decision.administrator.name}.</p>
    {decision.status === 'REJECTED' && <div><p className="font-semibold">Justificativa</p><p>{decision.reason}</p></div>}
    {decision.status === 'APPROVED' && decision.reviewedSubmission && <details>
      <summary className="cursor-pointer font-semibold text-primary">Dados considerados na ciência das diferenças</summary>
      <div className="pt-3"><SubmissionDetails submission={decision.reviewedSubmission} /></div>
    </details>}
  </div>
}

export function AuthorizationHistory({ history }: { history: AuthorizationAttempt[] }) {
  if (!history.length) return <p className="text-muted">Nenhuma tentativa registrada.</p>
  return <ol className="divide-y divide-border">
    {history.map((attempt) => <li key={attempt.id} className="py-3">
      <details>
        <summary className="cursor-pointer py-1">
          <span className="mr-2 font-semibold">Tentativa {attempt.sequence} · {authorizationDate(attempt.requestedAt)}</span>
          <AuthorizationBadge status={authorizationStatus(attempt)} />
        </summary>
        <div className="space-y-3 pt-3">
          <p className="text-muted">Identificação {attempt.id}</p>
          <p>Solicitada por {attempt.requester.name}.</p>
          <AttemptDecision attempt={attempt} />
          <p className="font-semibold">Dados submetidos</p>
          <SubmissionDetails submission={attempt.submission} />
        </div>
      </details>
    </li>)}
  </ol>
}
