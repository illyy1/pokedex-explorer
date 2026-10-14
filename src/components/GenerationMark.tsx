import { generationOf } from '../lib/generations'

// A small "Gen 1" label showing which generation introduced a Pokémon.
// The full size also names the region: "Gen 1 · Kanto".
function GenerationMark({ id, size = 'normal' }: { id: number; size?: 'small' | 'normal' }) {
  const generation = generationOf(id)
  if (!generation) return null
  return (
    <span
      className={size === 'small' ? 'gen-mark small' : 'gen-mark'}
      title={`Introduced in Generation ${generation.number} (${generation.region})`}
    >
      Gen {generation.number}
      {size === 'normal' && ` · ${generation.region}`}
    </span>
  )
}

export default GenerationMark
