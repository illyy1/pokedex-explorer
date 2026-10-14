import { fetchBuilds } from './builds'
import { typeMatchups } from './matchups'
import type { PokemonInfo, PokemonListItem } from './types'

const API_URL = 'https://pokeapi.co/api/v2'

// Genesect, the last Pokémon of Generation 5.
export const LAST_POKEMON = 649
export const PAGE_SIZE = 50

type ListResponse = {
  results: { name: string; url: string }[]
}

// Only the parts of the /pokemon/{id} response that we use.
type PokemonResponse = {
  id: number
  name: string
  // In decimetres and hectograms.
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other: { 'official-artwork': { front_default: string | null } }
  }
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { is_hidden: boolean; ability: { name: string } }[]
  moves: { move: { name: string }; version_group_details: { version_group: { name: string } }[] }[]
}

// Only the parts of the /ability/{name} response that we use.
type AbilityResponse = {
  effect_entries: { short_effect: string; language: { name: string } }[]
}

// Only the parts of the /type/{name} response that we use.
type TypeResponse = {
  pokemon: { pokemon: { name: string; url: string } }[]
  damage_relations: {
    double_damage_from: { name: string }[]
    half_damage_from: { name: string }[]
    no_damage_from: { name: string }[]
  }
}

export type TypeData = {
  name: string
  // Numbers of the Pokémon (up to LAST_POKEMON) that have this type.
  pokemonIds: number[]
  // Attacking types that do ×2, ×½ and ×0 damage to this type.
  doubleDamageFrom: string[]
  halfDamageFrom: string[]
  noDamageFrom: string[]
}

// Only the parts of the /pokemon-species/{id} response that we use.
type SpeciesResponse = {
  name: string
  genera: { genus: string; language: { name: string } }[]
  evolves_from_species: { name: string } | null
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`PokéAPI request failed: ${response.status}`)
  }
  return response.json()
}

// The list endpoint has no id field, so we read it from the end of the url,
// for example "https://pokeapi.co/api/v2/pokemon/25/" -> 25.
function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

// The name and number of every Pokémon up to LAST_POKEMON, in one request.
// Used for searching and to know which Pokémon come next in the list.
export async function fetchPokemonIndex(): Promise<PokemonListItem[]> {
  const list = await getJson<ListResponse>(`${API_URL}/pokemon?limit=${LAST_POKEMON}&offset=0`)
  return list.results.map((result) => ({
    id: idFromUrl(result.url),
    name: result.name,
  }))
}

// The index has no pictures or types, so we request each Pokémon's own data.
export async function fetchListItem(id: number): Promise<PokemonListItem> {
  return toListItem(await getJson<PokemonResponse>(`${API_URL}/pokemon/${id}`))
}

function toListItem(p: PokemonResponse): PokemonListItem {
  return {
    id: p.id,
    name: p.name,
    sprite: p.sprites.front_default ?? undefined,
    artwork: p.sprites.other['official-artwork'].front_default ?? undefined,
    types: p.types.map((t) => t.type.name),
    hp: p.stats.find((s) => s.stat.name === 'hp')?.base_stat,
  }
}

// The games of Generation 5. The Team Builder only offers moves a Pokémon
// can learn in these, to match the app's Generations 1–5 and the Gen 5 builds.
const GEN5_VERSION_GROUPS = ['black-white', 'black-2-white-2']

// What the Team Builder needs to know about one Pokémon.
export type TeamPokemonData = {
  item: PokemonListItem
  abilities: { name: string; isHidden: boolean }[]
  // Move names, sorted alphabetically.
  moves: string[]
}

// Each Pokémon is requested at most once while the page is open.
const teamPokemonCache = new Map<number, Promise<TeamPokemonData>>()

export function fetchTeamPokemon(id: number): Promise<TeamPokemonData> {
  let promise = teamPokemonCache.get(id)
  if (!promise) {
    promise = getJson<PokemonResponse>(`${API_URL}/pokemon/${id}`).then((p) => ({
      item: toListItem(p),
      abilities: p.abilities.map((a) => ({ name: a.ability.name, isHidden: a.is_hidden })),
      moves: p.moves
        .filter((m) =>
          m.version_group_details.some((d) => GEN5_VERSION_GROUPS.includes(d.version_group.name)),
        )
        .map((m) => m.move.name)
        .sort(),
    }))
    promise.catch(() => teamPokemonCache.delete(id))
    teamPokemonCache.set(id, promise)
  }
  return promise
}

