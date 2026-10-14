// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fakeFetch } from '../helpers/fakeApi'
import { pokemonList, renderApp, setUpFakeBrowser } from '../helpers/renderApp'

// What happens when something goes wrong: requests that fail (and "Try
// again"), saved data that is broken or was changed by hand, and changes
// made in another tab.

setUpFakeBrowser()

// Makes only the requests `fails` picks fail.
function failRequests(fails: (url: string) => boolean) {
  vi.stubGlobal('fetch', fakeFetch({ fails }))
}

// The internet works again.
function goOnline() {
  vi.stubGlobal('fetch', fakeFetch())
}

describe('Failed requests', () => {
  // This runs first: the builds file is remembered once it has loaded.
  it('still shows the card when the builds cannot be loaded', async () => {
    failRequests((url) => url.includes('data.pkmn.cc'))
    renderApp('/pokedex/25')
    expect(await screen.findByRole('article', { name: 'pikachu card' })).toBeInTheDocument()
    const builds = screen.getByRole('region', { name: 'Recommended builds' })
    expect(within(builds).getByText(/Couldn't load the builds/)).toBeInTheDocument()
  })

  it('says so when a card cannot be loaded, and tries again on the next click', async () => {
    failRequests((url) => url.endsWith('/pokemon-species/26'))
    const user = renderApp('/pokedex/26')
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load the details.")

    goOnline()
    await user.click(pokemonList().getByRole('button', { name: /raichu/i }))
    expect(await screen.findByRole('article', { name: 'raichu card' })).toBeInTheDocument()
  })

  it('offers "Try again" when the list rows cannot be loaded', async () => {
    // The index of names loads, but each Pokémon's own picture and types don't.
    failRequests((url) => /\/pokemon\/\d+$/.test(url))
    const user = renderApp('/pokedex')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("Couldn't load these Pokémon.")
    expect(pokemonList().getByRole('button', { name: /pikachu/i })).not.toHaveTextContent('HP')

    goOnline()
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))
    await waitFor(() =>
      expect(pokemonList().getByRole('button', { name: /pikachu/i })).toHaveTextContent('50 HP'),
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('says so when the Pokémon of a type cannot be loaded', async () => {
    failRequests((url) => url.endsWith('/type/fire'))
    const user = renderApp('/pokedex')
    await pokemonList().findByRole('button', { name: /pikachu/i })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by type' }), 'fire')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't load the Pokémon of this type.",
    )
  })

  it('says so when the Pokémon of the day cannot be loaded', async () => {
    vi.stubGlobal('fetch', fakeFetch({ offline: true }))
    renderApp('/')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't load the Pokémon of the day.",
    )
  })

  it('offers "Try again" when a team card cannot be loaded', async () => {
    failRequests((url) => url.endsWith('/pokemon/25'))
    const user = renderApp('/teams')
    await user.click(screen.getByRole('button', { name: /new team/i }))
    await user.click(screen.getByRole('button', { name: /add pokémon/i }))
    await user.type(screen.getByRole('searchbox', { name: 'Search for a Pokémon to add' }), 'pika')
    await user.click(await screen.findByRole('button', { name: /pikachu/i }))
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent("Couldn't load this Pokémon.")

    goOnline()
    await user.click(within(alert).getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('button', { name: 'Remove Pikachu' })).toBeInTheDocument()
  })
})

describe('Many search results', () => {
  it('shows the first 50 and says how many there are', async () => {
    vi.stubGlobal('fetch', fakeFetch({ fullIndex: true }))
    const user = renderApp('/pokedex')
    await pokemonList().findByRole('button', { name: /pikachu/i })

    // "1" matches No. 1, Nos. 10–19 and Nos. 100–199.
    await user.type(screen.getByRole('searchbox', { name: /search pokémon/i }), '1')
    expect(
      screen.getByText(/Showing the first 50 of 111 matches/),
    ).toBeInTheDocument()
    expect(pokemonList().getAllByRole('button')).toHaveLength(50)
  })
})

describe('Broken saved data', () => {
  it('starts with no favorites when they are not readable', async () => {
    localStorage.setItem('favorites', 'not a list{')
    renderApp('/favorites')
    expect(await screen.findByText(/No favorites yet/)).toBeInTheDocument()
  })

  it('keeps only the favorites that are real Pokédex numbers', async () => {
    localStorage.setItem('favorites', JSON.stringify([25, 'pikachu', 2.5, null, 4]))
    renderApp('/favorites')
    await pokemonList().findByRole('button', { name: /pikachu/i })
    expect(pokemonList().getAllByRole('button')).toHaveLength(2)
    expect(pokemonList().getByRole('button', { name: /charmander/i })).toBeInTheDocument()
    // Only the good ones are saved again.
    expect(JSON.parse(localStorage.getItem('favorites')!)).toEqual([25, 4])
  })

  it('starts with no teams when they are not readable', () => {
    localStorage.setItem('teams', JSON.stringify({ not: 'a list' }))
    renderApp('/teams')
    expect(screen.getByText(/No teams yet/)).toBeInTheDocument()
  })

  it('keeps good teams, drops broken ones, and fills in what old teams are missing', async () => {
    localStorage.setItem(
      'teams',
      JSON.stringify([
        // Saved before items, natures and EVs existed, with only one move.
        { id: 'old', name: 'Old team', members: [{ pokemonId: 25, ability: 'static', moves: ['thunderbolt'] }] },
        'not a team',
        { id: 'broken', name: 'No members list' },
        // EVs over the 510 limit.
        {
          id: 'evs',
          name: 'Too many EVs',
          members: [
            {
              pokemonId: 4,
              ability: 'blaze',
              moves: [],
              nature: 'Not a nature',
              evs: { hp: 252, atk: 252, def: 252 },
            },
          ],
        },
      ]),
    )
    renderApp('/teams')
    const names = [...document.querySelectorAll('.team-box-name')].map((el) => el.textContent)
    expect(names).toEqual(['Old team', 'Too many EVs'])

    // Once the page has saved them again, they are complete.
    await waitFor(() => expect(JSON.parse(localStorage.getItem('teams')!)).toHaveLength(2))
    const [old, evs] = JSON.parse(localStorage.getItem('teams')!)
    expect(old.members[0]).toEqual({
      pokemonId: 25,
      ability: 'static',
      item: '',
      nature: '',
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: ['thunderbolt', '', '', ''],
    })
    expect(evs.members[0]).toMatchObject({
      nature: '',
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    })
  })
})

describe('Another tab', () => {
  // What the browser does in this tab when another tab saves something.
  function changeInAnotherTab(key: string, value: unknown) {
    act(() => {
      localStorage.setItem(key, JSON.stringify(value))
      window.dispatchEvent(new StorageEvent('storage', { key }))
    })
  }

  it('shows favorites added in another tab', async () => {
    renderApp('/favorites')
    expect(await screen.findByText(/No favorites yet/)).toBeInTheDocument()
    changeInAnotherTab('favorites', [6])
    expect(await pokemonList().findByRole('button', { name: /charizard/i })).toBeInTheDocument()
  })

  it('shows teams made in another tab', () => {
    renderApp('/teams')
    changeInAnotherTab('teams', [{ id: 't', name: 'From the other tab', members: [] }])
    expect(screen.getByRole('link', { name: /From the other tab/ })).toBeInTheDocument()
  })
})
