// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LAST_POKEMON } from '../../src/lib/api'
import { pokemonOfTheDay } from '../../src/lib/pokemonOfTheDay'
import { fakeFetch } from '../helpers/fakeApi'
import { pokemonList, renderApp, setUpFakeBrowser } from '../helpers/renderApp'

// These tests render the whole app, with its pages, router and saved data,
// and only replace the internet with the fake server in tests/helpers/fakeApi.ts.
// The Team Builder has its own file, TeamBuilder.integration.test.tsx.

setUpFakeBrowser()

describe('Home page', () => {
  // The first day from 2026 on whose Pokémon of the day is `id`.
  function dayFor(id: number): Date {
    const day = new Date(2026, 0, 1, 12)
    while (pokemonOfTheDay(day) !== id) day.setDate(day.getDate() + 1)
    return day
  }

  it('shows the Pokémon of the day, which opens its card', async () => {
    // Only the date is pretend; timers stay real.
    vi.useFakeTimers({ toFake: ['Date'], now: dayFor(25) })
    try {
      const user = renderApp('/')
      expect(screen.getByRole('heading', { name: 'Pokédex Explorer', level: 1 })).toBeInTheDocument()
      const featured = within(screen.getByRole('region', { name: 'Pokémon of the day' }))
      const card = await featured.findByRole('link', { name: /pikachu/i })
      expect(card).toHaveTextContent('Gen 1 · Kanto')
      expect(card).toHaveTextContent('25/649')

      await user.click(card)
      expect(await screen.findByRole('article', { name: 'pikachu card' })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('makes the Pokémon of the day sparkle when it is legendary', async () => {
    vi.useFakeTimers({ toFake: ['Date'], now: dayFor(150) })
    try {
      renderApp('/')
      const featured = within(screen.getByRole('region', { name: 'Pokémon of the day' }))
      const card = await featured.findByRole('link', { name: /mewtwo/i })
      expect(card).toHaveClass('holo-rare')
      expect(card).toHaveTextContent('✦ Legendary')
    } finally {
      vi.useRealTimers()
    }
  })

  it('links to the Pokédex, the favorites and the Team Builder', async () => {
    const user = renderApp('/')
    const hero = within(screen.getByRole('heading', { name: 'Pokédex Explorer', level: 1 }).parentElement!)
    await user.click(hero.getByRole('link', { name: 'Team Builder' }))
    expect(screen.getByRole('heading', { name: 'Team Builder' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Home' }))
    await user.click(screen.getByRole('link', { name: 'My favorites' }))
    expect(await screen.findByText(/No favorites yet/)).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Home' }))
    await user.click(screen.getByRole('link', { name: 'Browse the Pokédex' }))
    expect(await pokemonList().findByRole('button', { name: /pikachu/i })).toBeInTheDocument()
  })
})

describe('Page not found', () => {
  it('shows "Page not found" for an unknown address, with a way home', async () => {
    const user = renderApp('/no-such-page')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Go back to Home' }))
    expect(screen.getByRole('heading', { name: 'Pokédex Explorer', level: 1 })).toBeInTheDocument()
  })
})

describe('Edge sprites', () => {
  // The pictures of the Pokémon peeking in from the screen edges.
  function edgeSprites(): string[] {
    return [...document.querySelectorAll('.edge-sprites img')].map((img) => img.getAttribute('src')!)
  }

  it('shows ten different Pokémon that screen readers skip', () => {
    renderApp('/pokedex')
    expect(edgeSprites()).toHaveLength(10)
    expect(new Set(edgeSprites()).size).toBe(10)
    for (const column of document.querySelectorAll('.edge-sprites')) {
      expect(column).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('picks new ones on each page, but keeps them while picking Pokémon', async () => {
    const user = renderApp('/pokedex')
    const first = edgeSprites()
    await user.click(await pokemonList().findByRole('button', { name: /pikachu/i }))
    expect(edgeSprites()).toEqual(first)

    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(edgeSprites()).toHaveLength(10)
    expect(edgeSprites()).not.toEqual(first)
  })
})

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

  it('shows the shiny artwork with the Shiny button, and remembers it', async () => {
    const user = renderApp('/pokedex/25')
    const card = await screen.findByRole('article', { name: 'pikachu card' })
    expect(within(card).getByRole('img', { name: 'pikachu' })).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/art/25.png',
    )
    const shiny = screen.getByRole('button', { name: '✨ Shiny: Off' })
    expect(shiny).toHaveAttribute('aria-pressed', 'false')

    await user.click(shiny)
    expect(screen.getByRole('button', { name: '✨ Shiny: On' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(card).getByRole('img', { name: 'shiny pikachu' })).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/art/shiny/25.png',
    )
    expect(localStorage.getItem('shiny')).toBe('true')

    // Other Pokémon open shiny too, and so does the next visit.
    await user.click(pokemonList().getByRole('button', { name: /charizard/i }))
    const charizard = await screen.findByRole('article', { name: 'charizard card' })
    expect(within(charizard).getByRole('img', { name: 'shiny charizard' })).toBeInTheDocument()
    cleanup()
    renderApp('/pokedex/4')
    const charmander = await screen.findByRole('article', { name: 'charmander card' })
    expect(within(charmander).getByRole('img', { name: 'shiny charmander' })).toBeInTheDocument()
  })

  it('turns the Shiny button off for a Pokémon without shiny artwork', async () => {
    localStorage.setItem('shiny', 'true')
    renderApp('/pokedex/26')
    const card = await screen.findByRole('article', { name: 'raichu card' })
    expect(screen.getByRole('button', { name: /Shiny/ })).toBeDisabled()
    // It shows the usual artwork instead of a broken picture.
    expect(within(card).getByRole('img', { name: 'raichu' })).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/art/26.png',
    )
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

describe('Generation marks', () => {
  it('shows the generation on every list row and on the card', async () => {
    renderApp('/pokedex/150')
    const row = await pokemonList().findByRole('button', { name: /pikachu/i })
    expect(within(row).getByText('Gen 1')).toHaveAttribute(
      'title',
      'Introduced in Generation 1 (Kanto)',
    )
    const card = await screen.findByRole('article', { name: 'mewtwo card' })
    expect(within(card).getByText('Gen 1 · Kanto')).toBeInTheDocument()
  })
})

describe('Browsing by generation', () => {
  // These tests need the whole Pokédex, not only the few test Pokémon.
  function renderWithAll(path: string) {
    vi.stubGlobal('fetch', fakeFetch({ fullIndex: true }))
    return renderApp(path)
  }

  // The Pokédex numbers of the rows in the list, in order.
  async function rowNumbers(): Promise<number[]> {
    const rows = () => [...document.querySelectorAll('.pokemon-list .row')]
    await waitFor(() => expect(rows().length).toBeGreaterThan(0))
    return rows().map((row) => Number(row.textContent!.match(/No\. (\d+)/)![1]))
  }

  function generationSelect() {
    return screen.getByRole('combobox', { name: 'Filter by generation' })
  }

  it('has a button on the home page for each generation', () => {
    renderApp('/')
    const section = within(screen.getByRole('region', { name: 'Browse by generation' }))
    const buttons = section.getAllByRole('link')
    expect(buttons.map((b) => b.getAttribute('href'))).toEqual([
      '/pokedex?gen=1',
      '/pokedex?gen=2',
      '/pokedex?gen=3',
      '/pokedex?gen=4',
      '/pokedex?gen=5',
    ])
    expect(buttons[1]).toHaveTextContent('Gen 2Johto')
    expect(buttons[1]).toHaveTextContent('No. 152–251')
  })

  it('opens the Pokédex with only that generation’s Pokémon', async () => {
    const user = renderWithAll('/')
    const section = within(screen.getByRole('region', { name: 'Browse by generation' }))
    await user.click(section.getByRole('link', { name: /^Gen 2/ }))

    const numbers = await rowNumbers()
    expect(numbers[0]).toBe(152)
    expect(numbers).toHaveLength(50)
    expect(numbers.every((n) => n >= 152 && n <= 251)).toBe(true)
    expect(generationSelect()).toHaveValue('2')
    expect(screen.getByText('Generation 2 · Johto')).toBeInTheDocument()
  })

  it('goes back to every Pokémon with "Show all Pokémon"', async () => {
    const user = renderWithAll('/pokedex?gen=3')
    expect((await rowNumbers())[0]).toBe(252)

    await user.click(screen.getByRole('button', { name: 'Show all Pokémon' }))
    expect((await rowNumbers())[0]).toBe(1)
    expect(generationSelect()).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Show all Pokémon' })).not.toBeInTheDocument()
  })

  it('switches generation with the dropdown', async () => {
    const user = renderWithAll('/pokedex')
    expect((await rowNumbers())[0]).toBe(1)
    await user.selectOptions(generationSelect(), '5')
    expect((await rowNumbers())[0]).toBe(494)
    await user.selectOptions(generationSelect(), '')
    expect((await rowNumbers())[0]).toBe(1)
  })

  it('stays on the generation while picking Pokémon', async () => {
    const user = renderWithAll('/pokedex?gen=2')
    await user.click(await pokemonList().findByRole('button', { name: /No\. 155(?!\d)/ }))
    expect(await screen.findByRole('article', { name: 'pokemon-155 card' })).toBeInTheDocument()
    expect(generationSelect()).toHaveValue('2')
    expect((await rowNumbers())[0]).toBe(152)
  })

  it('searches only inside the picked generation', async () => {
    const user = renderWithAll('/pokedex?gen=1')
    await user.type(screen.getByRole('searchbox', { name: /search pokémon/i }), 'pika')
    expect(pokemonList().getByRole('button', { name: /pikachu/i })).toBeInTheDocument()

    await user.selectOptions(generationSelect(), '2')
    expect(screen.getByText('No Pokémon match your search.')).toBeInTheDocument()
  })

  it('shows every Pokémon for an address with an unknown generation', async () => {
    renderWithAll('/pokedex?gen=9')
    expect((await rowNumbers())[0]).toBe(1)
    expect(generationSelect()).toHaveValue('')
  })

  it('works on the Favorites page too', async () => {
    localStorage.setItem('favorites', JSON.stringify([25, 155]))
    const user = renderWithAll('/favorites?gen=2')
    expect(await rowNumbers()).toEqual([155])

    await user.selectOptions(generationSelect(), '3')
    expect(screen.getByText('No favorites from this generation yet.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show all favorites' }))
    expect(await rowNumbers()).toEqual([25, 155])
  })
})

describe('Dark mode button', () => {
  function themeButton() {
    return screen.getByRole('button', { name: 'Dark mode' })
  }

  it('follows the computer until a mode is picked', () => {
    // The pretend computer is set to light mode.
    renderApp('/')
    expect(themeButton()).toHaveAttribute('aria-pressed', 'false')
    expect(themeButton()).toHaveTextContent('🌙')
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('switches to dark mode and back, and remembers it', async () => {
    const user = renderApp('/')
    await user.click(themeButton())
    expect(themeButton()).toHaveAttribute('aria-pressed', 'true')
    expect(themeButton()).toHaveTextContent('☀️')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    await user.click(themeButton())
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('opens in the mode picked on an earlier visit', () => {
    localStorage.setItem('theme', 'dark')
    renderApp('/pokedex')
    expect(themeButton()).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('starts in dark mode when the computer is set to dark', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('dark'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }))
    renderApp('/')
    expect(themeButton()).toHaveAttribute('aria-pressed', 'true')
    // Nothing is saved until the button is used.
    expect(localStorage.getItem('theme')).toBeNull()
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
