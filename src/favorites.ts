import { createContext, useContext } from 'react'

// The user's favorite Pokémon, shared by every page. FavoritesProvider fills it in.
export type Favorites = {
  // Pokédex numbers, smallest first.
  ids: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

export const FavoritesContext = createContext<Favorites | null>(null)

export function useFavorites(): Favorites {
  const favorites = useContext(FavoritesContext)
  if (!favorites) throw new Error('useFavorites must be used inside FavoritesProvider')
  return favorites
}
