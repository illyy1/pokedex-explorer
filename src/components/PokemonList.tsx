import { useFavorites } from '../favorites'
import { typeStyle } from '../pokemonTypes'
import type { PokemonListItem } from '../types'
import EnergySymbol from './EnergySymbol'

type Props = {
  pokemon: PokemonListItem[]
  selectedId: number | null
  onSelect: (id: number) => void
}

// Each row looks like the top of a Pokémon card: name, HP and energy symbols.
function PokemonList({ pokemon, selectedId, onSelect }: Props) {
  const { isFavorite } = useFavorites()
  return (
    <ul className="pokemon-list">
      {pokemon.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className={p.id === selectedId ? 'row selected' : 'row'}
            style={typeStyle(p.types?.[0])}
            aria-current={p.id === selectedId ? 'true' : undefined}
            onClick={() => onSelect(p.id)}
          >
            <span className="row-art">
              {p.sprite && <img src={p.sprite} alt="" width="56" height="56" />}
            </span>
            <span className="row-main">
              <span className="row-top">
                <span className="name">{p.name.replace(/-/g, ' ')}</span>
                {isFavorite(p.id) && (
                  <span className="favorite-mark" aria-label="Favorite">
                    ★
                  </span>
                )}
                {p.hp !== undefined && (
                  <span className="row-hp">
                    {p.hp} <small>HP</small>
                  </span>
                )}
              </span>
              <span className="row-bottom">
                <span className="number">No. {p.id}</span>
                {p.types && (
                  <span className="types">
                    {p.types.map((type) => (
                      <EnergySymbol key={type} type={type} size="small" />
                    ))}
                    <span className="row-types">{p.types.join(' / ')}</span>
                  </span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
