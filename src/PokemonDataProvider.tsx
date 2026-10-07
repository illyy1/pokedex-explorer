import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { fetchPokemonIndex } from './api'
import { PokemonDataContext } from './pokemonData'
import type { PokemonListItem } from './types'

function PokemonDataProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<PokemonListItem[]>([])
  const [items, setItems] = useState<Record<number, PokemonListItem>>({})
  const [isLoadingIndex, setIsLoadingIndex] = useState(true)
  const [indexError, setIndexError] = useState(false)

  // useCallback keeps the same function between renders, so pages can
  // safely list it in their useEffect dependencies.
  const addItems = useCallback((loaded: PokemonListItem[]) => {
    setItems((current) => {
      const next = { ...current }
      for (const item of loaded) next[item.id] = item
      return next
    })
  }, [])

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived.
    let ignore = false
    fetchPokemonIndex()
      .then((all) => {
        if (!ignore) setIndex(all)
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setIndexError(true)
      })
      .finally(() => {
        if (!ignore) setIsLoadingIndex(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <PokemonDataContext.Provider value={{ index, items, addItems, isLoadingIndex, indexError }}>
      {children}
    </PokemonDataContext.Provider>
  )
}

export default PokemonDataProvider
