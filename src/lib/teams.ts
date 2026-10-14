import { createContext, useContext } from 'react'
import { emptyEvs, type EvSpread } from './stats'

export const TEAM_SIZE = 6
export const MOVES_PER_POKEMON = 4

// One Pokémon in a team. `moves` always has MOVES_PER_POKEMON entries;
// an empty string means that move slot is not chosen yet.
export type TeamMember = {
  pokemonId: number
  ability: string | null
  // The held item in Showdown's spelling ("Choice Scarf"), or "" for none.
  item: string
  // A nature's name ("Adamant"), or "" for none chosen.
  nature: string
  evs: EvSpread
  moves: string[]
}

// A Pokémon just added to a team: nothing chosen yet.
export function newMember(pokemonId: number): TeamMember {
  return {
    pokemonId,
    ability: null,
    item: '',
    nature: '',
    evs: emptyEvs(),
    moves: Array.from({ length: MOVES_PER_POKEMON }, () => ''),
  }
}

export type Team = {
  id: string
  name: string
  members: TeamMember[]
}

// The user's teams, shared by every page. TeamsProvider fills it in and
// saves them in this browser's localStorage.
export type Teams = {
  teams: Team[]
  // Makes a new empty team and returns its id.
  createTeam: () => string
  // Changes one team; `change` gets the current team and returns the new one.
  updateTeam: (id: string, change: (team: Team) => Team) => void
  deleteTeam: (id: string) => void
}

export const TeamsContext = createContext<Teams | null>(null)

export function useTeams(): Teams {
  const teams = useContext(TeamsContext)
  if (!teams) throw new Error('useTeams must be used inside TeamsProvider')
  return teams
}
