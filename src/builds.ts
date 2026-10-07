import type { Build } from './types'

// Smogon's competitive sets for Generation 5, published by the pkmn project.
const BUILDS_URL = 'https://data.pkmn.cc/sets/gen5.json'

// A value in the file can be one option or a list of alternatives.
type OneOrMore<T> = T | T[]

type StatSpread = Partial<Record<'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe', number>>

type RawSet = {
  moves: OneOrMore<string>[]
  item?: OneOrMore<string>
  ability?: OneOrMore<string>
  nature?: OneOrMore<string>
  evs?: OneOrMore<StatSpread>
}

// Pokémon name -> format -> set name -> set.
type RawBuilds = Record<string, Record<string, Record<string, RawSet>>>

// Format codes in the file, in the order we show them, with readable names.
const FORMATS: Record<string, string> = {
  ubers: 'Ubers',
  ou: 'OU',
  uu: 'UU',
  ru: 'RU',
  nu: 'NU',
  pu: 'PU',
  zu: 'ZU',
  lc: 'LC',
  dreamworldou: 'Dream World OU',
  monotype: 'Monotype',
  '1v1': '1v1',
  doublesou: 'Doubles OU',
  vgc2011: 'VGC 2011',
  vgc2012: 'VGC 2012',
  vgc2013: 'VGC 2013',
  cap: 'CAP',
}
const FORMAT_ORDER = Object.keys(FORMATS)

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
}

// Names in the file are written differently from PokéAPI ("Mr. Mime" vs
// "mr-mime", "Farfetch’d" vs "farfetchd"), so we compare them using only
// lowercase letters and numbers.
function nameKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function joinOptions(value: OneOrMore<string>): string {
  return Array.isArray(value) ? value.join(' / ') : value
}

// { atk: 252, spa: 4, spe: 252 } -> "252 Atk / 4 SpA / 252 Spe"
function formatSpread(evs: OneOrMore<StatSpread>): string {
  // When there are alternative spreads, show the first one.
  const spread = Array.isArray(evs) ? evs[0] : evs
  return Object.entries(spread)
    .map(([stat, value]) => `${value} ${STAT_LABELS[stat] ?? stat}`)
    .join(' / ')
}

function toBuilds(formats: Record<string, Record<string, RawSet>>): Build[] {
  const sortedFormats = Object.keys(formats).sort(
    (a, b) => orderOf(a) - orderOf(b),
  )
  return sortedFormats.flatMap((format) =>
    Object.entries(formats[format]).map(([setName, set]) => ({
      format: FORMATS[format] ?? format.toUpperCase(),
      name: setName,
      moves: set.moves.map(joinOptions),
      item: set.item && joinOptions(set.item),
      ability: set.ability && joinOptions(set.ability),
      nature: set.nature && joinOptions(set.nature),
      evs: set.evs && formatSpread(set.evs),
    })),
  )
}

function orderOf(format: string): number {
  const index = FORMAT_ORDER.indexOf(format)
  return index === -1 ? FORMAT_ORDER.length : index
}

// The file is about 530 KB, so we download it once, the first time it is
// needed, and build a lookup table by name key.
let buildsPromise: Promise<Map<string, Build[]>> | null = null

function loadBuilds(): Promise<Map<string, Build[]>> {
  if (!buildsPromise) {
    buildsPromise = fetch(BUILDS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Builds request failed: ${response.status}`)
        return response.json() as Promise<RawBuilds>
      })
      .then((raw) => new Map(Object.entries(raw).map(([name, f]) => [nameKey(name), toBuilds(f)])))
    // Forget a failed download so the next try asks again.
    buildsPromise.catch(() => {
      buildsPromise = null
    })
  }
  return buildsPromise
}

// Use the species name (for example "deoxys", not "deoxys-normal"),
// because the file has no form names for a Pokémon's default form.
export async function fetchBuilds(speciesName: string): Promise<Build[]> {
  const builds = await loadBuilds()
  return builds.get(nameKey(speciesName)) ?? []
}
