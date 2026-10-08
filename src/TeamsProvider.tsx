import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptyEvs, MAX_EVS_PER_STAT, MAX_EVS_TOTAL, NATURES, STATS, type EvSpread } from './stats'
import { MOVES_PER_POKEMON, TEAM_SIZE, TeamsContext, type Team, type TeamMember } from './teams'

// Teams are saved in this browser's localStorage, like favorites.
const STORAGE_KEY = 'teams'

function isMember(value: unknown): value is TeamMember {
  if (typeof value !== 'object' || value === null) return false
  const m = value as Record<string, unknown>
  return (
    Number.isInteger(m.pokemonId) &&
    (m.ability === null || typeof m.ability === 'string') &&
    Array.isArray(m.moves) &&
    m.moves.every((move) => typeof move === 'string')
  )
}

function isTeam(value: unknown): value is Team {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    Array.isArray(t.members) &&
    t.members.length <= TEAM_SIZE &&
    t.members.every(isMember)
  )
}

// Saved EVs must be whole numbers from 0 to 252, 510 at most in all;
// anything else starts again from zero.
function readEvs(value: unknown): EvSpread {
  const evs = emptyEvs()
  if (typeof value !== 'object' || value === null) return evs
  const saved = value as Record<string, unknown>
  for (const stat of STATS) {
    const n = saved[stat]
    if (typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= MAX_EVS_PER_STAT) {
      evs[stat] = n
    }
  }
  return STATS.reduce((sum, stat) => sum + evs[stat], 0) <= MAX_EVS_TOTAL ? evs : emptyEvs()
}

// localStorage can be missing, blocked or hold bad data, so we keep only
// teams that look right, and pad each Pokémon's moves to four slots. Teams
// saved before items, natures and EVs existed get empty ones.
function readTeams(): Team[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTeam).map((team) => ({
      ...team,
      members: team.members.map((m) => ({
        ...m,
        item: typeof m.item === 'string' ? m.item : '',
        nature: NATURES.some((n) => n.name === m.nature) ? m.nature : '',
        evs: readEvs(m.evs),
        moves: Array.from({ length: MOVES_PER_POKEMON }, (_, i) => m.moves[i] ?? ''),
      })),
    }))
  } catch {
    return []
  }
}

// "Team 1", "Team 2", ... skipping names that are already taken.
function nextTeamName(teams: Team[]): string {
  let n = teams.length + 1
  while (teams.some((t) => t.name === `Team ${n}`)) n++
  return `Team ${n}`
}

function newId(): string {
  // randomUUID needs a secure page (https or localhost); fall back otherwise.
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function TeamsProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(readTeams)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
    } catch {
      // Saving failed (for example in a private window). Teams still work
      // until the page is closed.
    }
  }, [teams])

  // When teams change in another tab, show the same teams here.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setTeams(readTeams())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const createTeam = useCallback(() => {
    const id = newId()
    setTeams((current) => [...current, { id, name: nextTeamName(current), members: [] }])
    return id
  }, [])

  const updateTeam = useCallback((id: string, change: (team: Team) => Team) => {
    setTeams((current) => current.map((team) => (team.id === id ? change(team) : team)))
  }, [])

  const deleteTeam = useCallback((id: string) => {
    setTeams((current) => current.filter((team) => team.id !== id))
  }, [])

  const value = useMemo(
    () => ({ teams, createTeam, updateTeam, deleteTeam }),
    [teams, createTeam, updateTeam, deleteTeam],
  )

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>
}

export default TeamsProvider
