import { typeStyle } from '../pokemonTypes'

// A round "energy" symbol in the type's color, like the ones on Pokémon cards.
function EnergySymbol({ type, size = 'normal' }: { type?: string; size?: 'small' | 'normal' }) {
  return (
    <span
      className={size === 'small' ? 'energy small' : 'energy'}
      style={typeStyle(type)}
      role="img"
      aria-label={type ? `${type} type` : 'Colorless'}
      title={type ?? 'Colorless'}
    />
  )
}

export default EnergySymbol
