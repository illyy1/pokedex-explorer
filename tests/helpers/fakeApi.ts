// A small stand-in for PokéAPI and the Smogon builds file, so the
// integration tests run without the internet and always get the same data.

type FakePokemon = {
  id: number
  name: string
  types: string[]
  abilities: { name: string; hidden?: boolean }[]
  moves: string[]
  description: string
}

// The Pokémon in the Pokédex list.
export const FAKE_POKEMON: FakePokemon[] = [
  {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    abilities: [{ name: 'blaze' }],
    moves: ['ember', 'scratch'],
    description: 'The flame on its tail shows the strength of its life force.',
  },
  {
    id: 6,
    name: 'charizard',
    types: ['fire', 'flying'],
    abilities: [{ name: 'blaze' }, { name: 'solar-power', hidden: true }],
    moves: ['air-slash', 'flamethrower', 'roost'],
    description: 'It spits fire that is hot enough to melt boulders.',
  },
  {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    abilities: [{ name: 'static' }, { name: 'lightning-rod', hidden: true }],
    moves: ['hidden-power', 'iron-tail', 'quick-attack', 'thunderbolt', 'volt-tackle'],
    description: 'It stores electricity in the electric sacs on its cheeks.',
  },
  {
    id: 26,
    name: 'raichu',
    types: ['electric'],
    abilities: [{ name: 'static' }],
    moves: ['thunderbolt'],
    description: 'Its long tail serves as a ground to protect itself.',
  },
  {
    id: 150,
    name: 'mewtwo',
    types: ['psychic'],
    abilities: [{ name: 'pressure' }],
    moves: ['psychic', 'recover'],
    description: 'It was created by a scientist after years of horrific gene splicing.',
  },
]

// Any other number (the randomizer can pick any of the 649) gets a plain
// Normal-type Pokémon, so every request has an answer.
function plainPokemon(id: number): FakePokemon {
  return {
    id,
    name: `pokemon-${id}`,
    types: ['normal'],
    abilities: [{ name: 'run-away' }],
    moves: ['bite', 'growl', 'headbutt', 'scratch', 'tackle'],
    description: 'A Pokémon used in tests.',
  }
}

function findPokemon(key: string): FakePokemon | undefined {
  const known = FAKE_POKEMON.find((p) => String(p.id) === key || p.name === key)
  if (known) return known
  const id = Number(key)
  return Number.isInteger(id) && id >= 1 && id <= 649 ? plainPokemon(id) : undefined
}

const API_URL = 'https://pokeapi.co/api/v2'

// Generation 5 damage relations of the types used here.
const TYPES: Record<string, { double: string[]; half: string[]; none: string[] }> = {
  fire: {
    double: ['water', 'ground', 'rock'],
    half: ['fire', 'grass', 'ice', 'bug', 'steel'],
    none: [],
  },
  flying: { double: ['electric', 'ice', 'rock'], half: ['grass', 'fighting', 'bug'], none: ['ground'] },
  electric: { double: ['ground'], half: ['electric', 'flying', 'steel'], none: [] },
  psychic: { double: ['bug', 'ghost', 'dark'], half: ['fighting', 'psychic'], none: [] },
  normal: { double: ['fighting'], half: [], none: ['ghost'] },
}

const BUILDS = {
  Pikachu: {
    ou: {
      'Light Ball Attacker': {
        moves: ['Volt Tackle', 'Thunderbolt', ['Hidden Power Ice', 'Grass Knot'], 'Quick Attack'],
        item: 'Light Ball',
        ability: 'Static',
        nature: 'Hasty',
        evs: { atk: 252, spa: 4, spe: 252 },
      },
    },
  },
  Charizard: {
    uu: {
      'Sun Sweeper': {
        moves: ['Flamethrower', 'Air Slash', 'Roost'],
        item: 'Life Orb',
        ability: 'Solar Power',
        nature: 'Timid',
        evs: { spa: 252, spd: 4, spe: 252 },
      },
    },
  },
}

function pokemonResponse(p: FakePokemon) {
  return {
    id: p.id,
    name: p.name,
    height: 4,
    weight: 60,
    sprites: {
      front_default: `https://raw.githubusercontent.com/sprites/${p.id}.png`,
      other: { 'official-artwork': { front_default: `https://raw.githubusercontent.com/art/${p.id}.png` } },
    },
    types: p.types.map((name) => ({ type: { name } })),
    stats: ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((name) => ({
      base_stat: 50,
      stat: { name },
    })),
    abilities: p.abilities.map((a) => ({ is_hidden: a.hidden ?? false, ability: { name: a.name } })),
    moves: p.moves.map((name) => ({
      move: { name },
      version_group_details: [{ version_group: { name: 'black-white' } }],
    })),
  }
}

// What the fake server answers for one address, or undefined for "not found".
function answer(url: string): unknown {
  if (url === 'https://data.pkmn.cc/sets/gen5.json') return BUILDS
  if (url.startsWith(`${API_URL}/pokemon?`)) {
    return {
      results: FAKE_POKEMON.map((p) => ({ name: p.name, url: `${API_URL}/pokemon/${p.id}/` })),
    }
  }

  const [, kind, key] = url.slice(API_URL.length).split('/')
  const pokemon = findPokemon(key)
  if (kind === 'pokemon' && pokemon) return pokemonResponse(pokemon)
  if (kind === 'pokemon-species' && pokemon) {
    return {
      name: pokemon.name,
      genera: [{ genus: 'Test Pokémon', language: { name: 'en' } }],
      evolves_from_species: null,
      flavor_text_entries: [{ flavor_text: pokemon.description, language: { name: 'en' } }],
    }
  }
  if (kind === 'ability') {
    return { effect_entries: [{ short_effect: `What ${key} does.`, language: { name: 'en' } }] }
  }
  if (kind === 'type' && TYPES[key]) {
    return {
      pokemon: FAKE_POKEMON.filter((p) => p.types.includes(key)).map((p) => ({
        pokemon: { name: p.name, url: `${API_URL}/pokemon/${p.id}/` },
      })),
      damage_relations: {
        double_damage_from: TYPES[key].double.map((name) => ({ name })),
        half_damage_from: TYPES[key].half.map((name) => ({ name })),
        no_damage_from: TYPES[key].none.map((name) => ({ name })),
      },
    }
  }
  return undefined
}

// A replacement for window.fetch. Pass `offline: true` to make every
// request fail, like when there is no internet connection.
export function fakeFetch({ offline = false } = {}) {
  return async (input: RequestInfo | URL): Promise<Response> => {
    if (offline) throw new TypeError('Failed to fetch')
    const url = input instanceof Request ? input.url : String(input)
    const body = answer(url)
    return body === undefined
      ? new Response('Not found', { status: 404 })
      : new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
  }
}
