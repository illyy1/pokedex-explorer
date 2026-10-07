import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  fetchListItem,
  fetchPokemonInfo,
  fetchTypeData,
  LAST_POKEMON,
  PAGE_SIZE,
  type TypeData,
} from '../api'
import DetailsPanel from '../components/DetailsPanel'
import PokemonList from '../components/PokemonList'
import { useFavorites } from '../favorites'
import { usePokemonData } from '../pokemonData'
import { ALL_TYPES } from '../pokemonTypes'
import { matchesQuery, normalizeQuery } from '../search'
import type { PokemonInfo } from '../types'

// The most search results we show (and load pictures for) at once.
const MAX_RESULTS = 50

// Used for both the Pokédex page and the Favorites page, which shows only
// favorites and keeps its own address (/favorites/25 instead of /pokedex/25).
function PokedexPage({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const { index, items, addItems, isLoadingIndex, indexError } = usePokemonData()
  const { ids: favoriteIds } = useFavorites()
  const navigate = useNavigate()
  const basePath = favoritesOnly ? '/favorites' : '/pokedex'

  // The clicked Pokémon comes from the address, for example /pokedex/25.
  const { id } = useParams()
  const selectedId = id === undefined ? null : Number(id)
  const isValidId =
    selectedId !== null && Number.isInteger(selectedId) && selectedId >= 1 && selectedId <= LAST_POKEMON

  // How many Pokémon the list shows when not searching.
  const [shownCount, setShownCount] = useState(PAGE_SIZE)
  const listPanelRef = useRef<HTMLElement>(null)
  const endMarkerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  // The picked type, or '' for all types.
  const [typeFilter, setTypeFilter] = useState('')
  // The Pokémon of the most recently loaded type.
  const [typeData, setTypeData] = useState<TypeData | null>(null)
  // The type whose Pokémon failed to load, if any.
  const [typeErrorName, setTypeErrorName] = useState<string | null>(null)
  // The rows whose pictures and types failed to load, if any.
  const [itemsErrorKey, setItemsErrorKey] = useState<string | null>(null)
  // Goes up when "Try again" is clicked, to load the failed rows again.
  const [retryCount, setRetryCount] = useState(0)

  const [info, setInfo] = useState<PokemonInfo | null>(null)
  // The id of the Pokémon whose details failed to load, if any.
  const [detailsErrorId, setDetailsErrorId] = useState<number | null>(null)
  // Goes up on every click, so clicking the same Pokémon again retries a failed load.
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    if (!isValidId) return
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
  }, [selectedId, isValidId, clickCount])

  useEffect(() => {
    if (typeFilter === '') return
    // Ignore the answer if another type was picked before it arrived.
    let ignore = false
    fetchTypeData(typeFilter)
      .then((result) => {
        if (!ignore) {
          setTypeData(result)
          setTypeErrorName(null)
        }
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setTypeErrorName(typeFilter)
      })
    return () => {
      ignore = true
    }
  }, [typeFilter])

  const search = normalizeQuery(query)
  const isSearching = search !== ''
  const isFiltering = isSearching || typeFilter !== ''
  // The numbers of the picked type's Pokémon, once they have loaded.
  const typeIds =
    typeFilter !== '' && typeData?.name === typeFilter ? new Set(typeData.pokemonIds) : null
  const typeFailed = typeFilter !== '' && typeErrorName === typeFilter
  const isLoadingType = typeFilter !== '' && !typeIds && !typeFailed

  // All Pokémon, or only the favorites.
  const baseList = favoritesOnly ? index.filter((p) => favoriteIds.includes(p.id)) : index
  const matches = isFiltering
    ? baseList.filter(
        (p) =>
          (typeFilter === '' || typeIds?.has(p.id)) && (!isSearching || matchesQuery(p, search)),
      )
    : []
  const visible = isFiltering
    ? matches.slice(0, MAX_RESULTS)
    : favoritesOnly
      ? baseList
      : index.slice(0, shownCount)
  // Use the loaded version (with picture and types) when we have it.
  const rows = visible.map((p) => items[p.id] ?? p)

  // Rows that still need their picture and types. Joined into a string
  // so the effect below only runs when this list really changes.
  const missingKey = visible
    .filter((p) => !items[p.id])
    .map((p) => p.id)
    .join(',')
  const itemsFailed = missingKey !== '' && itemsErrorKey === missingKey
  const isLoadingItems = missingKey !== '' && !itemsFailed

  useEffect(() => {
    if (missingKey === '') return
    const ids = missingKey.split(',').map(Number)
    // While typing, wait until the user stops for a moment before loading.
    const timer = setTimeout(
      () => {
        Promise.all(ids.map(fetchListItem))
          .then(addItems)
          .catch((error) => {
            console.error(error)
            setItemsErrorKey(missingKey)
          })
      },
      isFiltering ? 300 : 0,
    )
    return () => clearTimeout(timer)
  }, [missingKey, isFiltering, retryCount, addItems])

  function handleSelect(pokemonId: number) {
    navigate(`${basePath}/${pokemonId}`)
    setClickCount((count) => count + 1)
  }

  function handleRetry() {
    setItemsErrorKey(null)
    setRetryCount((count) => count + 1)
  }

  // Only one page loads at a time: while rows are loading (or failed), this is false.
  const canLoadMore =
    !favoritesOnly && !isFiltering && shownCount < index.length && !isLoadingItems && !itemsFailed

  // Infinite scroll: watch the end marker inside the scrolling list panel.
  // The observer is made again after every page, so if the marker is still
  // in view (for example on a tall screen), the next page loads too.
  useEffect(() => {
    const endMarker = endMarkerRef.current
    if (!canLoadMore || !endMarker) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setShownCount((count) => count + PAGE_SIZE)
      },
      // Start a little before the very end, so new rows are usually ready in time.
      { root: listPanelRef.current, rootMargin: '0px 0px 150px 0px' },
    )
    observer.observe(endMarker)
    return () => observer.disconnect()
  }, [canLoadMore, shownCount])

  const selected = isValidId
    ? (items[selectedId] ?? index.find((p) => p.id === selectedId) ?? { id: selectedId, name: '' })
    : undefined
  // Only show info that belongs to the clicked Pokémon, not the previous one.
  const selectedInfo = info?.id === selectedId ? info : undefined
  const detailsFailed = isValidId && detailsErrorId === selectedId

  return (
    <div className="pokedex">
      <section ref={listPanelRef} className="list-panel" aria-label="Pokémon list">
        <div className="search">
          <input
            type="search"
            placeholder="Search by name or number"
            aria-label="Search Pokémon by name or Pokédex number"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter by type"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">All types</option>
            {ALL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <PokemonList pokemon={rows} selectedId={selectedId} onSelect={handleSelect} />
        {favoritesOnly && !isLoadingIndex && !indexError && baseList.length === 0 && (
          <p className="status">No favorites yet. Tap the ☆ on any Pokémon to save it.</p>
        )}
        {typeFailed && (
          <p className="status error" role="alert">
            Couldn't load the Pokémon of this type. Check your internet connection, pick "All
            types", then pick this type again.
          </p>
        )}
        {isFiltering && !isLoadingIndex && !isLoadingType && !typeFailed && matches.length === 0 && (
          <p className="status">No Pokémon match your search.</p>
        )}
        {matches.length > MAX_RESULTS && (
          <p className="status">
            Showing the first {MAX_RESULTS} of {matches.length} matches. Type a name or number to
            narrow it down.
          </p>
        )}
        {(isLoadingIndex || isLoadingType || isLoadingItems) && <p className="status">Loading…</p>}
        {indexError && (
          <p className="status error" role="alert">
            Couldn't load Pokémon. Check your internet connection and refresh the page.
          </p>
        )}
        {itemsFailed && (
          <div className="status error" role="alert">
            <p>Couldn't load these Pokémon. Check your internet connection and try again.</p>
            <button type="button" className="load-more" onClick={handleRetry}>
              Try again
            </button>
          </div>
        )}
        {/* Invisible marker after the last row. When it scrolls into view, the next page loads. */}
        <div ref={endMarkerRef} aria-hidden="true" />
      </section>
      <section className="details-panel" aria-label="Pokémon details">
        {id !== undefined && !isValidId ? (
          <p className="hint">There is no Pokémon #{id} in this Pokédex.</p>
        ) : (
          <DetailsPanel selected={selected} info={selectedInfo} failed={detailsFailed} />
        )}
      </section>
    </div>
  )
}

export default PokedexPage
