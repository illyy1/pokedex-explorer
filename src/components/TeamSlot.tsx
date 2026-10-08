import { useEffect, useState } from 'react'
import { fetchTeamPokemon, type TeamPokemonData } from '../api'
import { fetchItemNames, fetchTeamBuilds, type TeamBuild } from '../builds'
import { rarityOf } from '../legendary'
import { displayName } from '../names'
import { typeStyle } from '../pokemonTypes'
import { showdownMoveName, showdownPokemonName } from '../showdown'
import {
  evTotal,
  formatEvs,
  MAX_EVS_PER_STAT,
  MAX_EVS_TOTAL,
  NATURES,
  natureLabel,
  STAT_LABELS,
  STATS,
  type Stat,
} from '../stats'
import { MOVES_PER_POKEMON, type TeamMember } from '../teams'
import EnergySymbol from './EnergySymbol'
import RarityMark from './RarityMark'
import Sparkles from './Sparkles'

// In Generation 5, Hidden Power's type depends on the Pokémon, so teams
// choose it as its own move ("Hidden Power Ice"). Any type but Normal.
const HIDDEN_POWER_TYPES = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
]

// The moves a Pokémon can be given: the ones it learns in Generation 5, each
// typed Hidden Power if it learns Hidden Power, and any move already chosen
// (a Smogon build can use an event move PokéAPI doesn't list).
function moveChoices(learnable: string[], chosen: string[]): string[] {
  const moves = new Set(learnable)
  if (moves.has('hidden-power')) {
    for (const type of HIDDEN_POWER_TYPES) moves.add(`hidden-power-${type}`)
  }
  for (const move of chosen) if (move) moves.add(move)
  return [...moves].sort()
}

type Props = {
  member: TeamMember
  // Called with the changed Pokémon when anything about it is picked.
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
  const pokemonName = loaded?.item.name

  // Smogon's builds for this Pokémon and the list of items, from the same
  // download as the builds in the Pokédex.
  const [builds, setBuilds] = useState<{ name: string; list: TeamBuild[] } | null>(null)
  const [itemNames, setItemNames] = useState<string[]>([])
  useEffect(() => {
    if (!pokemonName) return
    let ignore = false
    Promise.all([fetchTeamBuilds(showdownPokemonName(pokemonName)), fetchItemNames()])
      .then(([list, items]) => {
        if (ignore) return
        setBuilds({ name: pokemonName, list })
        setItemNames(items)
      })
      // Without builds the card still works; the build and item lists just stay short.
      .catch((error) => console.error(error))
    return () => {
      ignore = true
    }
  }, [pokemonName])
  const teamBuilds = builds && builds.name === pokemonName ? builds.list : []

  // A newly added Pokémon starts with its first normal (not hidden) ability.
  useEffect(() => {
    if (!loaded || member.ability !== null) return
    const first = loaded.abilities.find((a) => !a.isHidden) ?? loaded.abilities[0]
    if (first) onChange({ ...member, ability: first.name })
  }, [loaded, member, onChange])

  // Copies a whole Smogon build onto this Pokémon.
  function applyBuild(build: TeamBuild) {
    onChange({
      ...member,
      ability: build.ability ?? member.ability,
      item: build.item,
      nature: build.nature,
      evs: { ...build.evs },
      moves: Array.from({ length: MOVES_PER_POKEMON }, (_, i) => build.moves[i] ?? ''),
    })
  }

  // Keeps each stat between 0 and 252, and all of them at 510 or less.
  function changeEv(stat: Stat, text: string) {
    const wanted = Math.round(Number(text)) || 0
    const othersTotal = evTotal(member.evs) - member.evs[stat]
    const value = Math.min(Math.max(wanted, 0), MAX_EVS_PER_STAT, MAX_EVS_TOTAL - othersTotal)
    onChange({ ...member, evs: { ...member.evs, [stat]: value } })
  }

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
            {teamBuilds.length > 0 && (
              <label className="team-field">
                <span>Smogon build</span>
                {/* Picking a build fills in everything below; the list then goes back to its prompt. */}
                <select
                  value=""
                  onChange={(event) => {
                    const build = teamBuilds[Number(event.target.value)]
                    if (build) applyBuild(build)
                  }}
                >
                  <option value="">— Use a build —</option>
                  {[...new Set(teamBuilds.map((b) => b.format))].map((format) => (
                    <optgroup key={format} label={format}>
                      {teamBuilds.map((b, i) =>
                        b.format === format ? (
                          <option key={i} value={i}>
                            {b.name}
                          </option>
                        ) : null,
                      )}
                    </optgroup>
                  ))}
                </select>
              </label>
            )}
            <label className="team-field">
              <span>Item</span>
              <select
                value={member.item}
                onChange={(event) => onChange({ ...member, item: event.target.value })}
              >
                <option value="">— No item —</option>
                {/* Keep a saved item even if it isn't in the list. */}
                {(member.item && !itemNames.includes(member.item)
                  ? [member.item, ...itemNames]
                  : itemNames
                ).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
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
                  {moveChoices(loaded.moves, member.moves)
                    .filter((m) => m === move || !member.moves.includes(m))
                    .map((m) => (
                      <option key={m} value={m}>
                        {showdownMoveName(m)}
                      </option>
                    ))}
                </select>
              ))}
            </fieldset>
            <details className="team-field team-training">
              <summary>
                <span>Nature &amp; EVs</span>
                <small>
                  {[member.nature, formatEvs(member.evs)].filter(Boolean).join(' · ') ||
                    'None set'}
                </small>
              </summary>
              <select
                aria-label="Nature"
                value={member.nature}
                onChange={(event) => onChange({ ...member, nature: event.target.value })}
              >
                <option value="">— Nature —</option>
                {NATURES.map((n) => (
                  <option key={n.name} value={n.name}>
                    {natureLabel(n)}
                  </option>
                ))}
              </select>
              <div className="team-evs">
                {STATS.map((stat) => (
                  <label key={stat}>
                    <span>{STAT_LABELS[stat]}</span>
                    <input
                      type="number"
                      min={0}
                      max={MAX_EVS_PER_STAT}
                      step={4}
                      inputMode="numeric"
                      value={member.evs[stat]}
                      onChange={(event) => changeEv(stat, event.target.value)}
                    />
                  </label>
                ))}
              </div>
              <p className="team-evs-left">
                {MAX_EVS_TOTAL - evTotal(member.evs)} of {MAX_EVS_TOTAL} EVs left
              </p>
            </details>
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
