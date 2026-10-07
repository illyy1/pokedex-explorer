# PRD: Pokédex Explorer

## 1. One-sentence pitch
A simple web app where Pokémon fans browse or search Pokémon from Generations 1–5 and click any one to see its picture, types, base stats and Pokédex description.

## 2. Who it is for
Pokémon fans who want to learn more about their favorite Pokémon, quickly and without ads or clutter.

## 3. Screens
The app has one page split into two areas.

- **List (left side):** A search bar at the top, then a scrollable list of Pokémon. Each row shows the small picture, the Pokédex number (for example #25), the name and the type(s). The list starts with the first 50 Pokémon and has a "Load more" button that adds the next 50, up to #649. Typing in the search bar replaces the list with the matching Pokémon.
- **Details (right side):** When a Pokémon is clicked, this panel shows its large official artwork, name, number, type(s), the six base stats (HP, Attack, Defense, Special Attack, Special Defense, Speed) and a short Pokédex description in English. Before anything is clicked, it shows a short hint such as "Pick a Pokémon to see its details."

## 4. Must-have features
1. Show a list of Pokémon with picture, number, name and type(s), loaded 50 at a time with a "Load more" button, stopping at Pokémon #649 (end of Generation 5).
2. Search all 649 Pokémon by name (or part of a name) or by Pokédex number.
3. Click a Pokémon to open its details in the details panel.
4. The details panel shows the large picture, name, number, type(s), base stats and Pokédex description.
5. Show a clear "Loading…" message while data is loading, and a friendly error message if the data cannot be loaded.

## 5. Acceptance criteria
- When I open the app, I see the first 50 Pokémon, each with a picture, number, name and type(s).
- When I click "Load more", I see the next 50 Pokémon added to the list, until the list ends at #649 and the button disappears.
- When I type a name like "pika" or a number like "25" in the search bar, I see only the matching Pokémon, even ones I have not loaded yet.
- When I click a Pokémon in the list, I see its large picture, name, number, type(s), six base stats and an English Pokédex description in the details panel.
- When the data cannot be loaded (for example, no internet), I see a friendly error message instead of a blank screen.

## 6. Not now (ideas for later)
- Compare two Pokémon side by side.
- Show type strengths and weaknesses.
- Filter the list by type or generation.
- Add Pokémon from Generation 6 and later.
- Save favorite Pokémon.

## 7. Data
Source: **PokéAPI**, which is free and needs no key. Website: https://pokeapi.co

| Purpose | API URL | Fields we use |
|---|---|---|
| Names and numbers of all 649 Pokémon (for search and paging) | `https://pokeapi.co/api/v2/pokemon?limit=649&offset=0` | `results` → each Pokémon's `name` and `url` (the number is the last part of the url) |
| One Pokémon (for list rows and details) | `https://pokeapi.co/api/v2/pokemon/{id}` | `id` (number), `name`, `sprites.front_default` (small picture for the list), `sprites.other.official-artwork.front_default` (large picture for details), `types` → `type.name`, `stats` → `stat.name` and `base_stat` |
| Pokédex description (details only) | `https://pokeapi.co/api/v2/pokemon-species/{id}` | `flavor_text_entries` → the first entry where `language.name` is "en", using its `flavor_text` |
