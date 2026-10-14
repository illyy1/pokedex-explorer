import { describe, expect, it } from 'vitest'
import type { TypeData } from '../../src/lib/api'
import { formatMultiplier, typeMatchups } from '../../src/lib/matchups'

// The real Generation 5 damage relations of the types used below.
const FIRE: TypeData = {
  name: 'fire',
  pokemonIds: [],
  doubleDamageFrom: ['water', 'ground', 'rock'],
  halfDamageFrom: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
  noDamageFrom: [],
}
const FLYING: TypeData = {
  name: 'flying',
  pokemonIds: [],
  doubleDamageFrom: ['electric', 'ice', 'rock'],
  halfDamageFrom: ['grass', 'fighting', 'bug'],
  noDamageFrom: ['ground'],
}
const NORMAL: TypeData = {
  name: 'normal',
  pokemonIds: [],
  doubleDamageFrom: ['fighting'],
  halfDamageFrom: [],
  noDamageFrom: ['ghost'],
}

describe('typeMatchups', () => {
  it('works out the matchups of a Pokémon with one type', () => {
    expect(typeMatchups([NORMAL])).toEqual({
      weak: [{ type: 'fighting', multiplier: 2 }],
      resist: [],
      immune: ['ghost'],
    })
  })

  it('multiplies the two types of a dual-type Pokémon', () => {
    // Charizard is Fire/Flying.
    const { weak, resist, immune } = typeMatchups([FIRE, FLYING])
    expect(weak).toContainEqual({ type: 'rock', multiplier: 4 })
    expect(weak).toContainEqual({ type: 'water', multiplier: 2 })
    expect(weak).toContainEqual({ type: 'electric', multiplier: 2 })
    expect(resist).toContainEqual({ type: 'grass', multiplier: 0.25 })
    expect(resist).toContainEqual({ type: 'bug', multiplier: 0.25 })
    expect(resist).toContainEqual({ type: 'fighting', multiplier: 0.5 })
    expect(immune).toEqual(['ground'])
  })

  it('leaves out types that cancel each other out', () => {
    // Ice does ×½ to Fire and ×2 to Flying, so ×1 to Charizard.
    const { weak, resist, immune } = typeMatchups([FIRE, FLYING])
    const all = [...weak, ...resist].map((m) => m.type).concat(immune)
    expect(all).not.toContain('ice')
  })

  it('counts an immunity even when the other type is weak to it', () => {
    // Fire is weak to Ground, but Flying is immune, so Charizard takes nothing.
    const { weak, immune } = typeMatchups([FIRE, FLYING])
    expect(immune).toContain('ground')
    expect(weak.map((m) => m.type)).not.toContain('ground')
  })

  it('lists the biggest weaknesses and the strongest resistances first', () => {
    const { weak, resist } = typeMatchups([FIRE, FLYING])
    expect(weak[0]).toEqual({ type: 'rock', multiplier: 4 })
    expect(resist.slice(0, 2).map((m) => m.multiplier)).toEqual([0.25, 0.25])
  })

  it('has no weaknesses or resistances without any types', () => {
    expect(typeMatchups([])).toEqual({ weak: [], resist: [], immune: [] })
  })
})

describe('formatMultiplier', () => {
  it('writes multipliers the way the card shows them', () => {
    expect(formatMultiplier(4)).toBe('×4')
    expect(formatMultiplier(2)).toBe('×2')
    expect(formatMultiplier(0.5)).toBe('×½')
    expect(formatMultiplier(0.25)).toBe('×¼')
  })

  it('falls back to the plain number for anything else', () => {
    expect(formatMultiplier(8)).toBe('×8')
  })
})
