# Tasks: Pokédex Explorer

Build in this order. Each task is one commit.

Status: tasks 1–9 are done. Tasks 10–14 are planned. Tasks 9–14 were added after the first plan.

## Task 1: Show the list from a local sample file ✅
Create a local JSON file with 5 sample Pokémon (for example Bulbasaur, Charmander, Squirtle, Pikachu, Eevee). Each one has a number, name, small picture URL and type(s). Show them as a list on the left side of the page, one row per Pokémon.

Done when: I open the app and see 5 rows, each with a picture, number (like #25), name and type(s).

## Task 2: Click a Pokémon to show its details ✅
Add the details fields to the sample file: large picture URL, six base stats and a short description. Clicking a row shows that Pokémon in the details panel on the right. Before any click, the panel shows "Pick a Pokémon to see its details."

Done when: I click Pikachu and see its large picture, name, number, type(s), six base stats and description, and clicking another Pokémon replaces them.

## Task 3: Load the first 50 names from PokéAPI ✅
Replace the sample list with the first 50 Pokémon from the PokéAPI list endpoint. For now, show only the number and name in each row.

Done when: I open the app and see #1 Bulbasaur through #50 Diglett, loaded from the internet instead of the sample file.

## Task 4: Add pictures and types to the list rows ✅
For each of the 50 Pokémon, request its own data from PokéAPI and add the small picture and type(s) to its row.

Done when: every row in the list shows a picture, number, name and type(s), all from PokéAPI.

## Task 5: Add the "Load more" button ✅
Add a "Load more" button below the list that adds the next 50 Pokémon. Stop at #649, the end of Generation 5, and hide the button there.

Done when: each click adds 50 more rows, the last row is #649 Genesect, and the button is gone after that.

## Task 6: Show details from PokéAPI ✅
When a Pokémon is clicked, fill the details panel with real data from PokéAPI: large official artwork, name, number, type(s) and the six base stats. Remove the sample file, since it is no longer used.

Done when: I click any Pokémon in the list, including ones added with "Load more", and see its correct artwork, types and base stats.

## Task 7: Add the Pokédex description ✅
When a Pokémon is clicked, also request its species data and show the first English Pokédex description in the details panel.

Done when: I click Pikachu and see an English description, never one in another language.

## Task 8: Add loading and error messages ✅
Show "Loading…" while the list or the details are loading. If a request fails, show a friendly error message instead of a blank screen.

Done when: I see "Loading…" while data loads, and when I turn off the internet and click "Load more" or a Pokémon, I see a friendly error message.

## Task 9: Add a search bar ✅
Load the name and number of all 649 Pokémon in one request. Add a search bar above the list that shows only the Pokémon whose name contains the text, or whose Pokédex number starts with the typed number. Load pictures and types for the first 50 matches. Hide "Load more" while searching.

Done when: typing "pika" shows Pikachu, typing "25" or "#25" shows #25 Pikachu first, typing "genesect" finds #649 before it has been loaded, and clearing the search brings back the normal list.

## Task 10: Search by type
Add a type dropdown next to the search bar with "All types" and the 18 Pokémon types. When a type is picked, request that type's Pokémon list from PokéAPI once and show only the Pokémon of that type, up to #649. The type filter works together with the name or number search, and "Load more" is hidden while a type is picked.

Done when: picking "Fire" shows only Fire-type Pokémon such as Charmander and Vulpix, picking "Fire" and typing "char" shows only Charmander, Charmeleon and Charizard, and picking "All types" brings back the normal list.

## Task 11: Show weaknesses by type
When a Pokémon is clicked, request the data for each of its types and work out how much damage each attacking type does to it. Multiply the values for Pokémon with two types. Show a "Weak to" section in the details panel (×2 and ×4), and also "Resists" (×½ and ×¼) and "Immune to" (×0), using the same colored type labels as the list.

Done when: Bulbasaur shows weak to Fire, Ice, Flying and Psychic (all ×2), and Charizard shows weak to Rock ×4, Water ×2 and Electric ×2, and immune to Ground.

## Task 12: Show abilities
When a Pokémon is clicked, show its abilities in the details panel and mark the hidden ability. For each ability, request its data from PokéAPI and show the short English explanation of what it does.

Done when: Charizard shows Blaze with "Strengthens Fire moves to inflict 1.5× damage at 1/3 max HP or less." and Solar Power marked as hidden.

## Task 13: Show recommended builds
The first time a Pokémon is clicked, load Smogon's Generation 5 competitive sets from data.pkmn.cc once and keep them for the rest of the visit. Find the clicked Pokémon's builds by name and show them in a "Recommended builds" section: format and set name, four moves (a slot with alternatives shows them as "Thunderbolt / Thunder"), item, ability, nature and EVs. If the Pokémon has no builds, show "No recommended builds for this Pokémon yet."

Done when: Pikachu shows its builds, including "Revenge Killer" with Extreme Speed, Wild Charge, Volt Switch and Hidden Power Ice holding a Light Ball, a Pokémon with a dot or dash in its name (like Mr. Mime) also finds its builds, and Caterpie, which has no builds, shows the message instead of an empty space.

## Task 14: Give the app a sleeker design
Restyle the page without changing what it does, including the type dropdown, weaknesses, abilities and builds sections: a cleaner header, list rows that look like cards with a soft hover effect, a details panel whose top uses the color of the Pokémon's first type, rounded stat bars with the value next to them, and the same spacing and corner rounding everywhere. Keep light and dark mode, and keep the layout working on a phone.

Done when: the app looks consistent in both light and dark mode, every row, badge and button has the same rounded style, and on a 375-pixel-wide screen the list and details stack with no sideways scrolling.
