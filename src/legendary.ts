// Legendary and mythical Pokémon up to #649, taken from the is_legendary and
// is_mythical flags in PokéAPI's pokemon-species data. They are written out
// here so the list can show the mark without one extra request per row.

const LEGENDARY = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481,
  482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645, 646,
])

const MYTHICAL = new Set([151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649])

export type Rarity = 'legendary' | 'mythical'

export function rarityOf(id: number): Rarity | null {
  if (LEGENDARY.has(id)) return 'legendary'
  if (MYTHICAL.has(id)) return 'mythical'
  return null
}
