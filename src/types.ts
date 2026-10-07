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

// How much damage one attacking type does, for example { type: 'rock', multiplier: 4 }.
export type Matchup = {
  type: string
  multiplier: number
}

export type Matchups = {
  weak: Matchup[]
  resist: Matchup[]
  immune: string[]
}

export type Ability = {
  name: string
  isHidden: boolean
  // A one-sentence explanation of what the ability does.
  effect: string
}

// One recommended competitive set. A move, item, ability or nature with
// alternatives is shown as "Thunderbolt / Thunder".
export type Build = {
  format: string
  name: string
  moves: string[]
  item?: string
  ability?: string
  nature?: string
  // For example "252 Atk / 4 SpA / 252 Spe".
  evs?: string
}

// Everything the details panel shows.
export type PokemonInfo = {
  id: number
  name: string
  types: string[]
  artwork: string
  stats: PokemonStat[]
  description: string
  matchups: Matchups
  abilities: Ability[]
  // null when the builds could not be loaded.
  builds: Build[] | null
}
