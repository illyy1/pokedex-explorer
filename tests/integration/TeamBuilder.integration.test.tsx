// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { screen, waitFor, within } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SHOWDOWN_TEAMBUILDER_URL } from '../../src/lib/showdown'
import { fakeFetch } from '../helpers/fakeApi'
import { renderApp, setUpFakeBrowser } from '../helpers/renderApp'

// The Team Builder, rendered as part of the whole app with the fake server.

setUpFakeBrowser()

// The team saved in this browser's storage.
function savedTeam() {
  return JSON.parse(localStorage.getItem('teams') ?? '[]')[0]
}

// Opens the Team Builder and makes a new, empty team.
async function newTeam() {
  const user = renderApp('/teams')
  await user.click(screen.getByRole('button', { name: /new team/i }))
  return user
}

// Adds a Pokémon with the picker and waits until its card has loaded.
async function addPokemon(user: UserEvent, search: string, name: string) {
  await user.click(screen.getByRole('button', { name: /add pokémon/i }))
  await user.type(screen.getByRole('searchbox', { name: 'Search for a Pokémon to add' }), search)
  await user.click(await screen.findByRole('button', { name: new RegExp(name, 'i') }))
  await screen.findByRole('button', { name: `Remove ${name}` })
}

// Waits until the Smogon builds and items have loaded for the card.
async function waitForItems() {
  await screen.findByRole('option', { name: 'Light Ball' })
}

const PIKACHU_BUILD_TEXT = [
  'Pikachu @ Light Ball',
  'Ability: Static',
  'EVs: 252 Atk / 4 SpA / 252 Spe',
  'Hasty Nature',
  '- Volt Tackle',
  '- Thunderbolt',
  '- Hidden Power Ice',
  '- Quick Attack',
].join('\n')

// Makes a team with Pikachu holding its Smogon build.
async function teamWithPikachuBuild() {
  const user = await newTeam()
  await addPokemon(user, 'pika', 'Pikachu')
  await waitForItems()
  await user.selectOptions(screen.getByRole('combobox', { name: 'Smogon build' }), 'Light Ball Attacker')
  return user
}

describe('Team Builder', () => {
  it('makes a new team, adds a Pokémon and saves it', async () => {
    const user = renderApp('/teams')
    expect(screen.getByText(/No teams yet/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /new team/i }))
    expect(screen.getByRole('textbox', { name: 'Team name' })).toHaveValue('Team 1')
    expect(screen.getByText(/0\/6 Pokémon/)).toBeInTheDocument()

    await addPokemon(user, 'pika', 'Pikachu')
    expect(screen.getByText(/1\/6 Pokémon/)).toBeInTheDocument()
    expect(savedTeam()).toMatchObject({ name: 'Team 1', members: [{ pokemonId: 25 }] })

    await user.click(screen.getByRole('link', { name: /all teams/i }))
    expect(screen.getByRole('link', { name: /Team 1.*1\/6 Pokémon/ })).toBeInTheDocument()
  })

  it('shows "Team not found" for a team that does not exist', () => {
    renderApp('/teams/no-such-team')
    expect(screen.getByRole('heading', { name: 'Team not found' })).toBeInTheDocument()
  })

  it('gives legendary Pokémon a sparkly team card', async () => {
    const user = await newTeam()
    await addPokemon(user, 'mew', 'Mewtwo')
    const card = screen.getByRole('heading', { name: /Mewtwo/ }).closest('article')!
    expect(card).toHaveClass('holo-rare')
    expect(card.querySelector('.sparkles')).not.toBeNull()
    expect(within(card).getByText('✦ Legendary')).toBeInTheDocument()
  })
})

