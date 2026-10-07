import { typeStyle } from '../pokemonTypes'
import type { PokemonInfo, PokemonListItem } from '../types'
import BuildsSection from './BuildsSection'
import FavoriteButton from './FavoriteButton'
import PokemonCard from './PokemonCard'

type Props = {
  selected: PokemonListItem | undefined
  info: PokemonInfo | undefined
  failed: boolean
}

function DetailsPanel({ selected, info, failed }: Props) {
  if (!selected) {
    return <p className="hint">Pick a Pokémon to see its card.</p>
  }

  // While the details are on their way (or if they failed), show an
  // empty card with what the list already knows.
  if (!info) {
    return (
      <div className="details">
        <article className="poke-card" style={typeStyle(selected.types?.[0])}>
          <div className="card-face">
            <header className="card-header">
              <span className="card-stage">No. {selected.id}</span>
              <div className="card-title">
                <h2 className="card-name">{selected.name.replace(/-/g, ' ')}</h2>
              </div>
            </header>
            <div className="card-art card-art-empty">
              {failed ? (
                <p className="status error" role="alert">
                  Couldn't load the details. Check your internet connection, then click the
                  Pokémon again.
                </p>
              ) : (
                <p className="status">Loading…</p>
              )}
            </div>
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="details">
      <div className="details-toolbar">
        <FavoriteButton id={info.id} name={info.name} />
      </div>
      <PokemonCard info={info} />
      <BuildsSection builds={info.builds} />
    </div>
  )
}

export default DetailsPanel
