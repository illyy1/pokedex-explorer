import { useState } from 'react'
import { displayName, spriteUrl } from '../names'
import { usePokemonData } from '../pokemonData'
import { matchesQuery, normalizeQuery } from '../search'

// The most Pokémon the picker lists at once.
const MAX_CHOICES = 40

type Props = {
  // Pokémon that are already in the team, so they are not offered again.
  excludeIds: number[]
  onPick: (id: number) => void
  onCancel: () => void
}

// A search box and a list of Pokémon to add to a team.
function PokemonPicker({ excludeIds, onPick, onCancel }: Props) {
  const { index, isLoadingIndex } = usePokemonData()
  const [query, setQuery] = useState('')
  const search = normalizeQuery(query)
  const choices = index
    .filter((p) => !excludeIds.includes(p.id) && (search === '' || matchesQuery(p, search)))
    .slice(0, MAX_CHOICES)

  return (
    <div className="picker">
      <div className="picker-search">
        <input
          type="search"
          placeholder="Search by name or number"
          aria-label="Search for a Pokémon to add"
          value={query}
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onCancel()
          }}
        />
        <button type="button" className="picker-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {isLoadingIndex && <p className="status">Loading…</p>}
      {!isLoadingIndex && choices.length === 0 && <p className="status">No Pokémon match.</p>}
      <ul className="picker-list">
        {choices.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onPick(p.id)}>
              <img src={spriteUrl(p.id)} alt="" width="48" height="48" loading="lazy" />
              <span className="picker-name">{displayName(p.name)}</span>
              <span className="picker-number">No. {p.id}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PokemonPicker
