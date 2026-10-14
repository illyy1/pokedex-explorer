import { describe, expect, it } from 'vitest'
import { emptyEvs, evTotal, formatEvs, NATURES, natureLabel } from '../../src/lib/stats'

describe('formatEvs', () => {
  it('writes EVs the way Showdown does, leaving out stats at 0', () => {
    expect(formatEvs({ atk: 252, spd: 4, spe: 252 })).toBe('252 Atk / 4 SpD / 252 Spe')
  })

  it('lists stats in the games’ order, whatever order they were given in', () => {
    expect(formatEvs({ spe: 4, hp: 252 })).toBe('252 HP / 4 Spe')
  })

  it('is empty when no EVs are set', () => {
    expect(formatEvs(emptyEvs())).toBe('')
  })
})

describe('evTotal', () => {
  it('adds up all six stats', () => {
    expect(evTotal({ hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 })).toBe(508)
  })
})

describe('natureLabel', () => {
  it('shows which stat a nature raises and lowers', () => {
    const timid = NATURES.find((n) => n.name === 'Timid')!
    expect(natureLabel(timid)).toBe('Timid (+Spe −Atk)')
  })

  it('says when a nature changes nothing', () => {
    const hardy = NATURES.find((n) => n.name === 'Hardy')!
    expect(natureLabel(hardy)).toBe('Hardy (no change)')
  })

  it('has all 25 natures', () => {
    expect(new Set(NATURES.map((n) => n.name)).size).toBe(25)
  })
})
