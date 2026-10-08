import { displayName } from './names'
import { formatEvs } from './stats'
import type { Team } from './teams'

// Pokémon Showdown's team builder, where an exported team is pasted.
export const SHOWDOWN_TEAMBUILDER_URL = 'https://play.pokemonshowdown.com/teambuilder'

// Pokémon whose Showdown name isn't just the PokéAPI name with capitals.
// PokéAPI adds the default form to some names ("deoxys-normal"), which
// Showdown leaves out ("Deoxys").
const POKEMON_NAMES: Record<string, string> = {
  'nidoran-f': 'Nidoran-F',
  'nidoran-m': 'Nidoran-M',
  'mr-mime': 'Mr. Mime',
  farfetchd: 'Farfetch’d',
  'ho-oh': 'Ho-Oh',
  'deoxys-normal': 'Deoxys',
  'wormadam-plant': 'Wormadam',
  'mime-jr': 'Mime Jr.',
  'porygon-z': 'Porygon-Z',
  'giratina-altered': 'Giratina',
  'shaymin-land': 'Shaymin',
  'basculin-red-striped': 'Basculin',
  'darmanitan-standard': 'Darmanitan',
  'frillish-male': 'Frillish',
  'jellicent-male': 'Jellicent',
  'tornadus-incarnate': 'Tornadus',
  'thundurus-incarnate': 'Thundurus',
  'landorus-incarnate': 'Landorus',
  'keldeo-ordinary': 'Keldeo',
  'meloetta-aria': 'Meloetta',
}

// Moves whose Showdown name keeps a dash or other punctuation.
const MOVE_NAMES: Record<string, string> = {
  'double-edge': 'Double-Edge',
  'self-destruct': 'Self-Destruct',
  'soft-boiled': 'Soft-Boiled',
  'mud-slap': 'Mud-Slap',
  'lock-on': 'Lock-On',
  'will-o-wisp': 'Will-O-Wisp',
  'x-scissor': 'X-Scissor',
  'u-turn': 'U-turn',
  'v-create': 'V-create',
  'wake-up-slap': 'Wake-Up Slap',
  'vice-grip': 'Vise Grip',
  'roar-of-time': 'Roar of Time',
}

export function showdownPokemonName(name: string): string {
  return POKEMON_NAMES[name] ?? displayName(name)
}

export function showdownMoveName(name: string): string {
  return MOVE_NAMES[name] ?? displayName(name)
}

// Every Generation 1-5 ability is just its PokéAPI name with capitals.
export function showdownAbilityName(name: string): string {
  return displayName(name)
}

// Writes a team in Showdown's text format, the one its "Import from text"
// reads, with a blank line between Pokémon:
//   Pikachu @ Light Ball
//   Ability: Lightning Rod
//   EVs: 4 Atk / 252 SpA / 252 Spe
//   Timid Nature
//   - Thunderbolt
// Anything not chosen (item, EVs, nature, empty move slots) is left out.
// `nameOf` turns a Pokémon number into its PokéAPI name.
export function teamToShowdownText(team: Team, nameOf: (id: number) => string): string {
  return team.members
    .map((member) => {
      const name = showdownPokemonName(nameOf(member.pokemonId))
      const lines = [member.item ? `${name} @ ${member.item}` : name]
      if (member.ability) lines.push(`Ability: ${showdownAbilityName(member.ability)}`)
      const evs = formatEvs(member.evs)
      if (evs) lines.push(`EVs: ${evs}`)
      if (member.nature) lines.push(`${member.nature} Nature`)
      for (const move of member.moves) {
        if (move) lines.push(`- ${showdownMoveName(move)}`)
      }
      return lines.join('\n')
    })
    .join('\n\n')
}
