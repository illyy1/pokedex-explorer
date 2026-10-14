// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LAST_POKEMON } from '../../src/lib/api'
import { fakeFetch } from '../helpers/fakeApi'
import { pokemonList, renderApp, setUpFakeBrowser } from '../helpers/renderApp'

// These tests render the whole app, with its pages, router and saved data,
// and only replace the internet with the fake server in tests/helpers/fakeApi.ts.
// The Team Builder has its own file, TeamBuilder.integration.test.tsx.

setUpFakeBrowser()

describe('Pokédex page', () => {
  it('lists the Pokémon and filters them with the search bar', async () => {
    const user = renderApp('/pokedex')
    expect(await pokemonList().findByRole('button', { name: /pikachu/i })).toBeInTheDocument()
    expect(pokemonList().getByRole('button', { name: /charmander/i })).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /search pokémon/i }), 'char')
    expect(pokemonList().getByRole('button', { name: /charmander/i })).toBeInTheDocument()
    expect(pokemonList().queryByRole('button', { name: /pikachu/i })).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox', { name: /search pokémon/i }))
    await user.type(screen.getByRole('searchbox', { name: /search pokémon/i }), 'zzz')
    expect(screen.getByText('No Pokémon match your search.')).toBeInTheDocument()
  })

  it('filters the list by type', async () => {
    const user = renderApp('/pokedex')
    await pokemonList().findByRole('button', { name: /charmander/i })

    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by type' }), 'electric')
    await waitFor(() =>
      expect(pokemonList().queryByRole('button', { name: /charmander/i })).not.toBeInTheDocument(),
    )
    expect(pokemonList().getByRole('button', { name: /pikachu/i })).toBeInTheDocument()
    expect(pokemonList().getByRole('button', { name: /raichu/i })).toBeInTheDocument()
  })

  it('shows a Pokémon card with its builds when a Pokémon is clicked', async () => {
    const user = renderApp('/pokedex')
    await user.click(await pokemonList().findByRole('button', { name: /pikachu/i }))

    const card = await screen.findByRole('article', { name: 'pikachu card' })
    expect(within(card).getByRole('heading', { name: /pikachu/i })).toBeInTheDocument()
    expect(within(card).getByText(/stores electricity/)).toBeInTheDocument()
    expect(within(card).getByText('What static does.')).toBeInTheDocument()

    const builds = screen.getByRole('region', { name: 'Recommended builds' })
    expect(await within(builds).findByText('Light Ball Attacker')).toBeInTheDocument()
    expect(within(builds).getByText('Light Ball')).toBeInTheDocument()
  })

  it('opens the card straight from the address', async () => {
    renderApp('/pokedex/26')
    expect(await screen.findByRole('article', { name: 'raichu card' })).toBeInTheDocument()
  })

  it('says so when the number in the address is not in the Pokédex', () => {
    renderApp('/pokedex/9999')
    expect(screen.getByText('There is no Pokémon #9999 in this Pokédex.')).toBeInTheDocument()
  })

  it('shows an error when PokéAPI cannot be reached', async () => {
    vi.stubGlobal('fetch', fakeFetch({ offline: true }))
    renderApp('/pokedex')
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't load Pokémon.")
  })
})

