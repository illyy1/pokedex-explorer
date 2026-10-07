import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import FavoritesProvider from './FavoritesProvider'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PokedexPage from './pages/PokedexPage'
import PokemonDataProvider from './PokemonDataProvider'

function App() {
  return (
    <PokemonDataProvider>
      <FavoritesProvider>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* ":id?" means the number is optional: /pokedex and /pokedex/25 both match.
                The keys make each page keep its own search and selection. */}
            <Route path="/pokedex/:id?" element={<PokedexPage key="pokedex" />} />
            <Route path="/favorites/:id?" element={<PokedexPage key="favorites" favoritesOnly />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </FavoritesProvider>
    </PokemonDataProvider>
  )
}

export default App
