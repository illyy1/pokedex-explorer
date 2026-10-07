import { formatMultiplier } from '../matchups'
import type { Matchup, Matchups } from '../types'
import TypeBadge from './TypeBadge'

function MatchupRow({ label, matchups }: { label: string; matchups: Matchup[] }) {
  return (
    <div className="matchup-row">
      <span className="matchup-label">{label}</span>
      <span className="matchup-types">
        {matchups.length === 0
          ? 'None'
          : matchups.map((m) => (
              <span key={m.type} className="matchup">
                <TypeBadge type={m.type} />
                {m.multiplier !== 0 && (
                  <span className="multiplier">{formatMultiplier(m.multiplier)}</span>
                )}
              </span>
            ))}
      </span>
    </div>
  )
}

function MatchupsSection({ matchups }: { matchups: Matchups }) {
  return (
    <section className="matchups" aria-label="Type matchups">
      <h3>Type matchups</h3>
      <MatchupRow label="Weak to" matchups={matchups.weak} />
      <MatchupRow label="Resists" matchups={matchups.resist} />
      {matchups.immune.length > 0 && (
        <MatchupRow
          label="Immune to"
          matchups={matchups.immune.map((type) => ({ type, multiplier: 0 }))}
        />
      )}
    </section>
  )
}

export default MatchupsSection
