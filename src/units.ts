// PokéAPI gives height in decimetres and weight in hectograms. The old
// Pokémon cards use feet and pounds, for example "Length: 3'7", Weight: 66 lbs."

export function formatLength(decimetres: number): string {
  const totalInches = Math.round(decimetres * 3.937)
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`
}

export function formatWeight(hectograms: number): string {
  const pounds = hectograms * 0.220462
  // Very light Pokémon (like Gastly) would round to 0, so keep one decimal.
  return `${pounds < 10 ? Math.round(pounds * 10) / 10 : Math.round(pounds)} lbs.`
}
