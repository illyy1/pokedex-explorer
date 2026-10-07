# PRD: Pokédex Explorer

## 1. One-sentence pitch
A simple web app where Pokémon fans browse or search Pokémon from Generations 1–5 by name, number or type, see each one's stats, abilities, weaknesses and recommended competitive builds, and save their favorites.

## 2. Who it is for
Pokémon fans who want to learn more about their favorite Pokémon, quickly and without ads or clutter.

## 3. Screens
The app has four pages. A navigation bar at the top of every page links to Home, Pokédex, Favorites and About, and the browser's back and forward buttons work as expected. Every page shows "Loading…" while data loads and a friendly message if it fails.

- **Home** (`/`): the app name, a one-line intro, a "Pokémon of the day" card (the same Pokémon for everyone all day, a new one each day) that opens its details when clicked, and two buttons: "Browse the Pokédex" and "My favorites".
- **Pokédex** (`/pokedex`): split into two areas.
  - **List (left side):** A search bar and a type dropdown at the top, then a scrollable list of Pokémon. Each row shows the small picture, the Pokédex number (for example #25), the name, the type(s) and a filled star if it is a favorite. The list starts with the first 50 Pokémon. When you scroll to the end of the list, the next 50 start loading on their own (infinite scroll), with "Loading…" shown at the bottom, until the list ends at #649. Typing in the search bar or picking a type replaces the list with the matching Pokémon.
  - **Details (right side):** When a Pokémon is clicked, the address changes to its own link (for example `/pokedex/25`), so it can be bookmarked or shared. The panel shows a star button to add or remove it from favorites, its large official artwork, name, number, type(s), the six base stats (HP, Attack, Defense, Special Attack, Special Defense, Speed), its abilities with a short explanation of each (the hidden ability is marked), its type weaknesses, resistances and immunities, and a short Pokédex description in English. Below that, a "Recommended builds" section lists Smogon's competitive sets for that Pokémon in Generation 5: the set name and format (for example "NU · Revenge Killer"), its four moves, item, ability, nature and EVs. The top of the panel uses the color of its first type. Before anything is clicked, it shows a short hint such as "Pick a Pokémon to see its details."
- **Favorites** (`/favorites`): the same list and details layout, showing only the Pokémon the user has starred, in Pokédex order. With no favorites, it says "No favorites yet. Tap the ☆ on any Pokémon to save it." Favorites are saved in this browser, so they are still there after closing and reopening it.
- **About** (`/about`): what the app is and who made it, where the data comes from (PokéAPI and Smogon, with links), and a note that this is a fan project not affiliated with Nintendo, Game Freak or The Pokémon Company.
- **Page not found**: any other address shows "Page not found" with a link back to Home.

## 4. Must-have features
1. Browse all 649 Pokémon with infinite scroll (the next 50 load when you reach the end of the list) and search them by name, Pokédex number or type.
2. Click a Pokémon to see its details: large picture, name, number, type(s), base stats, abilities, weaknesses by type, Pokédex description and recommended competitive builds.
3. Star a Pokémon to save it as a favorite, and see all favorites on their own page.
4. Move between the Home, Pokédex, Favorites and About pages with a navigation bar, and open any Pokémon directly from its own link.
5. Show a clear "Loading…" message while data is loading, and a friendly error message if the data cannot be loaded.

## 5. Acceptance criteria
- When I open the app, I see the homepage with the Pokémon of the day and a navigation bar, and when I click Pokédex, Favorites or About, I see that page and the address changes.
- When I scroll to the end of the Pokédex list, I see the next 50 Pokémon load on their own (until #649), and when I type "pika" or "25" in the search bar or pick a type like Fire, I see only the matching Pokémon, even ones not loaded yet.
- When I click a Pokémon, or open a link like /pokedex/6, I see its details, including its abilities (for example Charizard: Blaze, and Solar Power marked as hidden), what it is weak to (Rock ×4) and its recommended builds, or a short message if it has none.
- When I click the star on a Pokémon, I see it on the Favorites page, and it is still there after I close and reopen the browser.
- When the data cannot be loaded (for example, no internet), I see a friendly error message instead of a blank screen.

## 6. Not now (ideas for later)
- Compare two Pokémon side by side.
- Filter the list by generation.
- Add Pokémon from Generation 6 and later.
- Sync favorites across devices (this would need user accounts).
- Builds from other generations, or let me pick the generation.

## 7. Data
Sources: **PokéAPI** (https://pokeapi.co) for Pokémon data, and **Smogon's competitive sets** published by the pkmn project (https://data.pkmn.cc) for recommended builds. Both are free and need no key.

| Purpose | API URL | Fields we use |
|---|---|---|
| Names and numbers of all 649 Pokémon (for search and paging) | `https://pokeapi.co/api/v2/pokemon?limit=649&offset=0` | `results` → each Pokémon's `name` and `url` (the number is the last part of the url) |
| One Pokémon (for list rows and details) | `https://pokeapi.co/api/v2/pokemon/{id}` | `id` (number), `name`, `sprites.front_default` (small picture for the list), `sprites.other.official-artwork.front_default` (large picture for details), `types` → `type.name`, `stats` → `stat.name` and `base_stat` |
| Pokémon of one type, and type weaknesses | `https://pokeapi.co/api/v2/type/{name}` | `pokemon` → `pokemon.name` and `pokemon.url` (for the type dropdown); `damage_relations` → `double_damage_from`, `half_damage_from` and `no_damage_from`, each a list of type names (for weaknesses) |
| Ability explanation (details only) | `https://pokeapi.co/api/v2/ability/{name}` | `effect_entries` → the entry where `language.name` is "en", using its `short_effect`. The list of a Pokémon's abilities comes from `abilities` → `ability.name` and `is_hidden` in the one-Pokémon request above |
| Pokédex description (details only) | `https://pokeapi.co/api/v2/pokemon-species/{id}` | `flavor_text_entries` → the first entry where `language.name` is "en", using its `flavor_text` |
| Recommended builds (loaded once, details only) | `https://data.pkmn.cc/sets/gen5.json` | Keyed by Pokémon name (for example "Pikachu"), then format (for example "nu" or "vgc2012"), then set name. Each set has `moves` (a slot can list alternatives), `item`, `ability`, `nature` and `evs`. Matched to PokéAPI by the species name, comparing only letters and numbers ("Mr. Mime" = "mr-mime"). Covers 589 of our 649 Pokémon |
| Favorites (saved in this browser, not an API) | Browser storage (localStorage), key `favorites` | A list of the favorite Pokémon's numbers, for example [6, 25, 133] |
