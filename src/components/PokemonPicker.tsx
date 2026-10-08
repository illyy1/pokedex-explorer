import { useEffect, useRef, useState } from 'react'
import { displayName, spriteUrl } from '../names'
import { usePokemonData } from '../pokemonData'
import { matchesQuery, normalizeQuery } from '../search'

// How many more Pokémon the picker shows each time you reach the bottom.
const PAGE_SIZE = 40

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
  const [shownCount, setShownCount] = useState(PAGE_SIZE)
  const listRef = useRef<HTMLUListElement>(null)
  const endMarkerRef = useRef<HTMLLIElement>(null)

  const search = normalizeQuery(query)
  const matches = index.filter(
    (p) => !excludeIds.includes(p.id) && (search === '' || matchesQuery(p, search)),
  )
  const choices = matches.slice(0, shownCount)
  const hasMore = shownCount < matches.length

  // Infinite scroll: when the end marker scrolls into view inside the list,
  // show the next page. The names are already loaded, so this is instant,
  // and each sprite only downloads when it comes into view.
  useEffect(() => {
    const endMarker = endMarkerRef.current
    if (!hasMore || !endMarker) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setShownCount((count) => count + PAGE_SIZE)
      },
      { root: listRef.current, rootMargin: '0px 0px 120px 0px' },
    )
    observer.observe(endMarker)
    return () => observer.disconnect()
  }, [hasMore, shownCount])

  function handleSearch(text: string) {
    setQuery(text)
    // A new search starts again from the top of its results.
    setShownCount(PAGE_SIZE)
    listRef.current?.scrollTo({ top: 0 })
  }

  return (
    <div className="picker">
      <div className="picker-search">
        <input
          type="search"
          placeholder="Search by name or number"
          aria-label="Search for a Pokémon to add"
          value={query}
          autoFocus
          onChange={(event) => handleSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onCancel()
          }}
        />
        <button type="button" className="picker-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {isLoadingIndex && <p className="status">Loading…</p>}
      {!isLoadingIndex && matches.length === 0 && <p className="status">No Pokémon match.</p>}
      <ul ref={listRef} className="picker-list">
        {choices.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onPick(p.id)}>
              <img src={spriteUrl(p.id)} alt="" width="48" height="48" loading="lazy" />
              <span className="picker-name">{displayName(p.name)}</span>
              <span className="picker-number">No. {p.id}</span>
            </button>
          </li>
        ))}
        {/* Invisible marker after the last choice. When it scrolls into view, more appear. */}
        {hasMore && <li ref={endMarkerRef} className="picker-end" aria-hidden="true" />}
      </ul>
    </div>
  )
}

export default PokemonPicker
