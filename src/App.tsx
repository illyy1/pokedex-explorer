import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import FavoritesProvider from './FavoritesProvider'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PokedexPage from './pages/PokedexPage'
import TeamEditorPage from './pages/TeamEditorPage'
import TeamsPage from './pages/TeamsPage'
import PokemonDataProvider from './PokemonDataProvider'
import TeamsProvider from './TeamsProvider'

function App() {
  return (
    <PokemonDataProvider>
      <FavoritesProvider>
        <TeamsProvider>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* ":id?" means the number is optional: /pokedex and /pokedex/25 both match.
                  The keys make each page keep its own search and selection. */}
              <Route path="/pokedex/:id?" element={<PokedexPage key="pokedex" />} />
              <Route path="/favorites/:id?" element={<PokedexPage key="favorites" favoritesOnly />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teams/:teamId" element={<TeamEditorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </TeamsProvider>
      </FavoritesProvider>
    </PokemonDataProvider>
  )
}

export default App
