import { emptyEvs, formatEvs, MAX_EVS_PER_STAT, MAX_EVS_TOTAL, STATS, type EvSpread } from './stats'
import type { Build } from './types'

// Smogon's competitive sets for Generation 5, published by the pkmn project.
const BUILDS_URL = 'https://data.pkmn.cc/sets/gen5.json'

// A value in the file can be one option or a list of alternatives.
type OneOrMore<T> = T | T[]

type RawSet = {
  moves: OneOrMore<string>[]
  item?: OneOrMore<string>
  ability?: OneOrMore<string>
  nature?: OneOrMore<string>
  evs?: OneOrMore<Partial<EvSpread>>
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

// Names in the file are written differently from PokéAPI ("Mr. Mime" vs
// "mr-mime", "Farfetch’d" vs "farfetchd"), so we compare them using only
// lowercase letters and numbers.
function nameKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// "U-turn" -> "u-turn", "Hidden Power Ice" -> "hidden-power-ice": the way
// PokéAPI writes move and ability names, which is how teams store them.
function toApiName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function joinOptions(value: OneOrMore<string>): string {
  return Array.isArray(value) ? value.join(' / ') : value
}

// When the file lists alternatives, a team uses the first one.
function firstOption<T>(value: OneOrMore<T>): T {
  return Array.isArray(value) ? value[0] : value
}

function sortedFormats(formats: Record<string, Record<string, RawSet>>): string[] {
  return Object.keys(formats).sort((a, b) => orderOf(a) - orderOf(b))
}

function orderOf(format: string): number {
  const index = FORMAT_ORDER.indexOf(format)
  return index === -1 ? FORMAT_ORDER.length : index
}

function formatName(format: string): string {
  return FORMATS[format] ?? format.toUpperCase()
}

function toBuilds(formats: Record<string, Record<string, RawSet>>): Build[] {
  return sortedFormats(formats).flatMap((format) =>
    Object.entries(formats[format]).map(([setName, set]) => ({
      format: formatName(format),
      name: setName,
      moves: set.moves.map(joinOptions),
      item: set.item && joinOptions(set.item),
      ability: set.ability && joinOptions(set.ability),
      nature: set.nature && joinOptions(set.nature),
      // When there are alternative spreads, show the first one.
      evs: set.evs && formatEvs(firstOption(set.evs)),
    })),
  )
}

// A Smogon set turned into exactly what a team member holds: one choice for
// everything, with moves and the ability written the PokéAPI way.
export type TeamBuild = {
  format: string
  name: string
  ability: string | null
  item: string
  nature: string
  evs: EvSpread
  moves: string[]
}

function toTeamBuild(format: string, setName: string, set: RawSet): TeamBuild {
  // Each move slot can list alternatives; take the first one not already picked.
  const moves: string[] = []
  for (const slot of set.moves) {
    const options = (Array.isArray(slot) ? slot : [slot]).map(toApiName)
    const move = options.find((m) => !moves.includes(m))
    if (move) moves.push(move)
  }
  // A few sets add up to a little over 510, so stop at the limit.
  const evs = emptyEvs()
  const spread = set.evs ? firstOption(set.evs) : {}
  let left = MAX_EVS_TOTAL
  for (const stat of STATS) {
    const wanted = Math.max(Math.round(spread[stat] ?? 0), 0)
    evs[stat] = Math.min(wanted, MAX_EVS_PER_STAT, left)
    left -= evs[stat]
  }
  return {
    format: formatName(format),
    name: setName,
    ability: set.ability ? toApiName(firstOption(set.ability)) : null,
    item: set.item ? firstOption(set.item) : '',
    nature: set.nature ? firstOption(set.nature) : '',
    evs,
    moves,
  }
}

type LoadedBuilds = {
  // Name key -> builds, for the details panel.
  builds: Map<string, Build[]>
  // Name key -> builds ready to put on a team.
  teamBuilds: Map<string, TeamBuild[]>
  // Every item any set holds, A to Z, in Showdown's spelling.
  itemNames: string[]
}

// The file is about 530 KB, so we download it once, the first time it is
// needed, and build lookup tables by name key.
let buildsPromise: Promise<LoadedBuilds> | null = null

function loadBuilds(): Promise<LoadedBuilds> {
  if (!buildsPromise) {
    buildsPromise = fetch(BUILDS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Builds request failed: ${response.status}`)
        return response.json() as Promise<RawBuilds>
      })
      .then((raw) => {
        const builds = new Map<string, Build[]>()
        const teamBuilds = new Map<string, TeamBuild[]>()
        const items = new Set<string>()
        for (const [name, formats] of Object.entries(raw)) {
          builds.set(nameKey(name), toBuilds(formats))
          teamBuilds.set(
            nameKey(name),
            sortedFormats(formats).flatMap((format) =>
              Object.entries(formats[format]).map(([setName, set]) =>
                toTeamBuild(format, setName, set),
              ),
            ),
          )
          for (const sets of Object.values(formats)) {
            for (const set of Object.values(sets)) {
              if (!set.item) continue
              for (const item of Array.isArray(set.item) ? set.item : [set.item]) items.add(item)
            }
          }
        }
        return { builds, teamBuilds, itemNames: [...items].sort() }
      })
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
  const { builds } = await loadBuilds()
  return builds.get(nameKey(speciesName)) ?? []
}

// Same as fetchBuilds, but ready to put on a team. Showdown's name for the
// Pokémon (for example "Deoxys") matches the file.
export async function fetchTeamBuilds(showdownName: string): Promise<TeamBuild[]> {
  const { teamBuilds } = await loadBuilds()
  return teamBuilds.get(nameKey(showdownName)) ?? []
}

// The items offered in the Team Builder: the 94 that Smogon's Generation 5
// sets use, which covers the competitive ones.
export async function fetchItemNames(): Promise<string[]> {
  const { itemNames } = await loadBuilds()
  return itemNames
}
