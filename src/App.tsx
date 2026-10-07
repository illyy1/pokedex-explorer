import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import AboutPage from './pages/AboutPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PokedexPage from './pages/PokedexPage'
import PokemonDataProvider from './PokemonDataProvider'

function App() {
  return (
    <PokemonDataProvider>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* ":id?" means the number is optional: /pokedex and /pokedex/25 both match. */}
          <Route path="/pokedex/:id?" element={<PokedexPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </PokemonDataProvider>
  )
}

export default App
