import type { CSSProperties } from 'react'

// The 18 Pokémon types and the color used for each one's label.
export const TYPE_COLORS: Record<string, string> = {
  normal: '#9fa19f',
  fire: '#e62829',
  water: '#2980ef',
  electric: '#d4a600',
  grass: '#3fa129',
  ice: '#3dcef3',
  fighting: '#ff8000',
  poison: '#9141cb',
  ground: '#915121',
  flying: '#81b9ef',
  psychic: '#ef4179',
  bug: '#91a119',
  rock: '#afa981',
  ghost: '#704170',
  dragon: '#5060e1',
  dark: '#624d4e',
  steel: '#60a1b8',
  fairy: '#ef70ef',
}

export const ALL_TYPES = Object.keys(TYPE_COLORS)

// Sets the --type CSS variable that colors a card, row or energy symbol.
// Pokémon without a known type get a plain "colorless" card.
export function typeStyle(type: string | undefined): CSSProperties {
  return { '--type': (type && TYPE_COLORS[type]) || '#b8b2a7' } as CSSProperties
}
