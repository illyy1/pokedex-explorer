import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, vi } from 'vitest'
import App from '../../src/App'
import { fakeFetch } from './fakeApi'

// Browser features jsdom doesn't have. The app only needs them to exist.
class FakeIntersectionObserver {
  observe() {}
  disconnect() {}
}

// Call at the top of an integration test file: every test starts with
// empty storage and the fake server, and is cleaned up afterwards.
export function setUpFakeBrowser() {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', fakeFetch())
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }))
    Element.prototype.scrollTo = () => {}
    // Expected failures (like the offline tests) are logged; keep the output clean.
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
}

// Renders the whole app at `path`, and returns a user to click and type with.
export function renderApp(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

export function pokemonList() {
  return within(screen.getByRole('region', { name: 'Pokémon list' }))
}
