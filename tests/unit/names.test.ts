import { describe, expect, it } from 'vitest'
import { displayName, spriteUrl } from '../../src/names'

describe('displayName', () => {
  it('converts PokéAPI hyphenated names to title case', () => {
    expect(displayName('mr-mime')).toBe('Mr Mime')
    expect(displayName('thunder-punch')).toBe('Thunder Punch')
  })
})

describe('spriteUrl', () => {
  it('builds the sprite URL from a Pokédex number', () => {
    expect(spriteUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    )
  })
})
