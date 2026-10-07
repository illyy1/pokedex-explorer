import { useEffect, useState } from 'react'
import { fetchPokemonInfo, fetchPokemonPage, LAST_POKEMON } from './api'
import DetailsPanel from './components/DetailsPanel'
import PokemonList from './components/PokemonList'
import type { PokemonInfo, PokemonListItem } from './types'

function App() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [info, setInfo] = useState<PokemonInfo | null>(null)
  // The id of the Pokémon whose details failed to load, if any.
  const [detailsErrorId, setDetailsErrorId] = useState<number | null>(null)
  // Goes up on every click, so clicking the same Pokémon again retries a failed load.
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived.
    let ignore = false
    fetchPokemonPage(0)
      .then((items) => {
        if (!ignore) setPokemon(items)
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) {
          setListError("Couldn't load Pokémon. Check your internet connection and refresh the page.")
        }
      })
      .finally(() => {
        if (!ignore) setIsLoadingList(false)
      })
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
        if (!ignore) {
          setInfo(result)
          setDetailsErrorId(null)
        }
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setDetailsErrorId(selectedId)
      })
    return () => {
      ignore = true
    }
  }, [selectedId, clickCount])

  function handleSelect(id: number) {
    setSelectedId(id)
    setClickCount((count) => count + 1)
  }

  async function handleLoadMore() {
    setIsLoadingList(true)
    setListError(null)
    try {
      const items = await fetchPokemonPage(pokemon.length)
      setPokemon((current) => [...current, ...items])
    } catch (error) {
      console.error(error)
      setListError("Couldn't load more Pokémon. Check your internet connection and try again.")
    } finally {
      setIsLoadingList(false)
    }
  }

  const canLoadMore = pokemon.length > 0 && pokemon.length < LAST_POKEMON
  const selected = pokemon.find((p) => p.id === selectedId)
  // Only show info that belongs to the clicked Pokémon, not the previous one.
  const selectedInfo = info?.id === selectedId ? info : undefined
  const detailsFailed = selectedId !== null && detailsErrorId === selectedId

  return (
    <>
      <header>
        <h1>Pokédex Explorer</h1>
      </header>
      <main>
        <section className="list-panel" aria-label="Pokémon list">
          <PokemonList pokemon={pokemon} selectedId={selectedId} onSelect={handleSelect} />
          {isLoadingList && <p className="status">Loading…</p>}
          {listError && (
            <p className="status error" role="alert">
              {listError}
            </p>
          )}
          {canLoadMore && !isLoadingList && (
            <button type="button" className="load-more" onClick={handleLoadMore}>
              Load more
            </button>
          )}
        </section>
        <section className="details-panel" aria-label="Pokémon details">
          <DetailsPanel selected={selected} info={selectedInfo} failed={detailsFailed} />
        </section>
      </main>
    </>
  )
}

export default App
