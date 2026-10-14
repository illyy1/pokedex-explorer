import { describe, expect, it } from 'vitest'
import { formatLength, formatWeight } from '../../src/lib/units'

describe('formatLength', () => {
  it('turns decimetres into feet and inches, like the old cards', () => {
    expect(formatLength(4)).toBe(`1'4"`) // Pikachu, 0.4 m
    expect(formatLength(17)).toBe(`5'7"`) // Charizard, 1.7 m
    expect(formatLength(200)).toBe(`65'7"`) // Wailord, 20 m
  })

  it('carries 12 inches over into a foot', () => {
    // 0.3 m is 11.8 inches, which rounds to a whole foot.
    expect(formatLength(3)).toBe(`1'0"`)
  })
})

describe('formatWeight', () => {
  it('turns hectograms into whole pounds', () => {
    expect(formatWeight(60)).toBe('13 lbs.') // Pikachu, 6 kg
    expect(formatWeight(905)).toBe('200 lbs.') // Charizard, 90.5 kg
  })

  it('keeps one decimal for very light Pokémon, so they don’t weigh 0', () => {
    expect(formatWeight(1)).toBe('0.2 lbs.') // Gastly, 0.1 kg
    expect(formatWeight(40)).toBe('8.8 lbs.')
  })
})
