import { describe, expect, it } from 'vitest'
import { LAST_POKEMON } from '../../src/lib/api'
import { GENERATIONS, generationFromParam, generationOf } from '../../src/lib/generations'

describe('generationOf', () => {
  it('finds the generation and region that introduced a Pokémon', () => {
    expect(generationOf(25)).toEqual({ number: 1, region: 'Kanto' })
    expect(generationOf(249)).toEqual({ number: 2, region: 'Johto' })
    expect(generationOf(384)).toEqual({ number: 3, region: 'Hoenn' })
    expect(generationOf(448)).toEqual({ number: 4, region: 'Sinnoh' })
    expect(generationOf(635)).toEqual({ number: 5, region: 'Unova' })
  })

  it('puts the first and last Pokémon of each generation in the right one', () => {
    const edges: [number, number][] = [
      [1, 1], [151, 1],
      [152, 2], [251, 2],
      [252, 3], [386, 3],
      [387, 4], [493, 4],
      [494, 5], [649, 5],
    ]
    for (const [id, generation] of edges) expect(generationOf(id)?.number).toBe(generation)
  })

  it('knows every Pokémon in the Pokédex', () => {
    for (let id = 1; id <= LAST_POKEMON; id++) expect(generationOf(id)).not.toBeNull()
  })

  it('has no generation for numbers outside the Pokédex', () => {
    expect(generationOf(0)).toBeNull()
    expect(generationOf(650)).toBeNull()
    expect(generationOf(2.5)).toBeNull()
  })
})

describe('GENERATIONS', () => {
  it('covers the whole Pokédex, each generation starting right after the last', () => {
    expect(GENERATIONS[0].first).toBe(1)
    for (let i = 1; i < GENERATIONS.length; i++) {
      expect(GENERATIONS[i].first).toBe(GENERATIONS[i - 1].last + 1)
    }
    expect(GENERATIONS.at(-1)!.last).toBe(LAST_POKEMON)
  })
})

describe('generationFromParam', () => {
  it('reads the generation from the address', () => {
    expect(generationFromParam('2')).toMatchObject({ number: 2, region: 'Johto', first: 152, last: 251 })
  })

  it('ignores anything that is not a generation', () => {
    for (const value of [null, '', '0', '6', 'kanto', '1.0', ' 1']) {
      expect(generationFromParam(value)).toBeNull()
    }
  })
})
