import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchListItem } from '../api'
import TypeBadge from '../components/TypeBadge'
import { usePokemonData } from '../pokemonData'
import { pokemonOfTheDay } from '../pokemonOfTheDay'

function HomePage() {
  const { items, addItems } = usePokemonData()
  // Picked once when the page opens, so it doesn't change while you look at it.
  const [featuredId] = useState(() => pokemonOfTheDay())
  const [failed, setFailed] = useState(false)
  const featured = items[featuredId]
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
        </div>
      </section>

      <section className="featured" aria-label="Pokémon of the day">
        <h2>Pokémon of the day</h2>
        {hasArtwork ? (
          <Link to={`/pokedex/${featured.id}`} className="featured-card">
            <img src={featured.artwork} alt="" width="200" height="200" />
            <span className="number">#{featured.id}</span>
            <span className="name">{featured.name}</span>
            <span className="types">
              {featured.types?.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
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
    </div>
  )
}

export default HomePage
