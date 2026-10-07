import type { PokemonInfo, PokemonListItem } from '../types'
import TypeBadge from './TypeBadge'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

// The highest base stat any Pokémon has, used to size the stat bars.
const MAX_STAT = 255

type Props = {
  selected: PokemonListItem | undefined
  info: PokemonInfo | undefined
}

function DetailsPanel({ selected, info }: Props) {
  if (!selected) {
    return <p className="hint">Pick a Pokémon to see its details.</p>
  }

  // Until details come from PokéAPI (task 6), only the sample Pokémon have full info.
  if (!info) {
    return (
      <div className="details">
        <span className="number">#{selected.id}</span>
        <h2 className="name">{selected.name}</h2>
        <p className="hint">More details are coming soon.</p>
      </div>
    )
  }

  return (
    <div className="details">
      <img src={info.artwork} alt={info.name} width="240" height="240" />
      <span className="number">#{info.id}</span>
      <h2 className="name">{info.name}</h2>
      <div className="types">
        {info.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
      <p className="description">{info.description}</p>
      <table className="stats">
        <tbody>
          {info.stats.map((stat) => (
            <tr key={stat.name}>
              <th scope="row">{STAT_LABELS[stat.name] ?? stat.name}</th>
              <td className="stat-value">{stat.value}</td>
              <td className="stat-bar">
                <span style={{ width: `${(stat.value / MAX_STAT) * 100}%` }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DetailsPanel
