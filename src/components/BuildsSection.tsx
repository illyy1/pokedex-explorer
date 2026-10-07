import type { Build } from '../types'

function BuildsSection({ builds }: { builds: Build[] | null }) {
  return (
    <section className="builds" aria-label="Recommended builds">
      <h3>Recommended builds</h3>
      {builds === null && (
        <p className="status error">
          Couldn't load the builds. Check your internet connection, then click the Pokémon again.
        </p>
      )}
      {builds?.length === 0 && <p className="hint">No recommended builds for this Pokémon yet.</p>}
      {builds && builds.length > 0 && (
        <ul>
          {builds.map((build) => (
            <li key={`${build.format}-${build.name}`} className="build">
              <p className="build-title">
                <span className="build-format">{build.format}</span> {build.name}
              </p>
              <ol className="build-moves">
                {build.moves.map((move, i) => (
                  <li key={i}>{move}</li>
                ))}
              </ol>
              <dl className="build-details">
                {build.item && (
                  <>
                    <dt>Item</dt>
                    <dd>{build.item}</dd>
                  </>
                )}
                {build.ability && (
                  <>
                    <dt>Ability</dt>
                    <dd>{build.ability}</dd>
                  </>
                )}
                {build.nature && (
                  <>
                    <dt>Nature</dt>
                    <dd>{build.nature}</dd>
                  </>
                )}
                {build.evs && (
                  <>
                    <dt>EVs</dt>
                    <dd>{build.evs}</dd>
                  </>
                )}
              </dl>
            </li>
          ))}
        </ul>
      )}
      <p className="source">
        Builds from <a href="https://www.smogon.com/" target="_blank" rel="noreferrer">Smogon</a>,
        Generation 5.
      </p>
    </section>
  )
}

export default BuildsSection
