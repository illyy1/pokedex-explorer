# Architecture: Pokédex Explorer

How the pages and components fit together, and how the data moves between them. Linked from [PRD.md](../PRD.md).

## Pages and addresses

`src/main.tsx` wraps the app in React Router's `BrowserRouter`, and `src/App.tsx` lists the routes:

| Address | Page (`src/pages/`) | What it reads from the address |
| --- | --- | --- |
| `/` | `HomePage` | nothing |
| `/pokedex` and `/pokedex/:id` | `PokedexPage` | `id` with `useParams` (the open card), `?gen=` with `useSearchParams` |
| `/favorites` and `/favorites/:id` | `PokedexPage` with `favoritesOnly` | `id` with `useParams` |
| `/teams` | `TeamsPage` | nothing |
| `/teams/:teamId` | `TeamEditorPage` | `teamId` with `useParams` |
| `/about` | `AboutPage` | nothing |
| anything else (`*`) | `NotFoundPage` | nothing |

`NavBar` (in every page, above `<Routes>`) links to the pages with `NavLink`, which marks the current page's link as active.

## Shared state (the providers)

Three providers in `src/` wrap every page, so their data survives moving between pages. Each one keeps its state with `useState` and hands it out through a React context; pages read it with a hook from `src/lib/`.

| Provider | Hook | Holds | Saved where |
| --- | --- | --- | --- |
| `PokemonDataProvider` | `usePokemonData()` | the names and numbers of all 649 Pokémon (fetched once in a `useEffect`), the rows already loaded, and the loading and error flags | memory only |
| `FavoritesProvider` | `useFavorites()` | the favorite Pokémon's numbers | `localStorage` key `favorites` |
| `TeamsProvider` | `useTeams()` | every team and its members | `localStorage` key `teams` |

State that only one page needs stays in that page: the search text, the type filter and the open card's details live in `PokedexPage`.

## From a click to a card

1. `PokedexPage` builds the visible list (search, type and generation filters, from `src/lib/search.ts`) and passes it to `PokemonList` as props: `pokemon`, `selectedId` and `onSelect`.
2. `PokemonList` draws one row per Pokémon with `map`, keyed by the Pokédex number. Clicking a row calls `onSelect(id)`.
3. `PokedexPage` answers with `navigate('/pokedex/25')`, so the address changes.
4. `useParams` now gives `id = "25"`. A `useEffect` that depends on it calls `fetchPokemonInfo(25)` in `src/lib/api.ts`, which uses `fetch` to ask PokéAPI for the Pokémon, its species and its abilities.
5. While waiting, `DetailsPanel` shows "Loading…"; if the request fails it shows a friendly error message; when the answer arrives it is stored with `setInfo` and passed down to `DetailsPanel`, which draws `PokemonCard` with `TypeBadge`, `FavoriteButton`, `GenerationMark`, `RarityMark` and `BuildsSection`.

The `useEffect` ignores an answer that arrives after another Pokémon was clicked, so a slow request can't show the wrong card.

## Components (`src/components/`)

| Component | Props | Job |
| --- | --- | --- |
| `NavBar` | none | the menu, with `NavLink`s and the dark mode button |
| `PokemonList` | `pokemon`, `selectedId`, `onSelect` | the list of rows on the Pokédex and Favorites pages |
| `DetailsPanel` | `selected`, `info`, `failed` | picks between "Pick a Pokémon", loading, error and the card |
| `PokemonCard` | the Pokémon's details | the trading card: artwork, stats, abilities, weaknesses, description |
| `BuildsSection` | `builds` | Smogon's competitive builds on the card |
| `TypeBadge`, `EnergySymbol` | `type` | a type's colored label or round symbol |
| `GenerationMark`, `RarityMark` | `id` / `rarity` | the "Gen 1" and "✦ Legendary" marks |
| `FavoriteButton` | `id`, `name` | the ☆/★ button |
| `TeamSlot` | one team member | one Pokémon in the team editor, with its item, ability, nature, EVs and moves |
| `PokemonPicker` | `excludeIds`, `onPick`, `onCancel` | the search used to add a Pokémon to a team |
| `ShowdownExport` | the team | "Export to Showdown" and "Save as text file" |
| `ThemeToggle`, `EdgeSprites`, `Sparkles` | none | dark mode, the sprites at the screen's edges, the legendary sparkles |

Every component's props have a TypeScript type, and the API answers have types in `src/lib/api.ts` and `src/lib/types.ts`.

## Logic outside React (`src/lib/`)

Plain TypeScript functions, which is what the unit tests in `tests/unit/` check: `search.ts` (search matching), `matchups.ts` (weaknesses and resistances), `showdown.ts` (the Showdown text), `stats.ts` (EVs and natures), `generations.ts`, `legendary.ts`, `names.ts`, `units.ts`, `pokemonOfTheDay.ts` and `randomTeam.ts`.

## Tests

- `npm test`: unit tests (`tests/unit/`) and integration tests (`tests/integration/`) with Vitest, using a fake PokéAPI (`tests/helpers/fakeApi.ts`), so no internet is needed.
- `npm run test:ui`: the same tests in the Vitest UI, in the browser.
- `npm run test:e2e`: Playwright tests on the built site with the real data.