describe('Favorites', () => {
  it('saves a favorite and shows it on the Favorites page', async () => {
    const user = renderApp('/pokedex/25')
    await user.click(await screen.findByRole('button', { name: 'Add pikachu to favorites' }))
    expect(screen.getByRole('button', { name: 'Remove pikachu from favorites' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('favorites') ?? '[]')).toEqual([25])

    await user.click(screen.getByRole('link', { name: 'Favorites' }))
    expect(await pokemonList().findByRole('button', { name: /pikachu/i })).toBeInTheDocument()
    expect(pokemonList().queryByRole('button', { name: /charmander/i })).not.toBeInTheDocument()
  })

  it('loads favorites saved on an earlier visit', async () => {
    localStorage.setItem('favorites', JSON.stringify([4]))
    renderApp('/favorites')
    expect(await pokemonList().findByRole('button', { name: /charmander/i })).toBeInTheDocument()
    expect(pokemonList().queryByRole('button', { name: /pikachu/i })).not.toBeInTheDocument()
  })

  it('tells the user when there are no favorites yet', async () => {
    renderApp('/favorites')
    expect(await screen.findByText(/No favorites yet/)).toBeInTheDocument()
  })
})


describe('Pokémon cards', () => {
  // The types (with multipliers) in one of the card's bottom boxes.
  function matchupRow(card: HTMLElement, label: string): string[] {
    const box = within(card).getByText(label).closest('.card-matchup') as HTMLElement
    return [...box.querySelectorAll('.card-matchup-type')].map((el) => el.textContent ?? '')
  }

  it('shows the weaknesses, resistances and immunities of a dual-type Pokémon', async () => {
    renderApp('/pokedex/6')
    const card = await screen.findByRole('article', { name: 'charizard card' })
    // Fire/Flying: Rock hits both types for ×2, so ×4 in all.
    expect(matchupRow(card, 'weakness')).toEqual(['rock×4', 'water×2', 'electric×2'])
    expect(matchupRow(card, 'resistance')).toEqual([
      'grass×¼',
      'bug×¼',
      'fire×½',
      'fighting×½',
      'steel×½',
    ])
    // Flying cancels Fire's weakness to Ground.
    expect(matchupRow(card, 'immune')).toEqual(['ground'])
  })

  it('shows "none" when a Pokémon has no immunities', async () => {
    renderApp('/pokedex/25')
    const card = await screen.findByRole('article', { name: 'pikachu card' })
    expect(matchupRow(card, 'weakness')).toEqual(['ground×2'])
    expect(matchupRow(card, 'resistance')).toEqual(['electric×½', 'flying×½', 'steel×½'])
    const immune = within(card).getByText('immune').closest('.card-matchup') as HTMLElement
    expect(within(immune).getByText('none')).toBeInTheDocument()
  })

  it('gives legendary Pokémon a sparkly card and a Legendary mark', async () => {
    renderApp('/pokedex/150')
    const card = await screen.findByRole('article', { name: 'mewtwo card' })
    expect(card).toHaveClass('holo-rare')
    expect(card.querySelectorAll('.sparkles .sparkle')).toHaveLength(12)
    expect(within(card).getByText('✦ Legendary')).toBeInTheDocument()

    // Its row in the list is sparkly too.
    const row = pokemonList().getByRole('button', { name: /mewtwo/i })
    expect(row).toHaveClass('holo-rare')
    expect(within(row).getByText('✦ Legendary')).toBeInTheDocument()
  })

  it('keeps ordinary Pokémon cards plain', async () => {
    renderApp('/pokedex/25')
    const card = await screen.findByRole('article', { name: 'pikachu card' })
    expect(card).not.toHaveClass('holo-rare')
    expect(card.querySelector('.sparkles')).toBeNull()
    expect(within(card).queryByText(/Legendary|Mythical/)).not.toBeInTheDocument()
  })

  it('turns the 3D effect off and remembers it', async () => {
    const user = renderApp('/pokedex/25')
    const toggle = await screen.findByRole('button', { name: '3D effect: On' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await user.click(toggle)
    expect(screen.getByRole('button', { name: '3D effect: Off' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(localStorage.getItem('tilt3d')).toBe('false')

    // Opening the site again keeps it off.
    cleanup()
    renderApp('/pokedex/25')
    expect(await screen.findByRole('button', { name: '3D effect: Off' })).toBeInTheDocument()
  })
})

describe('About page', () => {
  it('opens from the menu and shows its three cards', async () => {
    const user = renderApp('/pokedex')
    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(screen.getByRole('heading', { name: 'About', level: 1 })).toBeInTheDocument()
    for (const name of ['Pokédex Explorer', 'PokéAPI', 'Smogon']) {
      expect(screen.getByRole('article', { name })).toBeInTheDocument()
    }
    // The number of Pokémon matches the rest of the app.
    expect(screen.getByText(new RegExp(`all ${LAST_POKEMON} Pokémon`))).toBeInTheDocument()
  })

  it('links to the right places, in a new tab', () => {
    renderApp('/about')
    const links: Record<string, string> = {
      illyy1: 'https://github.com/illyy1',
      'See the code on GitHub': 'https://github.com/illyy1/pokedex-explorer',
      'pokeapi.co': 'https://pokeapi.co',
      'pkmn project': 'https://data.pkmn.cc',
      'smogon.com': 'https://www.smogon.com',
    }
    for (const [name, href] of Object.entries(links)) {
      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      // The other site can't control this tab or see where the visitor came from.
      expect(link).toHaveAttribute('rel', 'noreferrer')
    }
  })
})
