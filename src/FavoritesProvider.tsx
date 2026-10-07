import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FavoritesContext } from './favorites'

// Favorites are saved in this browser's localStorage, so they survive
// closing the browser. They are not synced to other devices.
const STORAGE_KEY = 'favorites'

// localStorage can be missing, blocked or hold bad data, so we never trust it.
function readFavorites(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : []
  } catch {
    return []
  }
}

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Saving failed (for example in a private window). Favorites still
      // work until the page is closed.
    }
  }, [ids])

  // When favorites change in another tab, show the same favorites here.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setIds(readFavorites())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const toggleFavorite = useCallback((id: number) => {
    setIds((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id].sort((a, b) => a - b),
    )
  }, [])

  const value = useMemo(
    () => ({ ids, isFavorite: (id: number) => ids.includes(id), toggleFavorite }),
    [ids, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export default FavoritesProvider
