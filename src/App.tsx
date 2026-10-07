import { useEffect, useState } from 'react'
import { fetchPokemonPage } from './api'
import DetailsPanel from './components/DetailsPanel'
import PokemonList from './components/PokemonList'
import samplePokemon from './data/samplePokemon.json'
import type { PokemonInfo, PokemonListItem } from './types'

const sampleInfo: PokemonInfo[] = samplePokemon

function App() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

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

  const selected = pokemon.find((p) => p.id === selectedId)
  const info = sampleInfo.find((p) => p.id === selectedId)

  return (
    <>
      <header>
        <h1>Pokédex Explorer</h1>
      </header>
      <main>
        <section className="list-panel" aria-label="Pokémon list">
          <PokemonList pokemon={pokemon} selectedId={selectedId} onSelect={setSelectedId} />
        </section>
        <section className="details-panel" aria-label="Pokémon details">
          <DetailsPanel selected={selected} info={info} />
        </section>
      </main>
    </>
  )
}

export default App
