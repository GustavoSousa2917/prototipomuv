export const accessAssignmentStorageKey = 'muv.accessAssignments.v1'

export function readAccessAssignments(): unknown {
  try {
    return JSON.parse(localStorage.getItem(accessAssignmentStorageKey) ?? '[]') as unknown
  } catch {
    return null
  }
}
