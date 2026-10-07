function AboutPage() {
  return (
    <div className="page about">
      <h1>About</h1>

      <section>
        <h2>What this is</h2>
        <p>
          Pokédex Explorer is a small web app for Pokémon fans. You can browse and search all 649
          Pokémon from Generations 1–5 by name, number or type, see each one's stats, abilities,
          weaknesses and recommended competitive builds, and save your favorites.
        </p>
        <p>
          It was made by{' '}
          <a href="https://github.com/illyy1" target="_blank" rel="noreferrer">
            illyy1
          </a>{' '}
          as a first-year student project with React and TypeScript. The code is on{' '}
          <a href="https://github.com/illyy1/pokedex-explorer" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Where the data comes from</h2>
        <ul>
          <li>
            <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
              PokéAPI
            </a>{' '}
            for Pokémon names, pictures, types, stats, abilities, weaknesses and Pokédex
            descriptions.
          </li>
          <li>
            <a href="https://www.smogon.com" target="_blank" rel="noreferrer">
              Smogon
            </a>{' '}
            for the recommended Generation 5 builds, downloaded from the{' '}
            <a href="https://data.pkmn.cc" target="_blank" rel="noreferrer">
              pkmn project
            </a>
            .
          </li>
        </ul>
        <p>Both are free and need no account. Favorites are saved only in your browser.</p>
      </section>

      <section>
        <h2>Fan project</h2>
        <p>
          This is a fan project and is not affiliated with or endorsed by Nintendo, Game Freak,
          Creatures or The Pokémon Company. Pokémon and Pokémon character names are trademarks of
          their respective owners.
        </p>
      </section>
    </div>
  )
}

export default AboutPage
