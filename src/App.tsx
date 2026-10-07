import { useEffect, useState } from 'react'
import {
  fetchListItem,
  fetchPokemonIndex,
  fetchPokemonInfo,
  fetchTypeData,
  PAGE_SIZE,
  type TypeData,
} from './api'
import DetailsPanel from './components/DetailsPanel'
import PokemonList from './components/PokemonList'
import { ALL_TYPES } from './pokemonTypes'
import { matchesQuery, normalizeQuery } from './search'
import type { PokemonInfo, PokemonListItem } from './types'

// The most search results we show (and load pictures for) at once.
const MAX_RESULTS = 50

function App() {
  // Name and number of every Pokémon, loaded once at the start.
  const [index, setIndex] = useState<PokemonListItem[]>([])
  // Pokémon whose picture and types we have already loaded, by id.
  const [items, setItems] = useState<Record<number, PokemonListItem>>({})
  // How many Pokémon the list shows when not searching.
  const [shownCount, setShownCount] = useState(0)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  // The picked type, or '' for all types.
  const [typeFilter, setTypeFilter] = useState('')
  // The Pokémon of the most recently loaded type.
  const [typeData, setTypeData] = useState<TypeData | null>(null)
  // The type whose Pokémon failed to load, if any.
  const [typeErrorName, setTypeErrorName] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [info, setInfo] = useState<PokemonInfo | null>(null)
  // The id of the Pokémon whose details failed to load, if any.
  const [detailsErrorId, setDetailsErrorId] = useState<number | null>(null)
  // Goes up on every click, so clicking the same Pokémon again retries a failed load.
  const [clickCount, setClickCount] = useState(0)

  function addItems(loaded: PokemonListItem[]) {
    setItems((current) => {
      const next = { ...current }
      for (const item of loaded) next[item.id] = item
      return next
    })
  }

  useEffect(() => {
    // Ignore the answer if the component was removed before it arrived.
    let ignore = false
    async function loadFirstPage() {
      try {
        const all = await fetchPokemonIndex()
        const firstPage = await Promise.all(all.slice(0, PAGE_SIZE).map((p) => fetchListItem(p.id)))
        if (ignore) return
        setIndex(all)
        addItems(firstPage)
        setShownCount(PAGE_SIZE)
      } catch (error) {
        console.error(error)
        if (!ignore) {
          setListError("Couldn't load Pokémon. Check your internet connection and refresh the page.")
        }
      } finally {
        if (!ignore) setIsLoadingList(false)
      }
    }
    loadFirstPage()
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

  const matches = isFiltering
    ? index.filter(
        (p) =>
          (typeFilter === '' || typeIds?.has(p.id)) && (!isSearching || matchesQuery(p, search)),
      )
    : []
  const visible = isFiltering ? matches.slice(0, MAX_RESULTS) : index.slice(0, shownCount)
  // Use the loaded version (with picture and types) when we have it.
  const rows = visible.map((p) => items[p.id] ?? p)

  // Search results that still need their picture and types. Joined into a
  // string so the effect below only runs when this list really changes.
  const missingIds = isFiltering ? visible.filter((p) => !items[p.id]).map((p) => p.id) : []
  const missingKey = missingIds.join(',')

  useEffect(() => {
    if (missingKey === '') return
    const ids = missingKey.split(',').map(Number)
    // Wait until the user stops typing for a moment before loading.
    const timer = setTimeout(() => {
      Promise.all(ids.map(fetchListItem))
        .then(addItems)
        .catch((error) => console.error(error))
    }, 300)
    return () => clearTimeout(timer)
  }, [missingKey])

  function handleSelect(id: number) {
    setSelectedId(id)
    setClickCount((count) => count + 1)
  }

  async function handleLoadMore() {
    setIsLoadingList(true)
    setListError(null)
    try {
      const nextPage = index.slice(shownCount, shownCount + PAGE_SIZE)
      addItems(await Promise.all(nextPage.map((p) => fetchListItem(p.id))))
      setShownCount((count) => count + PAGE_SIZE)
    } catch (error) {
      console.error(error)
      setListError("Couldn't load more Pokémon. Check your internet connection and try again.")
    } finally {
      setIsLoadingList(false)
    }
  }

  const canLoadMore = shownCount > 0 && shownCount < index.length
  const selected =
    selectedId === null ? undefined : (items[selectedId] ?? index.find((p) => p.id === selectedId))
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
          {isLoadingType && <p className="status">Loading…</p>}
          {typeFailed && (
            <p className="status error" role="alert">
              Couldn't load the Pokémon of this type. Check your internet connection, pick "All
              types", then pick this type again.
            </p>
          )}
          {isFiltering && index.length > 0 && !isLoadingType && !typeFailed && matches.length === 0 && (
            <p className="status">No Pokémon match your search.</p>
          )}
          {matches.length > MAX_RESULTS && (
            <p className="status">
              Showing the first {MAX_RESULTS} of {matches.length} matches. Type a name or number to
              narrow it down.
            </p>
          )}
          {isLoadingList && <p className="status">Loading…</p>}
          {listError && (
            <p className="status error" role="alert">
              {listError}
            </p>
          )}
          {!isFiltering && canLoadMore && !isLoadingList && (
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
