import type { PokemonListItem } from './types'

const API_URL = 'https://pokeapi.co/api/v2'

type ListResponse = {
  results: { name: string; url: string }[]
}

// The list endpoint has no id field, so we read it from the end of the url,
// for example "https://pokeapi.co/api/v2/pokemon/25/" -> 25.
function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

export async function fetchPokemonPage(
  offset: number,
  limit = 50,
): Promise<PokemonListItem[]> {
  const response = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`)
  }
  const data: ListResponse = await response.json()
  return data.results.map((result) => ({
    id: idFromUrl(result.url),
    name: result.name,
  }))
}
