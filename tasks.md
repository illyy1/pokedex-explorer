# Tasks: Pokédex Explorer

Build in this order. Each task is one commit.

Status: all 31 tasks are done. Tasks 9–31 were added after the first plan.

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

## Task 13: Show recommended builds ✅
The first time a Pokémon is clicked, load Smogon's Generation 5 competitive sets from data.pkmn.cc once and keep them for the rest of the visit. Find the clicked Pokémon's builds by name, using two matching rules: (1) compare names using only lowercase letters and numbers, so "Mr. Mime" matches "mr-mime" and "Farfetch’d" matches "farfetchd"; (2) use the species name from the species request (for example "deoxys", not "deoxys-normal"). Show them in a "Recommended builds" section: format and set name, four moves (a slot with alternatives shows them as "Thunderbolt / Thunder"), item, ability, nature and EVs. If the Pokémon has no builds, show "No recommended builds for this Pokémon yet."

Done when: Pikachu shows its builds, including "Revenge Killer" with Extreme Speed, Wild Charge, Volt Switch and Hidden Power Ice holding a Light Ball, a Pokémon with a dot or dash in its name (like Mr. Mime) also finds its builds, Deoxys and Landorus (whose PokéAPI names include a form) find their builds, and Caterpie, which has no builds, shows the message instead of an empty space. In total, 589 of the 649 Pokémon have builds.

## Task 14: Add routing and a navigation bar ✅
Add React Router. Show a navigation bar on every page with links to Home, Pokédex, Favorites and About, with the current page highlighted. Move the current list and details to `/pokedex`. Clicking a Pokémon changes the address to its own link (for example `/pokedex/25`), and opening that link directly shows that Pokémon's details. Home, Favorites and About show a simple placeholder for now. Any other address shows "Page not found" with a link back to Home.

Done when: clicking each link in the navigation bar changes the page and the address, opening `/pokedex/649` in a new tab shows Genesect's details, the browser's back button returns to the previous Pokémon or page, and `/nothing-here` shows "Page not found".

## Task 15: Build the homepage ✅
Replace the Home placeholder with the app name, a one-line intro, a "Pokémon of the day" card and two buttons, "Browse the Pokédex" and "My favorites". Pick the Pokémon of the day from today's date, so it is the same all day and changes the next day. Clicking the card opens its details at `/pokedex/{number}`.

Done when: the homepage shows the same Pokémon of the day after a refresh, clicking the card opens that Pokémon's details, and both buttons go to the right pages.

## Task 16: Add favorites ✅
Add a star button to the details panel that adds the Pokémon to favorites (★) or removes it (☆). Save the list of favorite numbers in the browser's localStorage, so it survives closing the browser. Show a small filled star in the list rows of favorite Pokémon. Replace the Favorites placeholder with the same list and details layout, showing only favorites in Pokédex order, at `/favorites` and `/favorites/{number}`. With no favorites, show "No favorites yet. Tap the ☆ on any Pokémon to save it."

Done when: starring Pikachu and Charizard shows both on the Favorites page, removing the star from one removes it from the page, the favorites are still there after closing and reopening the browser, and with no favorites the page shows the message.

