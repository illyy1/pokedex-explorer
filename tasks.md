# Tasks: Pokédex Explorer

Build in this order. Each task is one commit.

Status: tasks 1–12 are done. Tasks 13–19 are planned. Tasks 9–19 were added after the first plan.

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

## Task 10: Search by type ✅
Add a type dropdown next to the search bar with "All types" and the 18 Pokémon types. When a type is picked, request that type's Pokémon list from PokéAPI once and show only the Pokémon of that type, up to #649. The type filter works together with the name or number search, and "Load more" is hidden while a type is picked.

Done when: picking "Fire" shows only Fire-type Pokémon such as Charmander and Vulpix, picking "Fire" and typing "char" shows only Charmander, Charmeleon, Charizard and Chimchar, and picking "All types" brings back the normal list.

## Task 11: Show weaknesses by type ✅
When a Pokémon is clicked, request the data for each of its types and work out how much damage each attacking type does to it. Multiply the values for Pokémon with two types. Show a "Weak to" section in the details panel (×2 and ×4), and also "Resists" (×½ and ×¼) and "Immune to" (×0), using the same colored type labels as the list.

Done when: Bulbasaur shows weak to Fire, Ice, Flying and Psychic (all ×2), and Charizard shows weak to Rock ×4, Water ×2 and Electric ×2, and immune to Ground.

## Task 12: Show abilities ✅
When a Pokémon is clicked, show its abilities in the details panel and mark the hidden ability. For each ability, request its data from PokéAPI and show the short English explanation of what it does.

Done when: Charizard shows Blaze with "Strengthens Fire moves to inflict 1.5× damage at 1/3 max HP or less." and Solar Power marked as hidden.

## Task 13: Show recommended builds
The first time a Pokémon is clicked, load Smogon's Generation 5 competitive sets from data.pkmn.cc once and keep them for the rest of the visit. Find the clicked Pokémon's builds by name, using two matching rules: (1) compare names using only lowercase letters and numbers, so "Mr. Mime" matches "mr-mime" and "Farfetch’d" matches "farfetchd"; (2) use the species name from the species request (for example "deoxys", not "deoxys-normal"). Show them in a "Recommended builds" section: format and set name, four moves (a slot with alternatives shows them as "Thunderbolt / Thunder"), item, ability, nature and EVs. If the Pokémon has no builds, show "No recommended builds for this Pokémon yet."

Done when: Pikachu shows its builds, including "Revenge Killer" with Extreme Speed, Wild Charge, Volt Switch and Hidden Power Ice holding a Light Ball, a Pokémon with a dot or dash in its name (like Mr. Mime) also finds its builds, Deoxys and Landorus (whose PokéAPI names include a form) find their builds, and Caterpie, which has no builds, shows the message instead of an empty space. In total, 589 of the 649 Pokémon have builds.

## Task 14: Add routing and a navigation bar
Add React Router. Show a navigation bar on every page with links to Home, Pokédex, Favorites and About, with the current page highlighted. Move the current list and details to `/pokedex`. Clicking a Pokémon changes the address to its own link (for example `/pokedex/25`), and opening that link directly shows that Pokémon's details. Home, Favorites and About show a simple placeholder for now. Any other address shows "Page not found" with a link back to Home.

Done when: clicking each link in the navigation bar changes the page and the address, opening `/pokedex/649` in a new tab shows Genesect's details, the browser's back button returns to the previous Pokémon or page, and `/nothing-here` shows "Page not found".

## Task 15: Build the homepage
Replace the Home placeholder with the app name, a one-line intro, a "Pokémon of the day" card and two buttons, "Browse the Pokédex" and "My favorites". Pick the Pokémon of the day from today's date, so it is the same all day and changes the next day. Clicking the card opens its details at `/pokedex/{number}`.

Done when: the homepage shows the same Pokémon of the day after a refresh, clicking the card opens that Pokémon's details, and both buttons go to the right pages.

## Task 16: Add favorites
Add a star button to the details panel that adds the Pokémon to favorites (★) or removes it (☆). Save the list of favorite numbers in the browser's localStorage, so it survives closing the browser. Show a small filled star in the list rows of favorite Pokémon. Replace the Favorites placeholder with the same list and details layout, showing only favorites in Pokédex order, at `/favorites` and `/favorites/{number}`. With no favorites, show "No favorites yet. Tap the ☆ on any Pokémon to save it."

Done when: starring Pikachu and Charizard shows both on the Favorites page, removing the star from one removes it from the page, the favorites are still there after closing and reopening the browser, and with no favorites the page shows the message.

## Task 17: Build the About page
Replace the About placeholder with a short description of the app and who made it, the data sources with links (PokéAPI and Smogon's sets from data.pkmn.cc), and a note that this is a fan project not affiliated with Nintendo, Game Freak or The Pokémon Company.

Done when: the About page shows all three parts and both data source links open the right websites.

## Task 18: Replace "Load more" with infinite scroll
Remove the "Load more" button. Put an invisible marker after the last row of the list, and use the browser's IntersectionObserver to notice when it scrolls into view; then load the next 50 Pokémon automatically and show "Loading…" at the bottom while they load. Only load one page at a time, stop at #649, and do nothing while searching or filtering by type. If loading fails, show the error message with a "Try again" button, since there is no longer a button to click.

Done when: scrolling to the end of the list loads the next 50 Pokémon without clicking anything, scrolling quickly never loads the same Pokémon twice, the list stops at #649 Genesect, and with the internet turned off the error message and "Try again" button appear and work once the internet is back.

## Task 19: Give the app a sleeker design
Restyle the app without changing what it does, including the navigation bar, homepage, Favorites and About pages, type dropdown, weaknesses, abilities and builds sections: a cleaner header, list rows that look like cards with a soft hover effect, a details panel whose top uses the color of the Pokémon's first type, rounded stat bars with the value next to them, and the same spacing and corner rounding everywhere. Keep light and dark mode, and keep the layout working on a phone.

Done when: the app looks consistent in both light and dark mode, every row, badge and button has the same rounded style, and on a 375-pixel-wide screen the list and details stack with no sideways scrolling.
