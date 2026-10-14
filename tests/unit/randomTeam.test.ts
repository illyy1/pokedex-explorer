import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTeamPokemon, LAST_POKEMON } from '../../src/lib/api'
import { fetchItemNames, fetchTeamBuilds, type TeamBuild } from '../../src/lib/builds'
import { randomMember, randomPokemonIds } from '../../src/lib/randomTeam'
import { NATURES } from '../../src/lib/stats'

// randomMember asks PokéAPI and the builds file; these tests answer for them.
vi.mock('../../src/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../src/lib/api')>()),
  fetchTeamPokemon: vi.fn(),
}))
vi.mock('../../src/lib/builds', () => ({ fetchTeamBuilds: vi.fn(), fetchItemNames: vi.fn() }))

const PIKACHU = {
  item: { id: 25, name: 'pikachu' },
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  moves: ['iron-tail', 'quick-attack', 'thunderbolt', 'volt-tackle', 'grass-knot', 'surf'],
}

const BUILD: TeamBuild = {
  format: 'OU',
  name: 'Light Ball Attacker',
  ability: 'lightning-rod',
  item: 'Light Ball',
  nature: 'Hasty',
  evs: { hp: 0, atk: 252, def: 0, spa: 4, spd: 0, spe: 252 },
  moves: ['volt-tackle', 'thunderbolt', 'grass-knot'],
}

describe('randomPokemonIds', () => {
  it('picks the asked number of different Pokémon from the Pokédex', () => {
    for (let run = 0; run < 50; run++) {
      const ids = randomPokemonIds(6)
      expect(ids).toHaveLength(6)
      expect(new Set(ids).size).toBe(6)
      for (const id of ids) {
        expect(Number.isInteger(id)).toBe(true)
        expect(id).toBeGreaterThanOrEqual(1)
        expect(id).toBeLessThanOrEqual(LAST_POKEMON)
      }
    }
  })

  it('never picks a Pokémon that is left out', () => {
    // Leave out every Pokémon but #1 and #2.
    const exclude = Array.from({ length: LAST_POKEMON - 2 }, (_, i) => i + 3)
    expect(randomPokemonIds(2, exclude).sort()).toEqual([1, 2])
  })

  it('stops when there are not enough Pokémon left to pick', () => {
    const exclude = Array.from({ length: LAST_POKEMON - 1 }, (_, i) => i + 2)
    expect(randomPokemonIds(6, exclude)).toEqual([1])
  })
})

describe('randomMember', () => {
  beforeEach(() => {
    vi.mocked(fetchTeamPokemon).mockResolvedValue(PIKACHU as never)
    vi.mocked(fetchItemNames).mockResolvedValue(['Choice Scarf', 'Leftovers', 'Light Ball'])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('uses one of the Pokémon’s Smogon builds when it has some', async () => {
    vi.mocked(fetchTeamBuilds).mockResolvedValue([BUILD])
    expect(await randomMember(25)).toEqual({
      pokemonId: 25,
      ability: 'lightning-rod',
      item: 'Light Ball',
      nature: 'Hasty',
      evs: BUILD.evs,
      // A build with three moves gets an empty fourth slot.
      moves: ['volt-tackle', 'thunderbolt', 'grass-knot', ''],
    })
  })

  it('makes a random complete set when there are no builds', async () => {
    vi.mocked(fetchTeamBuilds).mockResolvedValue([])
    for (let run = 0; run < 20; run++) {
      const member = await randomMember(25)
      expect(['static', 'lightning-rod']).toContain(member.ability)
      expect(['Choice Scarf', 'Leftovers', 'Light Ball']).toContain(member.item)
      expect(NATURES.map((n) => n.name)).toContain(member.nature)
      expect(member.evs).toEqual({ hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 })
      // Four different moves the Pokémon can learn.
      expect(member.moves).toHaveLength(4)
      expect(new Set(member.moves).size).toBe(4)
      for (const move of member.moves) expect(PIKACHU.moves).toContain(move)
    }
  })

  it('still makes a set, without an item, when the builds file fails', async () => {
    vi.mocked(fetchTeamBuilds).mockRejectedValue(new Error('offline'))
    vi.mocked(fetchItemNames).mockRejectedValue(new Error('offline'))
    const member = await randomMember(25)
    expect(member.item).toBe('')
    expect(member.moves.filter(Boolean)).toHaveLength(4)
  })

  it('fails when the Pokémon itself cannot be loaded', async () => {
    vi.mocked(fetchTeamPokemon).mockRejectedValue(new Error('offline'))
    await expect(randomMember(25)).rejects.toThrow('offline')
  })
})
