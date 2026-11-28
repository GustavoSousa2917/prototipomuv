import catalog from './municipalities.json'

export const municipalityCatalogEdition = catalog.metadata.edition

const collator = new Intl.Collator('pt-BR')
const entries = catalog.municipalities.map(([code, name, uf]) => ({ code, name, uf }))
const byCode = new Map(entries.map((municipality) => [municipality.code, municipality]))

export const municipalityStates = [...new Set(entries.map(({ uf }) => uf))].sort()

export function findMunicipality(code: string) {
  return byCode.get(code)
}

export function compareMunicipalities(a: { name: string; uf: string }, b: { name: string; uf: string }) {
  return collator.compare(a.name, b.name) || collator.compare(a.uf, b.uf)
}

export function municipalitiesInState(uf: string) {
  return entries.filter((entry) => entry.uf === uf).sort(compareMunicipalities)
}
