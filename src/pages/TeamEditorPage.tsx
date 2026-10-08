import { Link, useParams } from 'react-router'
import { TEAM_SIZE, useTeams } from '../teams'

// Edits one team: its name and its six Pokémon.
function TeamEditorPage() {
  const { teamId } = useParams()
  const { teams, updateTeam } = useTeams()
  const team = teams.find((t) => t.id === teamId)

  if (!team) {
    return (
      <div className="page">
        <h1>Team not found</h1>
        <p>
          This team doesn't exist in this browser. <Link to="/teams">Go back to your teams</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page team-editor">
      <Link to="/teams" className="back-link">
        ← All teams
      </Link>
      <label className="team-name">
        <span>Team name</span>
        <input
          type="text"
          value={team.name}
          maxLength={30}
          onChange={(event) => updateTeam(team.id, (t) => ({ ...t, name: event.target.value }))}
        />
      </label>
      <p className="hint">
        {team.members.length}/{TEAM_SIZE} Pokémon. Coming soon: adding Pokémon.
      </p>
    </div>
  )
}

export default TeamEditorPage
