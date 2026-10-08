import { spriteUrl } from '../names'
import { typeStyle } from '../pokemonTypes'

// The Pokémon whose sprites make up the Trainer card's picture.
const COLLAGE = [1, 4, 7, 25, 133, 150, 152, 155, 158]

// The About page is a hand of three cards: a Trainer card about the app,
// and an Energy card for each place the data comes from.
function AboutPage() {
  return (
    <div className="page about">
      <header className="about-intro">
        <h1>About</h1>
        <p>Three cards tell you everything about this app.</p>
      </header>

      <div className="card-hand">
        <article className="poke-card trainer-card" aria-labelledby="about-app">
          <div className="card-face">
            <header className="card-header">
              <span className="card-kind">Trainer</span>
              <h2 id="about-app" className="card-name">
                Pokédex Explorer
              </h2>
            </header>
            <div className="card-art trainer-art" aria-hidden="true">
              {COLLAGE.map((id) => (
                <img key={id} src={spriteUrl(id)} alt="" width="96" height="96" />
              ))}
            </div>
            <div className="card-rules">
              <p>
                Browse and search all 649 Pokémon from Generations 1–5 by name, number or type.
                See each one's stats, abilities, weaknesses and recommended builds, and save your
                favorites.
              </p>
              <p>
                Made by{' '}
                <a href="https://github.com/illyy1" target="_blank" rel="noreferrer">
                  illyy1
                </a>{' '}
                as a first-year student project with React and TypeScript.{' '}
                <a href="https://github.com/illyy1/pokedex-explorer" target="_blank" rel="noreferrer">
                  See the code on GitHub
                </a>
                .
              </p>
            </div>
            <footer className="card-footer">
              <span>Trainer · illyy1</span>
              <span>1/3</span>
            </footer>
          </div>
        </article>

        <article className="poke-card energy-card" style={typeStyle('water')} aria-labelledby="about-pokeapi">
          <div className="card-face">
            <header className="card-header">
              <span className="card-kind">Data Energy</span>
              <h2 id="about-pokeapi" className="card-name">
                PokéAPI
              </h2>
            </header>
            <div className="energy-art" aria-hidden="true">
              <span className="energy big" />
            </div>
            <p className="card-strip">Provides: everything about every Pokémon</p>
            <div className="card-rules">
              <p>
                Names, pictures, types, stats, abilities, weaknesses and Pokédex descriptions
                all come from PokéAPI, a free Pokémon database that anyone can use.
              </p>
              <a className="card-link" href="https://pokeapi.co" target="_blank" rel="noreferrer">
                pokeapi.co
              </a>
            </div>
            <footer className="card-footer">
              <span>Basic Energy</span>
              <span>2/3</span>
            </footer>
          </div>
        </article>

        <article className="poke-card energy-card" style={typeStyle('fighting')} aria-labelledby="about-smogon">
          <div className="card-face">
            <header className="card-header">
              <span className="card-kind">Data Energy</span>
              <h2 id="about-smogon" className="card-name">
                Smogon
              </h2>
            </header>
            <div className="energy-art" aria-hidden="true">
              <span className="energy big" />
            </div>
            <p className="card-strip">Provides: competitive builds</p>
            <div className="card-rules">
              <p>
                The recommended Generation 5 builds are written by the Smogon community and
                downloaded from the{' '}
                <a href="https://data.pkmn.cc" target="_blank" rel="noreferrer">
                  pkmn project
                </a>
                .
              </p>
              <a className="card-link" href="https://www.smogon.com" target="_blank" rel="noreferrer">
                smogon.com
              </a>
            </div>
            <footer className="card-footer">
              <span>Basic Energy</span>
              <span>3/3</span>
            </footer>
          </div>
        </article>
      </div>

      {/* Like the copyright line at the bottom of a real card. */}
      <p className="fine-print">
        Fan project, not affiliated with or endorsed by Nintendo, Game Freak, Creatures or The
        Pokémon Company. Pokémon and Pokémon character names are trademarks of their respective
        owners. Both data sources are free and need no account, and your favorites are saved only
        in your browser.
      </p>
    </div>
  )
}

export default AboutPage
