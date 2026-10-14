import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchListItem, LAST_POKEMON } from '../lib/api'
import EnergySymbol from '../components/EnergySymbol'
import GenerationMark from '../components/GenerationMark'
import RarityMark from '../components/RarityMark'
import Sparkles from '../components/Sparkles'
import { GENERATIONS } from '../lib/generations'
import { rarityOf } from '../lib/legendary'
import { spriteUrl } from '../lib/names'
import { usePokemonData } from '../lib/pokemonData'
import { pokemonOfTheDay } from '../lib/pokemonOfTheDay'
import { typeStyle } from '../lib/pokemonTypes'

function HomePage() {
  const { items, addItems } = usePokemonData()
  // Picked once when the page opens, so it doesn't change while you look at it.
  const [featuredId] = useState(() => pokemonOfTheDay())
  const [failed, setFailed] = useState(false)
  const featured = items[featuredId]
  const rarity = rarityOf(featuredId)
  // The list may have loaded this Pokémon already, but without its artwork.
  const hasArtwork = featured?.artwork !== undefined

  useEffect(() => {
    if (hasArtwork) return
    let ignore = false
    fetchListItem(featuredId)
      .then((item) => {
        if (!ignore) addItems([item])
      })
      .catch((error) => {
        console.error(error)
        if (!ignore) setFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [featuredId, hasArtwork, addItems])

  return (
    <div className="page home">
      <section className="hero">
        <h1>Pokédex Explorer</h1>
        <p className="intro">
          Browse and search all 649 Pokémon from Generations 1–5, and see their stats, abilities,
          weaknesses and recommended competitive builds.
        </p>
        <div className="actions">
          <Link to="/pokedex" className="button primary">
            Browse the Pokédex
          </Link>
          <Link to="/favorites" className="button">
            My favorites
          </Link>
          <Link to="/teams" className="button">
            Team Builder
          </Link>
        </div>
      </section>

      <section className="featured" aria-label="Pokémon of the day">
        {hasArtwork ? (
          <Link
            to={`/pokedex/${featured.id}`}
            className={rarity ? 'poke-card featured-card holo-rare' : 'poke-card featured-card'}
            style={typeStyle(featured.types?.[0])}
          >
            <span className="card-face">
              {rarity && <Sparkles />}
              <span className="card-header">
                <span className="card-stage">
                  Pokémon of the day
                  <GenerationMark id={featured.id} />
                </span>
                <span className="card-title">
                  <span className="card-name">
                    {featured.name.replace(/-/g, ' ')} {rarity && <RarityMark rarity={rarity} />}
                  </span>
                  {featured.hp !== undefined && (
                    <span className="card-hp">
                      {featured.hp} <small>HP</small>
                    </span>
                  )}
                  {featured.types?.map((type) => (
                    <EnergySymbol key={type} type={type} />
                  ))}
                </span>
              </span>
              <span className="card-art">
                <img src={featured.artwork} alt="" width="300" height="300" />
              </span>
              <span className="card-strip">Tap the card to see No. {featured.id}'s details.</span>
              <span className="card-footer">
                <span>Data: PokéAPI</span>
                <span>
                  {featured.id}/{LAST_POKEMON}
                </span>
              </span>
            </span>
          </Link>
        ) : failed ? (
          <p className="status error" role="alert">
            Couldn't load the Pokémon of the day. Check your internet connection and refresh the
            page.
          </p>
        ) : (
          <p className="status">Loading…</p>
        )}
      </section>

      {/* One button per generation; each opens the Pokédex with only that generation's Pokémon. */}
      <section className="generations" aria-labelledby="generations-title">
        <h2 id="generations-title">Browse by generation</h2>
        <ul className="generation-buttons">
          {GENERATIONS.map((g) => (
            <li key={g.number}>
              <Link to={`/pokedex?gen=${g.number}`} className="generation-button">
                {/* The first Pokémon each generation introduced. */}
                <img src={spriteUrl(g.first)} alt="" width="72" height="72" />
                <span className="generation-name">Gen {g.number}</span>
                <span className="generation-region">{g.region}</span>
                <small>
                  No. {g.first}–{g.last}
                </small>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default HomePage