describe('Choosing a Pokémon’s set', () => {
  it('starts with the first normal ability, and offers the hidden one', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')
    const ability = screen.getByRole('combobox', { name: 'Ability' })
    await waitFor(() => expect(ability).toHaveValue('static'))
    expect(within(ability).getByRole('option', { name: 'Lightning Rod (hidden)' })).toBeInTheDocument()

    await user.selectOptions(ability, 'lightning-rod')
    expect(savedTeam().members[0].ability).toBe('lightning-rod')
  })

  it('chooses an item', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')
    await waitForItems()
    // The items are the ones Smogon's builds use, A to Z.
    const item = screen.getByRole('combobox', { name: 'Item' })
    expect(within(item).getAllByRole('option').map((o) => o.textContent)).toEqual([
      '— No item —',
      'Life Orb',
      'Light Ball',
    ])

    await user.selectOptions(item, 'Light Ball')
    expect(savedTeam().members[0].item).toBe('Light Ball')
  })

  it('chooses moves, never offering the same move twice', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Move 1' }), 'thunderbolt')

    const move2 = screen.getByRole('combobox', { name: 'Move 2' })
    expect(within(move2).queryByRole('option', { name: 'Thunderbolt' })).not.toBeInTheDocument()
    // Hidden Power is offered with each of its types.
    expect(within(move2).getByRole('option', { name: 'Hidden Power Ice' })).toBeInTheDocument()

    await user.selectOptions(move2, 'hidden-power-ice')
    expect(savedTeam().members[0].moves).toEqual(['thunderbolt', 'hidden-power-ice', '', ''])
  })

  it('chooses a nature and EVs, keeping EVs within the limits', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')
    await user.click(screen.getByText('Nature & EVs'))
    expect(screen.getByText('None set')).toBeInTheDocument()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Nature' }), 'Timid')
    expect(screen.getByRole('option', { name: 'Timid (+Spe −Atk)' })).toBeInTheDocument()

    const ev = (stat: string) => screen.getByRole('spinbutton', { name: stat })
    await user.clear(ev('SpA'))
    await user.type(ev('SpA'), '252')
    // At most 252 in one stat.
    await user.clear(ev('Atk'))
    await user.type(ev('Atk'), '300')
    expect(ev('Atk')).toHaveValue(252)
    // At most 510 in all: only 6 are left for Speed.
    await user.clear(ev('Spe'))
    await user.type(ev('Spe'), '252')
    expect(ev('Spe')).toHaveValue(6)
    expect(screen.getByText('0 of 510 EVs left')).toBeInTheDocument()
    expect(screen.getByText('Timid · 252 Atk / 252 SpA / 6 Spe')).toBeInTheDocument()

    expect(savedTeam().members[0]).toMatchObject({
      nature: 'Timid',
      evs: { hp: 0, atk: 252, def: 0, spa: 252, spd: 0, spe: 6 },
    })
  })

  it('fills in everything from a Smogon build', async () => {
    await teamWithPikachuBuild()
    expect(screen.getByRole('combobox', { name: 'Item' })).toHaveValue('Light Ball')
    expect(screen.getByRole('combobox', { name: 'Ability' })).toHaveValue('static')
    expect(screen.getByRole('combobox', { name: 'Nature' })).toHaveValue('Hasty')
    expect(
      ['Move 1', 'Move 2', 'Move 3', 'Move 4'].map(
        (name) => (screen.getByRole('combobox', { name }) as HTMLSelectElement).value,
      ),
    ).toEqual(['volt-tackle', 'thunderbolt', 'hidden-power-ice', 'quick-attack'])
    expect(screen.getByText('Hasty · 252 Atk / 4 SpA / 252 Spe')).toBeInTheDocument()
  })
})

