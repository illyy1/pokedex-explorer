import { useState } from 'react'
import { Link, useParams } from 'react-router'
import PokemonPicker from '../components/PokemonPicker'
import ShowdownExport from '../components/ShowdownExport'
import TeamSlot from '../components/TeamSlot'
import { randomMember, randomPokemonIds } from '../randomTeam'
import { newMember, TEAM_SIZE, useTeams, type TeamMember } from '../teams'

// What the randomizer is working on: the whole team, one Pokémon (by its
// number), or a new Pokémon for the next empty slot.
type Randomizing = 'team' | 'new' | number | null

// Edits one team: its name and its six Pokémon.
function TeamEditorPage() {
  const { teamId } = useParams()
  const { teams, updateTeam } = useTeams()
  const [isPicking, setIsPicking] = useState(false)
  const [randomizing, setRandomizing] = useState<Randomizing>(null)
  const [randomError, setRandomError] = useState(false)
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
  const teamIds = team.members.map((m) => m.pokemonId)
  const isRandomizing = randomizing !== null

  function addPokemon(pokemonId: number) {
    const member = newMember(pokemonId)
    updateTeam(id, (t) =>
      t.members.length < TEAM_SIZE ? { ...t, members: [...t.members, member] } : t,
    )
    setIsPicking(false)
  }

  // Each Pokémon is in a team once, so its number finds it even if the list changed.
  function changePokemon(member: TeamMember) {
    updateTeam(id, (t) => ({
      ...t,
      members: t.members.map((m) => (m.pokemonId === member.pokemonId ? member : m)),
    }))
  }

  function removePokemon(index: number) {
    updateTeam(id, (t) => ({ ...t, members: t.members.filter((_, i) => i !== index) }))
  }

  // Runs one randomizer job: shows it as busy, and shows a message if
  // PokéAPI couldn't be reached.
  async function randomize(what: Randomizing, job: () => Promise<void>) {
    setRandomizing(what)
    setRandomError(false)
    try {
      await job()
    } catch (error) {
      console.error(error)
      setRandomError(true)
    } finally {
      setRandomizing(null)
    }
  }

  // Six new random Pokémon, each with a complete set, replacing the team.
  function randomizeTeam() {
    // Replacing a team you worked on can't be undone, so ask first.
    const question = `Replace every Pokémon in "${team?.name}" with random ones?`
    if (team && team.members.length > 0 && !window.confirm(question)) return
    void randomize('team', async () => {
      const members = await Promise.all(randomPokemonIds(TEAM_SIZE).map(randomMember))
      updateTeam(id, (t) => ({ ...t, members }))
    })
  }

  // Swaps one Pokémon for a random one that isn't already in the team.
  function randomizePokemon(oldId: number) {
    void randomize(oldId, async () => {
      const [newId] = randomPokemonIds(1, teamIds)
      const member = await randomMember(newId)
      updateTeam(id, (t) => ({
        ...t,
        members: t.members.map((m) => (m.pokemonId === oldId ? member : m)),
      }))
    })
  }

  // Fills the next empty slot with a random Pokémon.
  function addRandomPokemon() {
    void randomize('new', async () => {
      const [newId] = randomPokemonIds(1, teamIds)
      const member = await randomMember(newId)
      updateTeam(id, (t) =>
        t.members.length < TEAM_SIZE && !t.members.some((m) => m.pokemonId === newId)
          ? { ...t, members: [...t.members, member] }
          : t,
      )
    })
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
      <div className="team-randomizer">
        <button
          type="button"
          className="button"
          onClick={randomizeTeam}
          disabled={isRandomizing}
        >
          {randomizing === 'team' ? 'Randomizing…' : '🎲 Randomize team'}
        </button>
        {randomError && (
          <p className="showdown-help" role="alert">
            Couldn't load the random Pokémon. Check your internet connection and try again.
          </p>
        )}
      </div>
      <ShowdownExport team={team} />

      <ul className="team-slots">
        {team.members.map((member, index) => (
          // A Pokémon can only be in a team once, so its number is a stable key.
          <li key={member.pokemonId}>
            <TeamSlot
              member={member}
              onChange={changePokemon}
              onRemove={() => removePokemon(index)}
              onRandomize={() => randomizePokemon(member.pokemonId)}
              isRandomizing={randomizing === member.pokemonId}
              canRandomize={!isRandomizing}
            />
          </li>
        ))}
        {/* The next free slot can add a Pokémon; the others wait their turn. */}
        {Array.from({ length: emptySlots }, (_, i) => (
          <li key={`empty-${i}`} className="team-slot-empty">
            {i === 0 ? (
              isPicking ? (
                <PokemonPicker
                  excludeIds={teamIds}
                  onPick={addPokemon}
                  onCancel={() => setIsPicking(false)}
                />
              ) : (
                <div className="add-choices">
                  <button
                    type="button"
                    className="add-pokemon"
                    onClick={() => setIsPicking(true)}
                  >
                    <span className="empty-slot" aria-hidden="true" />＋ Add Pokémon
                  </button>
                  <button
                    type="button"
                    className="add-random"
                    onClick={addRandomPokemon}
                    disabled={isRandomizing}
                  >
                    {randomizing === 'new' ? 'Picking…' : '🎲 Random Pokémon'}
                  </button>
                </div>
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
