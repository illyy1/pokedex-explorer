import { createContext, useContext } from 'react'

export const TEAM_SIZE = 6
export const MOVES_PER_POKEMON = 4

// One Pokémon in a team. `moves` always has MOVES_PER_POKEMON entries;
// an empty string means that move slot is not chosen yet.
export type TeamMember = {
  pokemonId: number
  ability: string | null
  moves: string[]
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
