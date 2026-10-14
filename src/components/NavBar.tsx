import { NavLink } from 'react-router'
import ThemeToggle from './ThemeToggle'

// NavLink adds the "active" class to the link of the page we are on.
function NavBar() {
  return (
    <nav className="navbar" aria-label="Main">
      <NavLink to="/" end className="brand">
        Pokédex Explorer
      </NavLink>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/pokedex">Pokédex</NavLink>
        </li>
        <li>
          <NavLink to="/favorites">Favorites</NavLink>
        </li>
        <li>
          <NavLink to="/teams">Team Builder</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
