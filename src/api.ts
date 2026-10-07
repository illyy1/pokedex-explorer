import type { PokemonInfo, PokemonListItem } from './types'

const API_URL = 'https://pokeapi.co/api/v2'

// Genesect, the last Pokémon of Generation 5.
export const LAST_POKEMON = 649
export const PAGE_SIZE = 50

type ListResponse = {
  results: { name: string; url: string }[]
}

// Only the parts of the /pokemon/{id} response that we use.
type PokemonResponse = {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other: { 'official-artwork': { front_default: string | null } }
  }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

// Only the parts of the /pokemon-species/{id} response that we use.
type SpeciesResponse = {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`)
  }
  return response.json()
}

// The list endpoint has no id field, so we read it from the end of the url,
// for example "https://pokeapi.co/api/v2/pokemon/25/" -> 25.
function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

// The name and number of every Pokémon up to LAST_POKEMON, in one request.
// Used for searching and to know which Pokémon come next in the list.
export async function fetchPokemonIndex(): Promise<PokemonListItem[]> {
  const list = await getJson<ListResponse>(`${API_URL}/pokemon?limit=${LAST_POKEMON}&offset=0`)
  return list.results.map((result) => ({
    id: idFromUrl(result.url),
    name: result.name,
  }))
}

// The index has no pictures or types, so we request each Pokémon's own data.
export async function fetchListItem(id: number): Promise<PokemonListItem> {
  const p = await getJson<PokemonResponse>(`${API_URL}/pokemon/${id}`)
  return {
    id: p.id,
    name: p.name,
    sprite: p.sprites.front_default ?? undefined,
    types: p.types.map((t) => t.type.name),
  }
}

// The text comes from the old games, so it has line breaks (\n, \f)
// and the spelling "POKéMON". We tidy both up.
function englishDescription(species: SpeciesResponse): string {
  const entry = species.flavor_text_entries.find((e) => e.language.name === 'en')
  if (!entry) return 'No description available.'
  return entry.flavor_text.replace(/\s+/g, ' ').replace(/POKéMON/g, 'Pokémon')
}

export async function fetchPokemonInfo(id: number): Promise<PokemonInfo> {
  // Both requests are sent at the same time.
  const [p, species] = await Promise.all([
    getJson<PokemonResponse>(`${API_URL}/pokemon/${id}`),
    getJson<SpeciesResponse>(`${API_URL}/pokemon-species/${id}`),
  ])
  return {
    id: p.id,
    name: p.name,
    types: p.types.map((t) => t.type.name),
    artwork: p.sprites.other['official-artwork'].front_default ?? p.sprites.front_default ?? '',
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    description: englishDescription(species),
  }
}
