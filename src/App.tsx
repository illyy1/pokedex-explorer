import { useEffect, useState } from 'react'
import { fetchPokemonInfo, fetchPokemonPage, LAST_POKEMON } from './api'
import DetailsPanel from './components/DetailsPanel'
import PokemonList from './components/PokemonList'
import type { PokemonInfo, PokemonListItem } from './types'

function App() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [info, setInfo] = useState<PokemonInfo | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived.
    let ignore = false
    fetchPokemonPage(0)
      .then((items) => {
        if (!ignore) setPokemon(items)
      })
      .catch((error) => console.error(error))
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (selectedId === null) return
    // Ignore the answer if another Pokémon was clicked before it arrived.
    let ignore = false
    fetchPokemonInfo(selectedId)
      .then((result) => {
        if (!ignore) setInfo(result)
      })
      .catch((error) => console.error(error))
    return () => {
      ignore = true
    }
  }, [selectedId])

  async function handleLoadMore() {
    setIsLoadingMore(true)
    try {
      const items = await fetchPokemonPage(pokemon.length)
      setPokemon((current) => [...current, ...items])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const canLoadMore = pokemon.length > 0 && pokemon.length < LAST_POKEMON
  const selected = pokemon.find((p) => p.id === selectedId)
  // Only show info that belongs to the clicked Pokémon, not the previous one.
  const selectedInfo = info?.id === selectedId ? info : undefined

  return (
    <>
      <header>
        <h1>Pokédex Explorer</h1>
      </header>
      <main>
        <section className="list-panel" aria-label="Pokémon list">
          <PokemonList pokemon={pokemon} selectedId={selectedId} onSelect={setSelectedId} />
          {canLoadMore && (
            <button
              type="button"
              className="load-more"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              Load more
            </button>
          )}
        </section>
        <section className="details-panel" aria-label="Pokémon details">
          <DetailsPanel selected={selected} info={selectedInfo} />
        </section>
      </main>
    </>
  )
}

export default App
