import { isTouchScreen, requestMotionAccess, useMotionAccess } from '../motionAccess'
import { typeStyle } from '../pokemonTypes'
import type { PokemonInfo, PokemonListItem } from '../types'
import { useStoredToggle } from '../useStoredToggle'
import BuildsSection from './BuildsSection'
import FavoriteButton from './FavoriteButton'
import PokemonCard from './PokemonCard'

type Props = {
  selected: PokemonListItem | undefined
  info: PokemonInfo | undefined
  failed: boolean
}

function DetailsPanel({ selected, info, failed }: Props) {
  // The 3D tilt is on unless the user turned it off; the choice is remembered.
  const [tilt3d, toggleTilt3d] = useStoredToggle('tilt3d', true)
  // On phones the card tilts with the motion sensor. iPhones and iPads ask
  // before a page may read it, and only when the person taps something, so
  // until then the button offers "Tap to start".
  const motionAccess = useMotionAccess()
  const touchScreen = isTouchScreen()
  const needsMotionTap = tilt3d && touchScreen && motionAccess === 'unknown'
  // A phone that said no to motion access, or has no motion sensor, can't tilt the card.
  const motionBlocked =
    touchScreen && (motionAccess === 'denied' || motionAccess === 'unsupported')

  async function handleToggle3d() {
    if (needsMotionTap) {
      // This tap asks for access. A "no" shows the button as not available.
      await requestMotionAccess()
      return
    }
    toggleTilt3d()
    // Turning it on with a tap is also a good moment to ask.
    if (!tilt3d && touchScreen) void requestMotionAccess()
  }

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
        {motionBlocked ? (
          <button
            type="button"
            className="toggle-3d"
            disabled
            title={
              motionAccess === 'denied'
                ? "Motion access was turned down. Allow it in your browser's settings for this site, then reload."
                : "This device doesn't share how it is tilted."
            }
          >
            3D effect: Not available
          </button>
        ) : (
          <button
            type="button"
            className={tilt3d ? 'toggle-3d on' : 'toggle-3d'}
            aria-pressed={tilt3d}
            title={
              touchScreen
                ? 'Make the card tilt as you tilt your phone'
                : 'Make the card tilt toward your mouse'
            }
            onClick={handleToggle3d}
          >
            3D effect: {needsMotionTap ? 'Tap to start' : tilt3d ? 'On' : 'Off'}
          </button>
        )}
      </div>
      <PokemonCard info={info} tilt3d={tilt3d} />
      <BuildsSection builds={info.builds} />
    </div>
  )
}

export default DetailsPanel
