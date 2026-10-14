import { useEffect, useState } from 'react'

// Light or dark mode. Until the user picks one with the button, the site
// follows the computer's setting; the choice is then remembered in this browser.
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Puts the saved choice on <html> (data-theme="dark"), where the CSS reads it.
// main.tsx calls this before the first render, so the page doesn't flash light.
export function applySavedTheme() {
  const theme = savedTheme()
  if (theme) document.documentElement.dataset.theme = theme
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ?? systemTheme())
  // Only remember a theme once the user has picked one.
  const [picked, setPicked] = useState(() => savedTheme() !== null)

  useEffect(() => {
    if (!picked) return
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Saving failed; the choice still works until the page is closed.
    }
  }, [theme, picked])

  // Follow the computer's setting while nothing has been picked.
  useEffect(() => {
    if (picked) return
    const query = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!query) return
    const follow = () => setTheme(query.matches ? 'dark' : 'light')
    query.addEventListener?.('change', follow)
    return () => query.removeEventListener?.('change', follow)
  }, [picked])

  function toggle() {
    setPicked(true)
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return [theme, toggle]
}
