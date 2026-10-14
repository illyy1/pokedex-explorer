import type { TypeData } from './api'
import { ALL_TYPES } from './pokemonTypes'
import type { Matchups } from './types'

// Works out how much damage each attacking type does to a Pokémon.
// For a Pokémon with two types the values multiply: Rock does ×2 to Fire
// and ×2 to Flying, so it does ×4 to Charizard (Fire/Flying).
export function typeMatchups(defendingTypes: TypeData[]): Matchups {
  const all = ALL_TYPES.map((attacking) => {
    let multiplier = 1
    for (const defending of defendingTypes) {
      if (defending.noDamageFrom.includes(attacking)) multiplier *= 0
      else if (defending.doubleDamageFrom.includes(attacking)) multiplier *= 2
      else if (defending.halfDamageFrom.includes(attacking)) multiplier *= 0.5
    }
    return { type: attacking, multiplier }
  })

  return {
    weak: all.filter((m) => m.multiplier > 1).sort((a, b) => b.multiplier - a.multiplier),
    resist: all
      .filter((m) => m.multiplier > 0 && m.multiplier < 1)
      .sort((a, b) => a.multiplier - b.multiplier),
    immune: all.filter((m) => m.multiplier === 0).map((m) => m.type),
  }
}

const MULTIPLIER_LABELS: Record<number, string> = { 4: '×4', 2: '×2', 0.5: '×½', 0.25: '×¼' }

export function formatMultiplier(multiplier: number): string {
  return MULTIPLIER_LABELS[multiplier] ?? `×${multiplier}`
}
