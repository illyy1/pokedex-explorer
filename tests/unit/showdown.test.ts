import { describe, expect, it } from 'vitest'
import { showdownMoveName, showdownPokemonName, teamToShowdownText } from '../../src/lib/showdown'
import { emptyEvs } from '../../src/lib/stats'
import { newMember, type Team } from '../../src/lib/teams'

const NAMES: Record<number, string> = { 25: 'pikachu', 122: 'mr-mime', 386: 'deoxys-normal' }
const nameOf = (id: number) => NAMES[id]

describe('showdownPokemonName', () => {
  it('capitalizes ordinary names', () => {
    expect(showdownPokemonName('pikachu')).toBe('Pikachu')
  })

  it('uses Showdown spelling for special names and default forms', () => {
    expect(showdownPokemonName('mr-mime')).toBe('Mr. Mime')
    expect(showdownPokemonName('farfetchd')).toBe('Farfetch’d')
    expect(showdownPokemonName('deoxys-normal')).toBe('Deoxys')
    expect(showdownPokemonName('nidoran-f')).toBe('Nidoran-F')
  })
})

describe('showdownMoveName', () => {
  it('turns dashes into spaces for ordinary moves', () => {
    expect(showdownMoveName('volt-tackle')).toBe('Volt Tackle')
    expect(showdownMoveName('hidden-power-ice')).toBe('Hidden Power Ice')
  })

  it('keeps the punctuation of moves that have it', () => {
    expect(showdownMoveName('u-turn')).toBe('U-turn')
    expect(showdownMoveName('will-o-wisp')).toBe('Will-O-Wisp')
    expect(showdownMoveName('double-edge')).toBe('Double-Edge')
  })
})

describe('teamToShowdownText', () => {
  it('writes a fully set-up Pokémon in Showdown’s import format', () => {
    const team: Team = {
      id: 't1',
      name: 'Test',
      members: [
        {
          pokemonId: 25,
          ability: 'lightning-rod',
          item: 'Light Ball',
          nature: 'Timid',
          evs: { ...emptyEvs(), spa: 252, spd: 4, spe: 252 },
          moves: ['thunderbolt', 'hidden-power-ice', 'u-turn', 'volt-switch'],
        },
      ],
    }
    expect(teamToShowdownText(team, nameOf)).toBe(
      [
        'Pikachu @ Light Ball',
        'Ability: Lightning Rod',
        'EVs: 252 SpA / 4 SpD / 252 Spe',
        'Timid Nature',
        '- Thunderbolt',
        '- Hidden Power Ice',
        '- U-turn',
        '- Volt Switch',
      ].join('\n'),
    )
  })

  it('leaves out everything that was not chosen', () => {
    const team: Team = { id: 't1', name: 'Test', members: [newMember(25)] }
    expect(teamToShowdownText(team, nameOf)).toBe('Pikachu')
  })

  it('skips empty move slots', () => {
    const member = { ...newMember(25), moves: ['', 'thunderbolt', '', ''] }
    const team: Team = { id: 't1', name: 'Test', members: [member] }
    expect(teamToShowdownText(team, nameOf)).toBe('Pikachu\n- Thunderbolt')
  })

  it('puts a blank line between Pokémon and uses Showdown names', () => {
    const team: Team = { id: 't1', name: 'Test', members: [newMember(122), newMember(386)] }
    expect(teamToShowdownText(team, nameOf)).toBe('Mr. Mime\n\nDeoxys')
  })

  it('is empty for an empty team', () => {
    expect(teamToShowdownText({ id: 't1', name: 'Test', members: [] }, nameOf)).toBe('')
  })
})
