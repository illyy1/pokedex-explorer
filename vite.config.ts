import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from https://illyy1.github.io/pokedex-explorer/,
  // so the built files live under that folder. The dev server stays at "/".
  base: command === 'build' ? '/pokedex-explorer/' : '/',
}))
