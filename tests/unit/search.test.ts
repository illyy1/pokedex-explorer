import { describe, expect, it } from 'vitest'
import { matchesQuery, normalizeQuery } from '../../src/search'
import type { PokemonListItem } from '../../src/types'

const pokemon: PokemonListItem[] = [
  { id: 25, name: 'pikachu' },
  { id: 251, name: 'celebi' },
  { id: 260, name: 'swampert' },
]

describe('normalizeQuery', () => {
  it('trims, lowercases, and replaces spaces with dashes', () => {
    expect(normalizeQuery('  Mr Mime  ')).toBe('mr-mime')
  })
})

describe('matchesQuery', () => {
  it('matches part of a Pokémon name', () => {
    expect(matchesQuery(pokemon[0], normalizeQuery('Pika'))).toBe(true)
    expect(matchesQuery(pokemon[0], normalizeQuery('raichu'))).toBe(false)
  })

  it('matches Pokédex number prefixes, including # and leading zeroes', () => {
    expect(matchesQuery(pokemon[0], normalizeQuery('#025'))).toBe(true)
    expect(matchesQuery(pokemon[1], normalizeQuery('25'))).toBe(true)
    expect(matchesQuery(pokemon[2], normalizeQuery('25'))).toBe(false)
  })
})