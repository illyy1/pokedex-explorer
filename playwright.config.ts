import { defineConfig, devices } from '@playwright/test'

// End-to-end tests: the built site runs in a real browser and talks to the
// real PokéAPI and Smogon data, like on GitHub Pages. They need the internet.
export default defineConfig({
  testDir: 'tests/e2e',
  // PokéAPI can be slow, so give each test a little more time.
  timeout: 60_000,
  retries: 1,
  reporter: 'list',
  use: {
    // `vite preview` serves the built site under the same folder as GitHub Pages.
    baseURL: 'http://localhost:4173/pokedex-explorer/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/pokedex-explorer/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
