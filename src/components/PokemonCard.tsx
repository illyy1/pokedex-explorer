import { LAST_POKEMON } from '../api'
import { rarityOf } from '../legendary'
import { formatMultiplier } from '../matchups'
import { typeStyle } from '../pokemonTypes'
import type { Matchup, PokemonInfo } from '../types'
import { formatLength, formatWeight } from '../units'
import { useTilt } from '../useTilt'
import EnergySymbol from './EnergySymbol'
import RarityMark from './RarityMark'
import Sparkles from './Sparkles'
import TypeBadge from './TypeBadge'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
}

// On a card, each attack shows its energy cost as dots. Here the dots show
// how big the stat is: one dot per 50 points (the highest base stat is 255).
function statDots(value: number): number {
  return Math.min(6, Math.max(1, Math.ceil(value / 50)))
}

// "mr-mime" -> "Mr Mime"
function displayName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

// The bottom row of a card: weakness, resistance and (instead of retreat cost) immunity.
function MatchupCell({ label, matchups }: { label: string; matchups: Matchup[] }) {
  return (
    <div className="card-matchup">
      <span className="card-matchup-label">{label}</span>
      <span className="card-matchup-types">
        {matchups.length === 0 && <span className="card-none">none</span>}
        {matchups.map((m) => (
          <span key={m.type} className="card-matchup-type">
            <TypeBadge type={m.type} />
            {m.multiplier !== 0 && <span>{formatMultiplier(m.multiplier)}</span>}
          </span>
        ))}
      </span>
    </div>
  )
}

// The details of one Pokémon, laid out like an original Pokémon trading card.
function PokemonCard({ info, tilt3d = true }: { info: PokemonInfo; tilt3d?: boolean }) {
  const hp = info.stats.find((s) => s.name === 'hp')?.value
  const otherStats = info.stats.filter((s) => s.name !== 'hp')
  const tiltRef = useTilt<HTMLDivElement>(tilt3d)
  // Legendary and mythical Pokémon get a sparkly rainbow card.
  const rarity = rarityOf(info.id)

  return (
    // The wrapper follows the mouse; the card inside tilts in 3D.
    <div ref={tiltRef} className="tilt-wrapper">
      <article
        className={rarity ? 'poke-card holo-rare' : 'poke-card'}
        style={typeStyle(info.types[0])}
        aria-label={`${info.name} card`}
      >
        <div className="card-face">
          {rarity && <Sparkles />}
          <header className="card-header">
            <span className="card-stage">
              {info.evolvesFrom ? `Evolves from ${displayName(info.evolvesFrom)}` : 'Basic Pokémon'}
            </span>
            <div className="card-title">
              <h2 className="card-name">
                {displayName(info.name)} {rarity && <RarityMark rarity={rarity} />}
              </h2>
              {hp !== undefined && (
                <span className="card-hp">
                  {hp} <small>HP</small>
                </span>
              )}
              {info.types.map((type) => (
                <EnergySymbol key={type} type={type} />
              ))}
            </div>
          </header>

          <div className="card-art">
            <img src={info.artwork} alt={info.name} width="300" height="300" />
          </div>
          <p className="card-strip">
            {info.genus}. Length: {formatLength(info.heightDm)}, Weight: {formatWeight(info.weightHg)}
          </p>

          <div className="card-body">
            <div className="card-types">
              {info.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>

            {info.abilities.map((ability) => (
              <div key={ability.name} className="card-power">
                <p>
                  <span className="card-power-label">
                    {ability.isHidden ? 'Hidden Ability:' : 'Pokémon Power:'}
                  </span>{' '}
                  <span className="card-power-name">{displayName(ability.name)}</span>
                </p>
                <p className="card-power-text">{ability.effect}</p>
              </div>
            ))}

            <ul className="card-attacks" aria-label="Base stats">
              {otherStats.map((stat) => (
                <li key={stat.name} className="card-attack">
                  <span className="card-cost" aria-hidden="true">
                    {Array.from({ length: statDots(stat.value) }, (_, i) => (
                      <EnergySymbol key={i} size="small" />
                    ))}
                  </span>
                  <span className="card-attack-name">{STAT_LABELS[stat.name] ?? stat.name}</span>
                  <span className="card-attack-damage">{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-matchups">
            <MatchupCell label="weakness" matchups={info.matchups.weak} />
            <MatchupCell label="resistance" matchups={info.matchups.resist} />
            <MatchupCell
              label="immune"
              matchups={info.matchups.immune.map((type) => ({ type, multiplier: 0 }))}
            />
          </div>

          <p className="card-flavor">
            {info.description} <span className="card-flavor-number">No. {info.id}</span>
          </p>
          <footer className="card-footer">
            <span>Data: PokéAPI</span>
            <span>
              {info.id}/{LAST_POKEMON}
            </span>
          </footer>
        </div>
      </article>
    </div>
  )
}

export default PokemonCard
