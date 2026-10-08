import type { Rarity } from '../legendary'

// The rainbow "✦ Legendary" / "✦ Mythical" mark next to a Pokémon's name.
function RarityMark({ rarity, size = 'normal' }: { rarity: Rarity; size?: 'small' | 'normal' }) {
  return (
    <span className={size === 'small' ? 'rarity-mark small' : 'rarity-mark'}>
      ✦ {rarity === 'legendary' ? 'Legendary' : 'Mythical'}
    </span>
  )
}

export default RarityMark
