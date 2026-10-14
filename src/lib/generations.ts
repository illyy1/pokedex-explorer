// The generation each Pokémon was introduced in, worked out from its
// Pokédex number: every generation's new Pokémon come right after the last
// one's, so no extra request is needed.

export type Generation = {
  number: number
  // The region of the games that introduced it.
  region: string
}

// A generation with the first and last Pokédex numbers it introduced.
export type GenerationRange = Generation & { first: number; last: number }

export const GENERATIONS: GenerationRange[] = [
  { number: 1, region: 'Kanto', first: 1, last: 151 },
  { number: 2, region: 'Johto', first: 152, last: 251 },
  { number: 3, region: 'Hoenn', first: 252, last: 386 },
  { number: 4, region: 'Sinnoh', first: 387, last: 493 },
  { number: 5, region: 'Unova', first: 494, last: 649 },
]

export function generationOf(id: number): Generation | null {
  if (!Number.isInteger(id) || id < 1) return null
  const generation = GENERATIONS.find((g) => id <= g.last)
  return generation ? { number: generation.number, region: generation.region } : null
}

// The generation for a value from the address ("?gen=1"), or null for
// anything that isn't one.
export function generationFromParam(value: string | null): GenerationRange | null {
  return GENERATIONS.find((g) => String(g.number) === value) ?? null
}