## Task 17: Build the About page ✅
Replace the About placeholder with a short description of the app and who made it, the data sources with links (PokéAPI and Smogon's sets from data.pkmn.cc), and a note that this is a fan project not affiliated with Nintendo, Game Freak or The Pokémon Company.

Done when: the About page shows all three parts and both data source links open the right websites.

## Task 18: Replace "Load more" with infinite scroll ✅
Remove the "Load more" button. Put an invisible marker after the last row of the list, and use the browser's IntersectionObserver to notice when it scrolls into view; then load the next 50 Pokémon automatically and show "Loading…" at the bottom while they load. Only load one page at a time, stop at #649, and do nothing while searching or filtering by type. If loading fails, show the error message with a "Try again" button, since there is no longer a button to click.

Done when: scrolling to the end of the list loads the next 50 Pokémon without clicking anything, scrolling quickly never loads the same Pokémon twice, the list stops at #649 Genesect, and with the internet turned off the error message and "Try again" button appear and work once the internet is back.

## Task 19: Give the app a sleeker design ✅
Restyle the app after the original Pokémon trading cards (Base Set era), without changing what it does. Use Gill Sans, the font on the cards, with Cabin from Google Fonts as a fallback. Show the details as a card: a yellow frame, a face in the color of the Pokémon's first type, "Basic Pokémon" or "Evolves from …" at the top, the name with red HP and energy symbols, the artwork in a gold frame, a gold strip with the species, length and weight, abilities written like "Pokémon Power", stats written like attacks (energy dots, name, big number), a weakness / resistance / immune row and a flavor text box. Make the list rows look like card headers and the Pokémon of the day a small card. Keep light and dark mode, and keep the layout working on a phone.

Done when: the Pokémon details look like a trading card, the app looks consistent in both light and dark mode, and on a 375-pixel-wide screen the list and card stack with no sideways scrolling.

## Task 20: Redesign the About page as a hand of cards ✅
Replace the plain text boxes with three trading cards fanned out like a hand: a silver Trainer card about the app and who made it (with a grid of Pokémon sprites as its picture), and an Energy card for each data source (PokéAPI and Smogon) with a big energy symbol and a link. Hovering or tabbing into a card lifts it out of the hand. Turn the disclaimer into small print under the cards. On narrow screens, stack the cards.

Done when: the About page shows the three cards fanned out with all text readable, hovering a card lifts it, all links work, and on a 375-pixel-wide screen the cards stack with no sideways scrolling.

## Task 21: Make the Pokédex card tilt in 3D with the mouse ✅
Wrap the details card in an element that follows the mouse and tilts the card toward the pointer (up to 14° left and right, 8° up and down), with a glare and a holo foil sheen over the picture that follow the pointer and a shadow that shifts. When the mouse leaves, the card eases back flat. Pass the pointer position to CSS as variables, updated at most once per frame. Leave the card still on touch screens and for people who turned off animations.

Done when: moving the mouse to a corner of the card tilts it toward that corner with the shine following, moving away lays it flat again, and the "Add to favorites" button stays clickable and in front of the card.

## Task 22: Add a switch to turn the 3D effect on and off ✅
Add a "3D effect: On / Off" button next to "Add to favorites". Turning it off keeps the card flat. Save the choice in localStorage (key `tilt3d`) so it stays after a reload; it is on by default. Hide the button on touch screens and for people who turned off animations, where the effect never runs.

Done when: the button shows "On" by default and the card tilts; clicking it shows "Off" and the card stays flat; the choice stays the same after reloading the page and when opening another Pokémon; and clicking it again turns the tilt back on.

## Task 23: Mark legendary Pokémon and give them sparkly cards ✅
List the legendary and mythical Pokémon up to #649 from PokéAPI's is_legendary and is_mythical flags (35 legendary, 13 mythical). Show a rainbow "✦ Legendary" or "✦ Mythical" mark next to the name on the card and in the list. Give their cards a "rainbow rare" look: a shimmering rainbow foil frame with diagonal stripes, glitter over the card and the picture, a rainbow foil on the picture and twinkling four-pointed sparkles. Give their list rows the rainbow frame and glitter too. With animations turned off, keep the sparkle but hold it still.

Done when: Mewtwo, Articuno, Zapdos and Moltres show "✦ Legendary" and Mew shows "✦ Mythical" in the list and on the card, their cards sparkle, Charizard keeps a normal card, the 3D tilt still works, and on a 375-pixel-wide screen legendary rows fit with no sideways scrolling.

## Task 24: Add the Team Builder page and save teams ✅
Add a "Team Builder" link to the navigation bar. At `/teams`, list every saved team as a box with its name, how many Pokémon it has and six slots (a sprite or an empty Poké Ball outline), plus a "New team" button and a "Delete" button (with an "are you sure?" question) on each team. "New team" makes "Team 1", "Team 2" and so on, and opens its editor at `/teams/{id}`, where the name can be changed. Save all teams in localStorage (key `teams`) as they change, keep them in sync between open tabs like favorites, and ignore saved data that doesn't look like a team. An unknown team address shows "Team not found".

Done when: making two teams and renaming one shows both after reloading the page, deleting one removes it after reloading too, and `/teams/does-not-exist` shows "Team not found".

## Task 25: Add and remove Pokémon in a team ✅
In the team editor, show six slots. An empty slot has an "Add Pokémon" button that opens a search over all 649 Pokémon by name or number; picking one fills the slot. A Pokémon already in the team is not offered again. A filled slot shows the Pokémon as a small card (name, HP, types, picture, with the sparkly look for legendary Pokémon) and a "Remove" button. A team holds at most six Pokémon.

Done when: adding Pikachu, Charizard and Mewtwo shows their cards (Mewtwo sparkly), Pikachu is not offered again, removing Charizard frees its slot, and the team page shows the right sprites after reloading.

## Task 26: Choose abilities and moves ✅
On each Pokémon in a team, add an "Ability" dropdown with its abilities (the hidden one marked) and four "Move" dropdowns with the moves it can learn in Generation 5 (from the `moves` in its PokéAPI data, kept when they include the `black-white` or `black-2-white-2` version groups), sorted by name. A move already chosen in another slot of the same Pokémon is not offered again. A newly added Pokémon starts with its first normal ability and no moves. Each Pokémon's data is requested once and reused.

Done when: Pikachu offers Static and Lightning Rod (hidden), its move lists include Thunderbolt but not moves from later games, choosing Thunderbolt in one slot removes it from the other three, and the chosen ability and moves are still there after reloading the page.

## Task 27: Fix scrolling in the Team Builder's Pokémon picker ✅
The "Add Pokémon" picker only listed the first 40 Pokémon, so without a search you could not reach the rest. Give it infinite scroll like the Pokédex list: an invisible marker after the last choice, watched by an IntersectionObserver inside the picker's scrolling list, shows 40 more each time it comes into view, until every match is shown. A new search starts again at the top. Sprites still only download as they come into view.

Done when: with Pikachu in the team, scrolling the picker to the end shows all 648 other Pokémon with no duplicates, ending at No. 649, and searching "1" first shows 40 and then all 111 matches as you scroll.

## Task 28: Export a team to Pokémon Showdown ✅
Add an "Export to Showdown" button to the team editor. Showdown can't be opened with a team already in it, so the button copies the team in Showdown's text format (name, `Ability:` line, `- Move` lines) and opens Showdown's team builder in a new tab, then shows how to paste it: New Team → Import from text → Save. PokéAPI names are turned into Showdown's spelling in `src/showdown.ts` ("mr-mime" → "Mr. Mime", "landorus-incarnate" → "Landorus", "u-turn" → "U-turn"). If the browser won't allow copying, the text appears in a box to copy by hand. The button is off while the team is empty. Items, natures and EVs aren't part of our teams, so they are added in Showdown.

Done when: a team of Pikachu (Lightning Rod, Thunderbolt, Volt Switch), Mr. Mime and Landorus (U-turn, Earthquake) copies as "Pikachu / Ability: Lightning Rod / - Thunderbolt / - Volt Switch", "Mr. Mime / Ability: Soundproof" and "Landorus / Ability: Sand Force / - U-turn / - Earthquake" and opens play.pokemonshowdown.com/teambuilder; every Generation 1–5 Pokémon, move and ability name we write matches a name in Showdown's own data; and when copying is refused, the same text is shown in a box.

## Task 29: Items, EVs and Smogon builds in the Team Builder ✅
Give each team member an item, a nature and EVs, and a quick way to use a Smogon build.
- **Smogon build dropdown:** the Pokémon's Generation 5 builds from the file the Pokédex already uses, grouped by format. Picking one fills in the item, ability, nature, EVs and moves. Where a build lists alternatives, take the first; moves become PokéAPI names ("U-turn" → "u-turn", "Hidden Power Ice" → "hidden-power-ice"), and the few spreads over 510 EVs stop at 510.
- **Item dropdown:** the 94 items Smogon's Generation 5 builds use, in Showdown's spelling.
- **Nature & EVs:** a fold-out section with a summary line when closed, a Nature dropdown that shows which stat goes up and down, and six EV boxes that keep each stat at 0–252 and the total at 510, with "EVs left".
- **Moves:** typed Hidden Power (any type but Normal) for Pokémon that learn it, and a move a build chose stays in the list even if PokéAPI doesn't list it for Generation 5. Move names are shown in Showdown's spelling ("U-turn").
- **Saving:** stored with the team. Teams saved before this load with no item, no nature and 0 EVs.
- **Export to Showdown:** now writes "@ Item", `EVs:` and "Nature" lines.

Done when: Pikachu's first build (NU Substitute) sets Light Ball, Lightning Rod, Timid, 4 Def / 252 SpA / 252 Spe and Substitute, Thunderbolt, Hidden Power Ice, Encore; typing 300 SpA gives 252, and with 504 used, 100 HP gives 6; changes are still there after reloading; an old saved team still opens; every one of the 2,251 builds for our Pokémon uses moves, abilities and items that PokéAPI and Showdown both know; and the export shows "Pikachu @ Leftovers", "EVs: 6 HP / 252 SpA / 252 Spe" and "Modest Nature".

## Task 30: Update the About page and add sprites at the screen edges ✅
Bring the About cards up to date: the Trainer card mentions the Team Builder (items, EVs, moves, Smogon builds) and the Showdown export, the Smogon card says it also provides the Team Builder's builds and items, and the fine print says favorites and teams are saved only in the browser. For decoration, add a column of five sprites at each edge of the screen (Charizard, Gengar, Umbreon, Lucario, Chandelure on the left, turned to face the cards; Blastoise, Dragonite, Gardevoir, Garchomp, Zoroark on the right). They stay in place while scrolling, sit behind the page so they never cover a link, zig-zag in and out, bob gently (not for people who turn off animations), are hidden from screen readers, and only show on screens at least 1000 pixels wide. Also fix the tilted third card sticking out 3 pixels at 1000 pixels wide.

Done when: at 1280 and 1600 pixels wide all ten sprites show at the edges and no link is covered, at 1000 pixels wide nothing scrolls sideways, at 375 pixels wide the sprites are hidden, and the cards' text describes the Team Builder and the Showdown export.

## Task 31: Random edge sprites on every page ✅
Move the edge sprites from the About page into their own `EdgeSprites` component in the app layout, so every page has them. Instead of a fixed ten, pick ten different Pokémon at random from all 649 each time you go to another page (the component is keyed by the first part of the address, so React starts it again with a new set). Picking a different Pokémon on the same page, like /pokedex/6 → /pokedex/25, keeps the set so it doesn't change on every click. The whole app gets its own layer (`isolation: isolate` on `#root`) so the sprites stay behind every page's content but in front of the background.

Done when: at 1280 pixels wide all ten sprites show on every page (Home, Pokédex, a Pokémon, Favorites, Team Builder, a team, About, and a page that doesn't exist) without covering any link, button or input, and with no sideways scroll; going through the pages with the navigation bar shows a new set of ten different Pokémon each time; clicking a Pokémon in the Pokédex list keeps the set; and at 375 pixels wide the sprites are hidden.
