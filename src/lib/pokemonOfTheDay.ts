import { LAST_POKEMON } from './api'

const MS_PER_DAY = 24 * 60 * 60 * 1000

// Picks a Pokédex number from the date, so it is the same all day and
// changes at midnight. Multiplying by a large prime (7919) makes
// consecutive days land far apart, and every number from 1 to 649
// comes up once before any repeats.
export function pokemonOfTheDay(date = new Date()): number {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY)
  return ((day * 7919) % LAST_POKEMON) + 1
}
