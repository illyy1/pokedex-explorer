import { TYPE_COLORS } from '../pokemonTypes'

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="type-badge" style={{ background: TYPE_COLORS[type] ?? '#777' }}>
      {type}
    </span>
  )
}

export default TypeBadge
