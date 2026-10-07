# Tasks: Pokédex Explorer

Build in this order. Each task is one commit.

Status: all tasks are done. Task 9 was added after the first plan.

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
