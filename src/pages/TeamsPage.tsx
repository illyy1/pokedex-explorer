import { Link, useNavigate } from 'react-router'
import { displayName, spriteUrl } from '../names'
import { usePokemonData } from '../pokemonData'
import { TEAM_SIZE, useTeams } from '../teams'

// The Team Builder: every saved team, and a button to start a new one.
function TeamsPage() {
  const { teams, createTeam, deleteTeam } = useTeams()
  const { index } = usePokemonData()
  const navigate = useNavigate()

  function handleNewTeam() {
    navigate(`/teams/${createTeam()}`)
  }

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Delete "${name}"? This can't be undone.`)) deleteTeam(id)
  }

  // The list of all names comes from the shared index once it has loaded.
  const nameOf = (id: number) => displayName(index.find((p) => p.id === id)?.name ?? `No. ${id}`)

  return (
    <div className="page teams">
      <header className="teams-header">
        <div>
          <h1>Team Builder</h1>
          <p className="intro">
            Pick up to {TEAM_SIZE} Pokémon, choose their abilities and moves, and build as many
            teams as you like. Teams are saved in this browser.
          </p>
        </div>
        <button type="button" className="button primary" onClick={handleNewTeam}>
          ＋ New team
        </button>
      </header>

      {teams.length === 0 ? (
        <p className="hint">No teams yet. Click "New team" to build your first one.</p>
      ) : (
        <ul className="team-list">
          {teams.map((team) => (
            <li key={team.id} className="team-box">
              <Link to={`/teams/${team.id}`} className="team-box-link">
                <span className="team-box-name">{team.name}</span>
                <span className="team-box-count">
                  {team.members.length}/{TEAM_SIZE} Pokémon
                </span>
                <span className="team-box-slots">
                  {Array.from({ length: TEAM_SIZE }, (_, i) => {
                    const member = team.members[i]
                    return member ? (
                      <img
                        key={i}
                        src={spriteUrl(member.pokemonId)}
                        alt={nameOf(member.pokemonId)}
                        title={nameOf(member.pokemonId)}
                        width="64"
                        height="64"
                      />
                    ) : (
                      <span key={i} className="empty-slot" aria-hidden="true" />
                    )
                  })}
                </span>
              </Link>
              <button
                type="button"
                className="team-delete"
                onClick={() => handleDelete(team.id, team.name)}
                aria-label={`Delete ${team.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TeamsPage
