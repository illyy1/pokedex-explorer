import type { PokemonListItem } from './types'

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
  sprites: { front_default: string | null }
  types: { type: { name: string } }[]
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`)
  }
  return response.json()
}

// The list endpoint only has names and urls, so we request each
// Pokémon's own data to get its picture and types.
// The last page is shorter so the list stops at LAST_POKEMON.
export async function fetchPokemonPage(offset: number): Promise<PokemonListItem[]> {
  const limit = Math.min(PAGE_SIZE, LAST_POKEMON - offset)
  const list = await getJson<ListResponse>(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`)
  const pokemon = await Promise.all(
    list.results.map((result) => getJson<PokemonResponse>(result.url)),
  )
  return pokemon.map((p) => ({
    id: p.id,
    name: p.name,
    sprite: p.sprites.front_default ?? undefined,
    types: p.types.map((t) => t.type.name),
  }))
}
