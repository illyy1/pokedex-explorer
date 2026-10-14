import type { PokemonListItem } from './types'

// Turns what the user typed into the form we compare against:
// "  Mr Mime " -> "mr-mime", because PokéAPI names use dashes.
export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, '-')
}

// A number ("25", "#25" or "025") matches Pokédex numbers that start with it,
// so "25" finds #25 and #250-#259. Anything else matches part of the name.
export function matchesQuery(pokemon: PokemonListItem, query: string): boolean {
  const number = query.replace(/^#/, '')
  if (/^\d+$/.test(number)) {
    return String(pokemon.id).startsWith(String(Number(number)))
  }
  return pokemon.name.includes(query)
}