describe('Exporting a team', () => {
  it('copies the team in Showdown’s format and opens Showdown', async () => {
    const user = await teamWithPikachuBuild()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)

    await user.click(screen.getByRole('button', { name: 'Export to Showdown' }))
    expect(writeText).toHaveBeenCalledWith(PIKACHU_BUILD_TEXT)
    expect(open).toHaveBeenCalledWith(SHOWDOWN_TEAMBUILDER_URL, '_blank', 'noopener')
    expect(await screen.findByRole('status')).toHaveTextContent('Team copied!')
  })

  it('shows the text to copy by hand when the browser blocks copying', async () => {
    const user = await teamWithPikachuBuild()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Not allowed'))
    vi.spyOn(window, 'open').mockImplementation(() => null)

    await user.click(screen.getByRole('button', { name: 'Export to Showdown' }))
    expect(await screen.findByRole('textbox', { name: "Team in Showdown's format" })).toHaveValue(
      PIKACHU_BUILD_TEXT,
    )
  })

  it('saves the team as a text file named after the team', async () => {
    const user = await teamWithPikachuBuild()
    await user.clear(screen.getByRole('textbox', { name: 'Team name' }))
    await user.type(screen.getByRole('textbox', { name: 'Team name' }), 'Rain: Team?')

    // jsdom can't download files, so catch the file and the link instead.
    let file: Blob | undefined
    URL.createObjectURL = (blob: Blob) => {
      file = blob
      return 'blob:team'
    }
    URL.revokeObjectURL = () => {}
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await user.click(screen.getByRole('button', { name: 'Save as text file' }))
    // Characters that can't be in a file name are left out.
    expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('Rain Team.txt')
    expect(await file?.text()).toBe(PIKACHU_BUILD_TEXT)
    expect(screen.getByRole('status')).toHaveTextContent('Saved as Rain Team.txt')
  })

  it('cannot export an empty team', async () => {
    await newTeam()
    expect(screen.getByRole('button', { name: 'Export to Showdown' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save as text file' })).toBeDisabled()
    expect(screen.getByText('Add a Pokémon to export or save this team.')).toBeInTheDocument()
  })
})

describe('Team randomizer', () => {
  it('fills a whole team with six different Pokémon with complete sets', async () => {
    const user = await newTeam()
    await user.click(screen.getByRole('button', { name: '🎲 Randomize team' }))
    expect(await screen.findByText(/6\/6 Pokémon/)).toBeInTheDocument()

    const { members } = savedTeam()
    expect(new Set(members.map((m: { pokemonId: number }) => m.pokemonId)).size).toBe(6)
    for (const member of members) {
      expect(member.ability).toBeTruthy()
      expect(member.nature).toBeTruthy()
      expect(member.moves.filter(Boolean).length).toBeGreaterThanOrEqual(3)
    }
  })

  it('asks before replacing a team that already has Pokémon', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)

    await user.click(screen.getByRole('button', { name: '🎲 Randomize team' }))
    expect(confirm).toHaveBeenCalledWith('Replace every Pokémon in "Team 1" with random ones?')
    // Saying no keeps the team as it was.
    expect(screen.getByText(/1\/6 Pokémon/)).toBeInTheDocument()
    expect(savedTeam().members[0].pokemonId).toBe(25)
  })

  it('swaps one Pokémon for a random one', async () => {
    const user = await newTeam()
    await addPokemon(user, 'pika', 'Pikachu')

    await user.click(screen.getByRole('button', { name: '🎲 Randomize' }))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Remove Pikachu' })).not.toBeInTheDocument(),
    )
    expect(screen.getByText(/1\/6 Pokémon/)).toBeInTheDocument()
    expect(savedTeam().members[0].pokemonId).not.toBe(25)
  })

  it('adds a random Pokémon to the next empty slot', async () => {
    const user = await newTeam()
    await user.click(screen.getByRole('button', { name: '🎲 Random Pokémon' }))
    expect(await screen.findByText(/1\/6 Pokémon/)).toBeInTheDocument()
    expect(savedTeam().members[0].nature).toBeTruthy()
  })

  it('says so when the random Pokémon cannot be loaded', async () => {
    const user = await newTeam()
    vi.stubGlobal('fetch', fakeFetch({ offline: true }))
    // Pick #600, which no other test has loaded, so it isn't remembered from before.
    vi.spyOn(Math, 'random').mockReturnValueOnce(599.5 / 649)

    await user.click(screen.getByRole('button', { name: '🎲 Random Pokémon' }))
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load the random Pokémon.")
    expect(screen.getByText(/0\/6 Pokémon/)).toBeInTheDocument()
  })
})
