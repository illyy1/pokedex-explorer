import { useState } from 'react'
import { useLocation } from 'react-router'
import { spriteUrl } from '../names'
import { randomPokemonIds } from '../randomTeam'

// How many Pokémon peek in from each side of the screen.
const PER_SIDE = 5

// Pokémon peeking in from the left and right edges of the screen, the left
// ones flipped to face the page. They are picked once, when this appears.
function SpriteColumns() {
  const [ids] = useState(() => randomPokemonIds(PER_SIDE * 2))
  return (
    <>
      <div className="edge-sprites left" aria-hidden="true">
        {ids.slice(0, PER_SIDE).map((id) => (
          <img key={id} src={spriteUrl(id)} alt="" width="96" height="96" />
        ))}
      </div>
      <div className="edge-sprites right" aria-hidden="true">
        {ids.slice(PER_SIDE).map((id) => (
          <img key={id} src={spriteUrl(id)} alt="" width="96" height="96" />
        ))}
      </div>
    </>
  )
}

// Decoration shown behind every page on wide screens. Each page gets a new
// random set: the key makes React start SpriteColumns afresh when the page
// changes. Picking another Pokémon on the same page (/pokedex/6 ->
// /pokedex/25) keeps them, so they don't change on every click. Screen
// readers skip it.
function EdgeSprites() {
  const { pathname } = useLocation()
  // "/pokedex/25" -> "pokedex"
  const page = pathname.split('/')[1]
  return <SpriteColumns key={page} />
}

export default EdgeSprites
