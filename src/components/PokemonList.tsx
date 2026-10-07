import type { PokemonListItem } from '../types'
import TypeBadge from './TypeBadge'

type Props = {
  pokemon: PokemonListItem[]
  selectedId: number | null
  onSelect: (id: number) => void
}

function PokemonList({ pokemon, selectedId, onSelect }: Props) {
  return (
    <ul className="pokemon-list">
      {pokemon.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            className={p.id === selectedId ? 'row selected' : 'row'}
            onClick={() => onSelect(p.id)}
          >
            {p.sprite && <img src={p.sprite} alt="" width="56" height="56" />}
            <span className="number">#{p.id}</span>
            <span className="name">{p.name}</span>
            {p.types && (
              <span className="types">
                {p.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default PokemonList