// A type's data never changes, so each type is requested at most once.
// We keep the promise (not the result) so two requests at the same time share it.
const typeCache = new Map<string, Promise<TypeData>>()

export function fetchTypeData(name: string): Promise<TypeData> {
  let promise = typeCache.get(name)
  if (!promise) {
    promise = getJson<TypeResponse>(`${API_URL}/type/${name}`).then((t) => ({
      name,
      pokemonIds: t.pokemon
        .map((entry) => idFromUrl(entry.pokemon.url))
        .filter((id) => id <= LAST_POKEMON),
      doubleDamageFrom: t.damage_relations.double_damage_from.map((d) => d.name),
      halfDamageFrom: t.damage_relations.half_damage_from.map((d) => d.name),
      noDamageFrom: t.damage_relations.no_damage_from.map((d) => d.name),
    }))
    // Forget failed requests so the next try asks again.
    promise.catch(() => typeCache.delete(name))
    typeCache.set(name, promise)
  }
  return promise
}

// Many Pokémon share abilities, so each explanation is also requested only once.
const abilityCache = new Map<string, Promise<string>>()

function fetchAbilityEffect(name: string): Promise<string> {
  let promise = abilityCache.get(name)
  if (!promise) {
    promise = getJson<AbilityResponse>(`${API_URL}/ability/${name}`).then(
      (a) =>
        a.effect_entries.find((e) => e.language.name === 'en')?.short_effect ??
        'No description available.',
    )
    promise.catch(() => abilityCache.delete(name))
    abilityCache.set(name, promise)
  }
  return promise
}

// The text comes from the old games, so it has line breaks (\n, \f)
// and the spelling "POKéMON". We tidy both up.
function englishDescription(species: SpeciesResponse): string {
  const entry = species.flavor_text_entries.find((e) => e.language.name === 'en')
  if (!entry) return 'No description available.'
  return entry.flavor_text.replace(/\s+/g, ' ').replace(/POKéMON/g, 'Pokémon')
}

// The Pokémon's own data, plus the data of each of its types and abilities,
// which we can only ask for once we know what they are.
async function fetchPokemonWithExtras(id: number) {
  const p = await getJson<PokemonResponse>(`${API_URL}/pokemon/${id}`)
  const [typeData, abilityEffects] = await Promise.all([
    Promise.all(p.types.map((t) => fetchTypeData(t.type.name))),
    Promise.all(p.abilities.map((a) => fetchAbilityEffect(a.ability.name))),
  ])
  return { p, typeData, abilityEffects }
}

export async function fetchPokemonInfo(id: number): Promise<PokemonInfo> {
  // The species request is sent at the same time as the others.
  const speciesPromise = getJson<SpeciesResponse>(`${API_URL}/pokemon-species/${id}`)
  // Builds come from a different website. If they fail, the rest of the
  // details still show, with a message in the builds section.
  const buildsPromise = speciesPromise
    .then((species) => fetchBuilds(species.name))
    .catch((error) => {
      console.error(error)
      return null
    })
  const [{ p, typeData, abilityEffects }, species, builds] = await Promise.all([
    fetchPokemonWithExtras(id),
    speciesPromise,
    buildsPromise,
  ])
  return {
    id: p.id,
    name: p.name,
    types: p.types.map((t) => t.type.name),
    artwork: p.sprites.other['official-artwork'].front_default ?? p.sprites.front_default ?? '',
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    description: englishDescription(species),
    genus: species.genera.find((g) => g.language.name === 'en')?.genus ?? 'Pokémon',
    evolvesFrom: species.evolves_from_species?.name ?? null,
    heightDm: p.height,
    weightHg: p.weight,
    matchups: typeMatchups(typeData),
    abilities: p.abilities.map((a, i) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
      effect: abilityEffects[i],
    })),
    builds,
  }
}
