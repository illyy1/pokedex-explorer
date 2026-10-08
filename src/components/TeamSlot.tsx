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
  onRemove: () => void
}

// One Pokémon in a team, shown as a small trading card.
function TeamSlot({ member, onRemove }: Props) {
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

  const item = data?.item.id === member.pokemonId ? data.item : null

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
        <button type="button" className="team-remove" onClick={onRemove}>
          Remove {item ? displayName(item.name) : 'Pokémon'}
        </button>
      </div>
    </article>
  )
}

export default TeamSlot
