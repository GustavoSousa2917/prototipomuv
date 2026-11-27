const lockName = 'muv.auth.mutation'
let pending: Promise<unknown> = Promise.resolve()

export function withAuthMutation<Result>(operation: () => Promise<Result>) {
  if (navigator.locks) return navigator.locks.request(lockName, operation)

  const next = pending.then(operation)
  pending = next.catch(() => undefined)
  return next
}
