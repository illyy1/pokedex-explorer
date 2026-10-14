// PokéAPI names are lowercase with dashes: "mr-mime" -> "Mr Mime",
// "thunder-punch" -> "Thunder Punch".
export function displayName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

// The small picture of a Pokémon, straight from PokéAPI's sprite collection,
// so a team can show its Pokémon without a request for each one.
export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}
