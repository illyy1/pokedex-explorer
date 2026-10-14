import { createContext, useContext } from 'react'
import type { PokemonListItem } from './types'

// List data shared by every page, so it is kept when moving between pages.
// PokemonDataProvider fills it in.
export type PokemonData = {
  // Name and number of every Pokémon, loaded once at the start.
  index: PokemonListItem[]
  // Pokémon whose picture and types we have already loaded, by id.
  items: Record<number, PokemonListItem>
  addItems: (loaded: PokemonListItem[]) => void
  isLoadingIndex: boolean
  indexError: boolean
}

export const PokemonDataContext = createContext<PokemonData | null>(null)

export function usePokemonData(): PokemonData {
  const data = useContext(PokemonDataContext)
  if (!data) throw new Error('usePokemonData must be used inside PokemonDataProvider')
  return data
}
