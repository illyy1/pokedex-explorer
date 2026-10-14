import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

// Content Security Policy: the browser only loads scripts, styles, pictures
// and data from the places listed here, so even if some code were slipped
// into the page, it couldn't load or send anything elsewhere. GitHub Pages
// can't send security headers, so it goes in a <meta> tag.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Only the app's own built script; no inline scripts, no eval.
  "script-src 'self'",
  // The app's stylesheet and the Cabin font's stylesheet from Google Fonts.
  "style-src 'self' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  // Sprites and artwork come from PokéAPI's collection on GitHub.
  "img-src 'self' data: https://raw.githubusercontent.com",
  // PokéAPI, and Smogon's builds (data.pkmn.cc redirects to pkmn.github.io).
  'connect-src https://pokeapi.co https://data.pkmn.cc https://pkmn.github.io',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

// Adds the policy to the built index.html only: the dev server injects
// styles and uses a live-reload connection that this policy would block.
function contentSecurityPolicy(): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), contentSecurityPolicy()],
  test: {
    environment: 'node',
    // The end-to-end tests in tests/e2e/ are run by Playwright, not Vitest.
    include: ['tests/{unit,integration}/**/*.test.{ts,tsx}'],
  },
  // GitHub Pages serves the site from https://illyy1.github.io/pokedex-explorer/,
  // so the built files live under that folder, and `vite preview` serves them
  // there too. The dev server stays at "/".
  base: command === 'build' || isPreview ? '/pokedex-explorer/' : '/',
}))
