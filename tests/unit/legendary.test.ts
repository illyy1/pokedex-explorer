import { describe, expect, it } from 'vitest'
import { rarityOf } from '../../src/lib/legendary'

describe('rarityOf', () => {
  it('marks legendary and mythical Pokémon, which get sparkly cards', () => {
    expect(rarityOf(150)).toBe('legendary') // Mewtwo
    expect(rarityOf(151)).toBe('mythical') // Mew
    expect(rarityOf(649)).toBe('mythical') // Genesect
  })

  it('leaves ordinary Pokémon alone', () => {
    expect(rarityOf(25)).toBeNull()
    expect(rarityOf(149)).toBeNull() // Dragonite
  })
})
