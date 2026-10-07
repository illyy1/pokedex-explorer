# PRD: Pokédex Explorer

## 1. One-sentence pitch
A simple web app where Pokémon fans browse or search Pokémon from Generations 1–5 by name, number or type, and click any one to see its picture, types, base stats, abilities, weaknesses, Pokédex description and recommended competitive builds.

## 2. Who it is for
Pokémon fans who want to learn more about their favorite Pokémon, quickly and without ads or clutter.

## 3. Screens
The app has one page split into two areas.

- **List (left side):** A search bar and a type dropdown at the top, then a scrollable list of Pokémon. Each row shows the small picture, the Pokédex number (for example #25), the name and the type(s). The list starts with the first 50 Pokémon and has a "Load more" button that adds the next 50, up to #649. Typing in the search bar or picking a type replaces the list with the matching Pokémon.
- **Details (right side):** When a Pokémon is clicked, this panel shows its large official artwork, name, number, type(s), the six base stats (HP, Attack, Defense, Special Attack, Special Defense, Speed), its abilities with a short explanation of each (the hidden ability is marked), its type weaknesses, resistances and immunities, and a short Pokédex description in English. Below that, a "Recommended builds" section lists Smogon's competitive sets for that Pokémon in Generation 5: the set name and format (for example "NU · Revenge Killer"), its four moves, item, ability, nature and EVs. The top of the panel uses the color of its first type. Before anything is clicked, it shows a short hint such as "Pick a Pokémon to see its details."

## 4. Must-have features
1. Show a list of Pokémon with picture, number, name and type(s), loaded 50 at a time with a "Load more" button, stopping at Pokémon #649 (end of Generation 5).
2. Search all 649 Pokémon by name (or part of a name), by Pokédex number, or by type.
3. Click a Pokémon to see its details: large picture, name, number, type(s), base stats, abilities, weaknesses by type and Pokédex description.
4. See recommended competitive builds for the clicked Pokémon: moves, item, ability, nature and EVs.
5. Show a clear "Loading…" message while data is loading, and a friendly error message if the data cannot be loaded.

## 5. Acceptance criteria
- When I open the app and click "Load more", I see 50 more Pokémon at a time, each with a picture, number, name and type(s), until the list ends at #649.
- When I type a name like "pika" or a number like "25" in the search bar, or pick a type like Fire, I see only the matching Pokémon, even ones I have not loaded yet.
- When I click a Pokémon in the list, I see its large picture, name, number, type(s), six base stats, its abilities (for example Charizard: Blaze, and Solar Power marked as hidden), what it is weak to (for example Charizard: Rock ×4) and an English Pokédex description in the details panel.
- When I click a Pokémon that has builds, like Pikachu, I see its recommended builds with moves, item, ability, nature and EVs; when it has none, I see a short message saying so.
- When the data cannot be loaded (for example, no internet), I see a friendly error message instead of a blank screen.

## 6. Not now (ideas for later)
- Compare two Pokémon side by side.
- Filter the list by generation.
- Add Pokémon from Generation 6 and later.
- Save favorite Pokémon.
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
| Recommended builds (loaded once, details only) | `https://data.pkmn.cc/sets/gen5.json` | Keyed by Pokémon name (for example "Pikachu"), then format (for example "nu" or "vgc2012"), then set name. Each set has `moves` (a slot can list alternatives), `item`, `ability`, `nature` and `evs`. Covers 575 of our 649 Pokémon |
