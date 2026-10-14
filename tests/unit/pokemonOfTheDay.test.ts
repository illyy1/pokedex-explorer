import { describe, expect, it } from 'vitest'
import { LAST_POKEMON } from '../../src/lib/api'
import { pokemonOfTheDay } from '../../src/lib/pokemonOfTheDay'

describe('pokemonOfTheDay', () => {
  it('is the same Pokémon all day long', () => {
    const morning = pokemonOfTheDay(new Date(2026, 9, 14, 0, 0, 1))
    const night = pokemonOfTheDay(new Date(2026, 9, 14, 23, 59, 59))
    expect(night).toBe(morning)
  })

  it('changes at midnight', () => {
    const today = pokemonOfTheDay(new Date(2026, 9, 14, 23, 59, 59))
    const tomorrow = pokemonOfTheDay(new Date(2026, 9, 15, 0, 0, 1))
    expect(tomorrow).not.toBe(today)
  })

  it('shows every Pokémon once before any of them comes back', () => {
    const seen = new Set<number>()
    for (let day = 0; day < LAST_POKEMON; day++) {
      const id = pokemonOfTheDay(new Date(2026, 0, 1 + day))
      expect(id).toBeGreaterThanOrEqual(1)
      expect(id).toBeLessThanOrEqual(LAST_POKEMON)
      seen.add(id)
    }
    expect(seen.size).toBe(LAST_POKEMON)
  })
})
