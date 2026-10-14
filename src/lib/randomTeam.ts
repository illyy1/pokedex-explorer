import { fetchTeamPokemon, LAST_POKEMON } from './api'
import { fetchItemNames, fetchTeamBuilds } from './builds'
import { showdownPokemonName } from './showdown'
import { emptyEvs, NATURES, STATS } from './stats'
import { MOVES_PER_POKEMON, type TeamMember } from './teams'

// EVs for a random Pokémon without a Smogon build: the same in every stat,
// like Pokémon Showdown's Random Battles (6 × 84 = 504 of the 510).
const EVEN_EVS = 84

function pick<T>(list: T[]): T | undefined {
  return list[Math.floor(Math.random() * list.length)]
}

// `count` different items from `list`, in random order.
function sample<T>(list: T[], count: number): T[] {
  const copy = [...list]
  // Shuffle the first `count` places (Fisher–Yates).
  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, count)
}

// `count` different Pokémon numbers from 1 to LAST_POKEMON, picked at random,
// leaving out the numbers in `exclude`.
export function randomPokemonIds(count: number, exclude: number[] = []): number[] {
  const ids = new Set<number>()
  while (ids.size < count && ids.size + exclude.length < LAST_POKEMON) {
    const id = 1 + Math.floor(Math.random() * LAST_POKEMON)
    if (!exclude.includes(id)) ids.add(id)
  }
  return [...ids]
}

// A ready-to-battle team member for this Pokémon: one of its Smogon builds
// at random, or, if it has none, a random ability, item, nature and four
// moves it can learn in Generation 5, with even EVs.
export async function randomMember(pokemonId: number): Promise<TeamMember> {
  const pokemon = await fetchTeamPokemon(pokemonId)
  // Without the builds file the Pokémon still gets a random set, just no item.
  const [builds, itemNames] = await Promise.all([
    fetchTeamBuilds(showdownPokemonName(pokemon.item.name)).catch(() => []),
    fetchItemNames().catch(() => []),
  ])
  const randomAbility = pick(pokemon.abilities)?.name ?? null
  const padMoves = (moves: string[]) =>
    Array.from({ length: MOVES_PER_POKEMON }, (_, i) => moves[i] ?? '')

  const build = pick(builds)
  if (build) {
    return {
      pokemonId,
      ability: build.ability ?? randomAbility,
      item: build.item,
      nature: build.nature,
      evs: { ...build.evs },
      moves: padMoves(build.moves),
    }
  }

  const evs = emptyEvs()
  for (const stat of STATS) evs[stat] = EVEN_EVS
  return {
    pokemonId,
    ability: randomAbility,
    item: pick(itemNames) ?? '',
    nature: pick(NATURES)?.name ?? '',
    evs,
    moves: padMoves(sample(pokemon.moves, MOVES_PER_POKEMON)),
  }
}
