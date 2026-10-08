import { useEffect, useState } from 'react'
import { fetchTeamPokemon, type TeamPokemonData } from '../api'
import { rarityOf } from '../legendary'
import { displayName } from '../names'
import { typeStyle } from '../pokemonTypes'
import type { TeamMember } from '../teams'
import EnergySymbol from './EnergySymbol'
import RarityMark from './RarityMark'
import Sparkles from './Sparkles'

type Props = {
  member: TeamMember
  // Called with the changed Pokémon when its ability or a move is picked.
  onChange: (member: TeamMember) => void
  onRemove: () => void
}

// One Pokémon in a team, shown as a small trading card.
function TeamSlot({ member, onChange, onRemove }: Props) {
  const [data, setData] = useState<TeamPokemonData | null>(null)
  const [failed, setFailed] = useState(false)
  // Goes up when "Try again" is clicked, to load the Pokémon again.
  const [retryCount, setRetryCount] = useState(0)
  const rarity = rarityOf(member.pokemonId)

  useEffect(() => {
    // Ignore the answer if this slot changed before it arrived.
    let ignore = false
    fetchTeamPokemon(member.pokemonId)
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [member.pokemonId, retryCount])

  const loaded = data?.item.id === member.pokemonId ? data : null
  const item = loaded?.item ?? null

  // A newly added Pokémon starts with its first normal (not hidden) ability.
  useEffect(() => {
    if (!loaded || member.ability !== null) return
    const first = loaded.abilities.find((a) => !a.isHidden) ?? loaded.abilities[0]
    if (first) onChange({ ...member, ability: first.name })
  }, [loaded, member, onChange])

  function changeMove(slot: number, move: string) {
    const moves = member.moves.map((m, i) => (i === slot ? move : m))
    onChange({ ...member, moves })
  }

  return (
    <article
      className={rarity ? 'poke-card team-card holo-rare' : 'poke-card team-card'}
      style={typeStyle(item?.types?.[0])}
    >
      <div className="card-face">
        {rarity && <Sparkles />}
        <header className="card-header">
          <div className="card-title">
            <h2 className="card-name">
              {item ? displayName(item.name) : `No. ${member.pokemonId}`}{' '}
              {rarity && <RarityMark rarity={rarity} size="small" />}
            </h2>
            {item?.hp !== undefined && (
              <span className="card-hp">
                {item.hp} <small>HP</small>
              </span>
            )}
            {item?.types?.map((type) => (
              <EnergySymbol key={type} type={type} />
            ))}
          </div>
        </header>
        <div className="card-art">
          {item?.artwork ? (
            <img src={item.artwork} alt={item.name} width="200" height="200" />
          ) : failed ? (
            <div className="status error" role="alert">
              <p>Couldn't load this Pokémon.</p>
              <button
                type="button"
                className="retry-button"
                onClick={() => {
                  setFailed(false)
                  setRetryCount((count) => count + 1)
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <p className="status">Loading…</p>
          )}
        </div>
        {loaded && (
          <div className="team-options">
            <label className="team-field">
              <span>Ability</span>
              <select
                value={member.ability ?? ''}
                onChange={(event) => onChange({ ...member, ability: event.target.value })}
              >
                {loaded.abilities.map((a) => (
                  <option key={a.name} value={a.name}>
                    {displayName(a.name)}
                    {a.isHidden ? ' (hidden)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="team-field team-moves">
              <legend>Moves</legend>
              {member.moves.map((move, slot) => (
                <select
                  key={slot}
                  aria-label={`Move ${slot + 1}`}
                  value={move}
                  onChange={(event) => changeMove(slot, event.target.value)}
                >
                  <option value="">— Move —</option>
                  {/* A move chosen in another slot is not offered again. */}
                  {loaded.moves
                    .filter((m) => m === move || !member.moves.includes(m))
                    .map((m) => (
                      <option key={m} value={m}>
                        {displayName(m)}
                      </option>
                    ))}
                </select>
              ))}
            </fieldset>
          </div>
        )}
        <button type="button" className="team-remove" onClick={onRemove}>
          Remove {item ? displayName(item.name) : 'Pokémon'}
        </button>
      </div>
    </article>
  )
}

export default TeamSlot
