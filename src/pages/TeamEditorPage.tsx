import { useState } from 'react'
import { Link, useParams } from 'react-router'
import PokemonPicker from '../components/PokemonPicker'
import TeamSlot from '../components/TeamSlot'
import { MOVES_PER_POKEMON, TEAM_SIZE, useTeams, type TeamMember } from '../teams'

// Edits one team: its name and its six Pokémon.
function TeamEditorPage() {
  const { teamId } = useParams()
  const { teams, updateTeam } = useTeams()
  const [isPicking, setIsPicking] = useState(false)
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

  // `team` is known to exist from here on; keep its id for the handlers below.
  const id = team.id

  function addPokemon(pokemonId: number) {
    const member: TeamMember = {
      pokemonId,
      ability: null,
      moves: Array.from({ length: MOVES_PER_POKEMON }, () => ''),
    }
    updateTeam(id, (t) =>
      t.members.length < TEAM_SIZE ? { ...t, members: [...t.members, member] } : t,
    )
    setIsPicking(false)
  }

  function removePokemon(index: number) {
    updateTeam(id, (t) => ({ ...t, members: t.members.filter((_, i) => i !== index) }))
  }

  const emptySlots = TEAM_SIZE - team.members.length

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
          onChange={(event) => updateTeam(id, (t) => ({ ...t, name: event.target.value }))}
        />
      </label>
      <p className="team-count">
        {team.members.length}/{TEAM_SIZE} Pokémon · saved automatically in this browser
      </p>

      <ul className="team-slots">
        {team.members.map((member, index) => (
          // A Pokémon can only be in a team once, so its number is a stable key.
          <li key={member.pokemonId}>
            <TeamSlot member={member} onRemove={() => removePokemon(index)} />
          </li>
        ))}
        {/* The next free slot can add a Pokémon; the others wait their turn. */}
        {Array.from({ length: emptySlots }, (_, i) => (
          <li key={`empty-${i}`} className="team-slot-empty">
            {i === 0 ? (
              isPicking ? (
                <PokemonPicker
                  excludeIds={team.members.map((m) => m.pokemonId)}
                  onPick={addPokemon}
                  onCancel={() => setIsPicking(false)}
                />
              ) : (
                <button type="button" className="add-pokemon" onClick={() => setIsPicking(true)}>
                  <span className="empty-slot" aria-hidden="true" />＋ Add Pokémon
                </button>
              )
            ) : (
              <span className="empty-slot big" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TeamEditorPage
