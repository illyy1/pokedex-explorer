// One row in the list. Picture and types are optional because
// the PokéAPI list endpoint only gives us the name and number.
export type PokemonListItem = {
  id: number
  name: string
  sprite?: string
  types?: string[]
}

export type PokemonStat = {
  name: string
  value: number
}

// Everything the details panel shows.
export type PokemonInfo = {
  id: number
  name: string
  types: string[]
  artwork: string
  stats: PokemonStat[]
  description: string
}
