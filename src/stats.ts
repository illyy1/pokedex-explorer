// The six stats, in the order games and Showdown list them.
export const STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const
export type Stat = (typeof STATS)[number]

export const STAT_LABELS: Record<Stat, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
}

// Effort values: extra training points in each stat. A Pokémon can have at
// most 252 in one stat and 510 in all.
export type EvSpread = Record<Stat, number>
export const MAX_EVS_PER_STAT = 252
export const MAX_EVS_TOTAL = 510

export function emptyEvs(): EvSpread {
  return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
}

export function evTotal(evs: EvSpread): number {
  return STATS.reduce((sum, stat) => sum + evs[stat], 0)
}

// { atk: 252, spd: 4, spe: 252 } -> "252 Atk / 4 SpD / 252 Spe"; stats at 0 are left out.
export function formatEvs(evs: Partial<EvSpread>): string {
  return STATS.filter((stat) => (evs[stat] ?? 0) > 0)
    .map((stat) => `${evs[stat]} ${STAT_LABELS[stat]}`)
    .join(' / ')
}

// A nature raises one stat by 10% and lowers another; five change nothing.
type Nature = { name: string; up?: Stat; down?: Stat }

export const NATURES: Nature[] = [
  { name: 'Adamant', up: 'atk', down: 'spa' },
  { name: 'Bashful' },
  { name: 'Bold', up: 'def', down: 'atk' },
  { name: 'Brave', up: 'atk', down: 'spe' },
  { name: 'Calm', up: 'spd', down: 'atk' },
  { name: 'Careful', up: 'spd', down: 'spa' },
  { name: 'Docile' },
  { name: 'Gentle', up: 'spd', down: 'def' },
  { name: 'Hardy' },
  { name: 'Hasty', up: 'spe', down: 'def' },
  { name: 'Impish', up: 'def', down: 'spa' },
  { name: 'Jolly', up: 'spe', down: 'spa' },
  { name: 'Lax', up: 'def', down: 'spd' },
  { name: 'Lonely', up: 'atk', down: 'def' },
  { name: 'Mild', up: 'spa', down: 'def' },
  { name: 'Modest', up: 'spa', down: 'atk' },
  { name: 'Naive', up: 'spe', down: 'spd' },
  { name: 'Naughty', up: 'atk', down: 'spd' },
  { name: 'Quiet', up: 'spa', down: 'spe' },
  { name: 'Quirky' },
  { name: 'Rash', up: 'spa', down: 'spd' },
  { name: 'Relaxed', up: 'def', down: 'spe' },
  { name: 'Sassy', up: 'spd', down: 'spe' },
  { name: 'Serious' },
  { name: 'Timid', up: 'spe', down: 'atk' },
]

// "Adamant (+Atk −SpA)", or "Hardy (no change)".
export function natureLabel(nature: Nature): string {
  if (!nature.up || !nature.down) return `${nature.name} (no change)`
  return `${nature.name} (+${STAT_LABELS[nature.up]} −${STAT_LABELS[nature.down]})`
}
