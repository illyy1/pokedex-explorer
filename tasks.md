# Tasks: Pokédex Explorer

Build in this order. Each task is one commit.

Status: tasks 1–31 and 33–53 are done; task 32 is planned for later. Tasks 9–53 were added after the first plan.

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
Add an "Export to Showdown" button to the team editor. Showdown can't be opened with a team already in it, so the button copies the team in Showdown's text format (name, `Ability:` line, `- Move` lines) and opens Showdown's team builder in a new tab, then shows how to paste it: New Team → Import from text → Save. PokéAPI names are turned into Showdown's spelling in `src/lib/showdown.ts` ("mr-mime" → "Mr. Mime", "landorus-incarnate" → "Landorus", "u-turn" → "U-turn"). If the browser won't allow copying, the text appears in a box to copy by hand. The button is off while the team is empty. Items, natures and EVs aren't part of our teams, so they are added in Showdown.

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

## Task 32 (later): Add every generation to the Pokédex ⏳
Not started; kept for later. Show all 1025 Pokémon (Generations 1–9) instead of 649, while the Team Builder stays Generation 5 (option A of three; the other two, moving the Team Builder to Generation 9 or using each Pokémon's newest game, were much bigger and left out).
- Change `LAST_POKEMON` in `src/lib/api.ts` from 649 to 1025. The list, search, type filter, card numbers, Pokémon of the day and edge sprites all follow it.
- Add Generations 6–9 (Kalos 650–721, Alola 722–809, Galar 810–905, Paldea 906–1025) to `src/lib/generations.ts`, so their Pokémon get a generation mark.
- Add the Generation 6–9 legendary and mythical Pokémon to `src/lib/legendary.ts`, taken from the `is_legendary` and `is_mythical` flags in PokéAPI's pokemon-species data.
- Keep the Team Builder's picker to Nos. 1–649 and label it as a Generation 5 team builder, because its moves, items, Smogon builds and Showdown export are all Generation 5.
- Update "649" and "Generations 1–5" on the Home and About pages and in the PRD.
- Expect a mix of art styles: sprites from Generation 6 on are not pixel art.

Done when: the Pokédex list scrolls to No. 1025 (Pecharunt), searching "1025" or "pecharunt" finds it, the card shows "1025/1025", Generation 6–9 legendaries have the mark and the sparkly card, and the Team Builder picker still ends at No. 649.

## Task 33: Publish the app on GitHub Pages ✅
Make the app public at https://illyy1.github.io/pokedex-explorer/. GitHub Pages serves it from a folder, so `vite.config.ts` builds with `base: '/pokedex-explorer/'` (the dev server stays at "/"), and `BrowserRouter` gets the same folder as its `basename`. GitHub Pages only knows the built files, so a link like /pokedex-explorer/pokedex/25 would be "not found"; the build copies `index.html` to `404.html`, so that page loads the app, which then shows the right page. A GitHub Actions workflow (`.github/workflows/deploy.yml`) lints, builds and publishes the site every time `main` is pushed, and Pages in the repository settings is set to deploy from GitHub Actions.

Done when: the production build, served under /pokedex-explorer/ with the 404 fallback like GitHub Pages, opens the homepage; opening /pokedex/25, /about, /teams and a made-up address directly shows Pikachu, About, the Team Builder and "Page not found"; reloading a team's page keeps it; the navigation links include /pokedex-explorer; and after pushing, the workflow succeeds and the live site loads.

## Task 34: Tilt the card with the phone's motion sensor ✅
On touch screens, following a finger would fight with scrolling, so the card tilts as you tilt the phone instead, with the same shine as with a mouse.
- `useTilt` listens to `deviceorientation` on any device that sends motion readings (computers without a sensor send none; while a mouse is moving over the card, it is in charge) and turns the phone's left/right and forward/back tilt into the same tilt as the mouse. Turning the phone 20° turns the card all the way; more is capped.
- The tilt is measured from how the phone is being held, which starts at the first reading and slowly follows the phone, so the card settles back to flat after a few seconds held still. Holding the phone sideways is handled with `screen.orientation.angle`.
- `src/lib/motionAccess.ts` keeps track of whether the page may read the sensor. iPhones and iPads (Safari) ask first, and only after a tap, so the 3D button says "Tap to start" and asks when tapped. If a reading arrives without asking, access was already allowed. A "no", or a device without the sensor, shows "3D effect: Not available" with a hint to allow it in the browser's settings.
- The 3D button now shows on touch screens too; it is still hidden for people who turned off animations, who still get a flat card. Computers keep the mouse tilt and ignore sensor readings.

Done when (checked with fake sensor readings in a phone-sized, touch-screen browser): tilting right 15° turns the card 10.5° to the right and tipping forward tips it, 60° stops at the most, holding a tilt settles back to flat, the phone held sideways still tilts the right way, turning 3D off keeps it flat; pretending to be an iPhone, the button says "Tap to start", asks once when tapped, and then tilts on "Allow" or shows "Not available" on "Don't Allow"; on a computer the mouse still tilts the card and sensor readings are ignored. The last check is on a real phone, on the live site (motion needs HTTPS).

Fix after testing on a Samsung phone: the tilt did nothing, because many Samsung Galaxy phones say they can hover like a mouse, so the phone was treated as a computer. Touch screens are now recognized by `navigator.maxTouchPoints` (or `any-pointer: coarse`), and motion readings are used on any device that sends them. Checked on a real Samsung phone afterwards: the tilt works in both Samsung Internet and Chrome.

## Task 35: Show the whole picture on every card ✅
The artwork on the Pokédex card, the homepage's Pokémon of the day and the Team Builder cards was cut off at the bottom (70–111 pixels, for example Charizard's feet and Pikachu's tail). The picture frame is wider than it is tall (4:3, or 16:10 on team cards), but it was a grid, and there the square picture's `height: 100%` didn't count, so it was drawn as a full-width square and the frame hid the rest. The frame is now a flexbox that centres the picture, and the picture has `min-height: 0` so it can shrink to the frame's height, with `object-fit: contain` keeping it whole. The About page's 3×3 sprite collage sets `display: grid` itself, since it used to borrow the frame's grid.

Done when: on the homepage, a Pokémon's card (/pokedex/6 and /pokedex/150), a team's cards and the About page, at 1280 and 375 pixels wide, every picture fits inside its frame with 0 pixels cut off, and the About collage is still 3 by 3.

## Task 36: Save a team as a text file ✅
Add a "Save as text file" button next to "Export to Showdown". It downloads the team as a .txt file in the same Showdown text format, so it can be kept or imported into Showdown later. The file is named after the team, without characters that can't be in file names ("Rain: Team / #1?" → "Rain Team #1.txt"; a name with nothing left becomes "team.txt"). The download is made in the browser (a Blob and a link), so nothing is sent anywhere. Afterwards a note says where it was saved and how to import it. The button is off while the team is empty, and the two buttons wrap onto two lines on narrow screens.

Done when: saving a team of Pikachu (Light Ball, Lightning Rod, Timid, 4 Def / 252 SpA / 252 Spe, Thunderbolt, Hidden Power Ice) and Mr. Mime downloads "Rain Team #1.txt" with the same text as the Showdown export, a team named "???" saves as "team.txt", the button is off for an empty team, and at 375 pixels wide nothing scrolls sideways.

## Task 37: Randomize a team or one Pokémon ✅
Add a randomizer to the team editor.
- **🎲 Randomize team** fills all six slots with six different random Pokémon. If the team already has Pokémon, it asks first, because this replaces them.
- **🎲 Randomize** on each card swaps that one Pokémon for a random one that isn't already in the team; the rest of the team stays as it is.
- **🎲 Random Pokémon** under "Add Pokémon" in the next empty slot adds one random Pokémon.
- Every random Pokémon gets a complete set (`src/lib/randomTeam.ts`): one of its Smogon builds at random, or, for Pokémon without builds, a random ability, a random item from the list, a random nature, four different random moves it can learn in Generation 5 (fewer if it knows fewer, like Unown and Ditto) and 84 EVs in every stat, like Showdown's Random Battles.
- While it loads, the button says "Randomizing…" or "Picking…" and the other randomize buttons wait. If PokéAPI can't be reached, a message says so and the team is left as it was.
- The edge sprites now use the same random-number picker.
- Fix found while testing: a few Smogon builds use a Generation 5 hidden ability that later games changed (Scolipede's Quick Feet became Speed Boost), so PokéAPI doesn't list it. The Ability dropdown now keeps the chosen ability, so the card shows what is saved and exported.

Done when: Unown and Ditto get their one move, Magikarp (no builds) gets a random set with 504 EVs, and Pikachu gets a Smogon build; 300 random picks of six have no repeats, stay within 1–649 and never pick an excluded Pokémon; "Random Pokémon" adds one complete Pokémon; "Randomize team" gives six different Pokémon whose abilities show on their cards; randomizing the third card changes only that one and the team stays without repeats; the Showdown export includes the random sets; offline, a message appears and the team is unchanged; and a saved Scolipede with Quick Feet shows Quick Feet on its card.

## Task 38: Security hardening for the public site ✅
A security check of the live site found no serious problems (no login, server or secrets; React escapes all text; saved data is checked before use; links to other sites can't control the tab; HTTPS is enforced; `npm audit` finds nothing; no personal email in any commit). These four changes harden it further:
1. **Deploy workflow permissions:** nothing by default. The build job, which runs `npm ci` and so code from npm packages, can only read the code; only the deploy job, which runs no npm code, may publish to Pages. `actions/checkout` doesn't keep its token.
2. **Pinned actions:** every action in the workflow is pinned to the exact commit of its release, with the version in a comment. `.github/dependabot.yml` suggests updates monthly.
3. **Repository settings:** Dependabot alerts and Dependabot security updates for npm packages, secret scanning, and push protection (a push containing a key is refused) are turned on.
4. **Content Security Policy:** a `<meta>` tag, added by a small plugin in `vite.config.ts` to the built page only (the dev server needs inline styles and a live-reload connection), lets the browser load scripts only from the site, data only from PokéAPI and the pkmn project (data.pkmn.cc and pkmn.github.io, where it redirects), pictures only from the site and PokéAPI's sprites on GitHub, and styles and fonts only from the site and Google Fonts. No inline scripts, no `eval`, no plugins, no forms.

Done when: the production build, served like GitHub Pages, works with the policy and nothing is blocked (homepage, a Pokémon with its Smogon builds, list sprites, the 3D tilt, a random team, "Save as text file", the About page with edge sprites and the Google font); a request to another site and a script from another site are blocked; the repository shows Dependabot alerts, security updates, secret scanning and push protection as on; and after pushing, the workflow with the new permissions and pinned actions deploys the site.

## Task 39: Unit and integration tests ✅
Vitest runs with `npm test`.
- **Unit tests** (`tests/unit/`, run in Node): `normalizeQuery` and `matchesQuery` (part of a name, and Pokédex numbers with `#` or leading zeroes), `displayName` and `spriteUrl`. These first ones were added with the ChatGPT agent.
- **Integration tests** (`tests/integration/App.integration.test.tsx`): the whole app is rendered at an address with Testing Library in a simulated browser (jsdom), and used like a person would: clicking, typing and following links. `tests/helpers/fakeApi.ts` replaces `fetch` with a small fake PokéAPI and Smogon file, so the tests need no internet and always get the same data. They cover the list and search, the type filter, opening a card (description, ability text, builds), opening a card from its address, a number that isn't in the Pokédex, the offline message, saving favorites and loading them again, the empty Favorites page, making a team and adding a Pokémon, and a team that doesn't exist.

Done when: `npm test` passes without internet, lint and build still pass, and breaking the name search on purpose makes a test fail.

## Task 40: End-to-end tests ✅
Playwright (`npm run test:e2e`, config in `playwright.config.ts`) builds the site, serves it with `vite preview` under `/pokedex-explorer/` like GitHub Pages, and opens it in a real Chromium browser, once at desktop size and once as a Pixel 7 phone. These tests use the real PokéAPI and Smogon data, so they need the internet. They follow whole journeys (`tests/e2e/app.spec.ts`): from the homepage to Pikachu's card with real builds and no console errors (so the Content Security Policy blocks nothing), opening /pokedex/150 directly, infinite scroll loading No. 51, a favorite surviving a reload, and a team saved as a text file that still exists after a reload. Vitest leaves `tests/e2e/` to Playwright, and Playwright's result folders are ignored by git.
- Fix found while adding them: `npm run preview` showed a blank page, because it served the site from `/` while the built files expect `/pokedex-explorer/`. `vite.config.ts` now uses the Pages folder for preview too. The live site wasn't affected.

Done when: all end-to-end tests pass at both sizes twice in a row, and `npm run preview` shows the site.

## Task 41: Test the rest of the app ✅
All the tests now live in one `tests/` folder: `tests/unit/`, `tests/integration/`, `tests/e2e/` and the shared `tests/helpers/`.
Tests for everything that had none:
- **Unit:** weakness and resistance math (`tests/unit/matchups.test.ts`: Charizard's Rock ×4 and Grass ×¼, Ice cancelling out to ×1, Flying's immunity beating Fire's Ground weakness, the order and the ×½/×¼ labels), the Showdown text and names (`tests/unit/showdown.test.ts`), EV and nature labels (`tests/unit/stats.test.ts`), legendary and mythical marks (`tests/unit/legendary.test.ts`) and the randomizer (`tests/unit/randomTeam.test.ts`: different Pokémon within 1–649, excluded ones never picked, a Smogon build when there is one, a complete random set with 84 EVs when there isn't, and no item when the builds file fails).
- **Integration:** cards show the right weaknesses, resistances and immunities; legendary cards, rows and team cards sparkle and ordinary ones don't; the 3D button turns the effect off and remembers it; the About page opens from the menu with its three cards, and its five links go to the right places in a new tab. `tests/integration/TeamBuilder.integration.test.tsx` covers choosing an ability (first normal one by default), item, moves (no repeats, typed Hidden Power), nature and EVs (252 per stat, 510 in all), using a Smogon build, "Export to Showdown" (the exact copied text, Showdown opening, and the copy-by-hand box when copying is blocked), "Save as text file" (the file's name and text), empty teams, and all three randomize buttons, including the question before replacing a team and the offline message. Both integration files share `tests/helpers/renderApp.tsx`, and the fake server answers for any number up to 649, because the randomizer can pick any of them.
- **End-to-end:** the card leans toward the mouse and lies flat when it leaves; on the phone it tilts with (fake) motion sensor readings; it stays flat with 3D off (also after a reload) and for people who asked for less motion; Mewtwo's card has its sparkles; every picture on the About page loads and nothing sticks out sideways on a phone; and a Garchomp with a real Smogon build is exported, Showdown opens, and the copied text is a complete set.
- The About page now shows `LAST_POKEMON` instead of a fixed "649", so it always matches the rest of the app.

Done when: 71 unit and integration tests and 20 end-to-end runs pass (4 runs are skipped on purpose: the mouse tests don't run on the phone and the sensor test doesn't run on the computer), lint and build pass, and breaking the immunity math, the 510 EV limit, the export's Nature line or the question before randomizing each makes a test fail.

## Task 42: Keep the .ts files apart from the .tsx files ✅
The 19 `.ts` files that were next to the `.tsx` files in `src/` (`api`, `builds`, `favorites`, `legendary`, `matchups`, `motionAccess`, `names`, `pokemonData`, `pokemonOfTheDay`, `pokemonTypes`, `randomTeam`, `search`, `showdown`, `stats`, `teams`, `types`, `units`, `useStoredToggle` and `useTilt`) moved to `src/lib/`. `src/` keeps `main.tsx`, `App.tsx` and the three providers, with the pages and components in their own folders. Every import in `src/` and `tests/` was changed to the new place (81 of them), and the docs and comments that named these files too.

Done when: no `.ts` file is left next to a `.tsx` file in `src/`, and build, lint, the 71 unit and integration tests and the 20 end-to-end runs all pass.

## Task 43: Show which generation introduced each Pokémon ✅
Every Pokémon gets a small rounded "Gen 1" mark. `src/lib/generations.ts` works out the generation from the Pokédex number, because each generation's new Pokémon come right after the last one's (Kanto 1–151, Johto 152–251, Hoenn 252–386, Sinnoh 387–493, Unova 494–649), so no extra request is needed. `GenerationMark` shows "Gen 1" in small places and "Gen 1 · Kanto" on the big cards, and hovering it says "Introduced in Generation 1 (Kanto)". It is on the Pokédex and Favorites list rows (after the number), the Pokédex card and its loading card (next to "Basic Pokémon" or "Evolves from …"), the Pokémon of the day, the Team Builder cards (a new "No. 6" line above the name) and the Team Builder's picker.

Done when: list rows show "Gen 1" for Pikachu, Mewtwo's card shows "Gen 1 · Kanto", Skarmory's homepage card shows "Gen 2 · Johto", the picker shows Chimchar as "Gen 4", the first and last Pokémon of every generation get the right one, every number from 1 to 649 has one, and at 1280 and 375 pixels wide the marks fit without crowding.

## Task 44: Test the last untested parts ✅
- **Unit:** `tests/unit/units.test.ts` (feet and inches, whole pounds, one decimal under 10 lbs), `tests/unit/pokemonOfTheDay.test.ts` (the same all day, new at midnight, every one of the 649 once before any repeats) and `tests/unit/motionAccess.test.ts` (no sensor, Android, iPhone yes / no / asking failed, a reading counting as an earlier yes, which states may read the sensor, and touch screens including Samsung phones).
- **Integration:** the home page (the Pokémon of the day for a pretend date opens its card, sparkles when legendary, and the two buttons work), "Page not found" with its link home, the edge sprites (ten different, hidden from screen readers, new on each page, kept while picking Pokémon) and deleting a team only after asking. `tests/integration/Errors.integration.test.tsx` covers the builds, details, type, Pokémon-of-the-day, list-row and team-card errors with their "Try again" buttons, "Showing the first 50 of 111 matches", unreadable or hand-edited favorites and teams (bad entries dropped, old teams filled in, EVs over 510 reset) and favorites and teams changed in another tab. `tests/integration/Motion.integration.test.tsx` loads a fresh copy of the app as an Android phone, an iPhone that says yes or no, and a touch screen without a sensor. The fake server can now fail chosen requests and list all 649 Pokémon.
- **End-to-end:** the real Pokémon of the day opens its own card, and an unknown address shows "Page not found".

Done when: 119 unit and integration tests and 24 end-to-end runs pass, and breaking the favorites check, teams syncing between tabs, the decimal for light Pokémon, the question before deleting or the team card's "Try again" each makes a test fail.

## Task 45: Browse by generation ✅
The homepage gets a "Browse by generation" row: one button per generation with its first Pokémon's sprite, "Gen 1", "Kanto" and "No. 1–151". Each links to `/pokedex?gen=1` and so on. The Pokédex reads `?gen=` (`generationFromParam` in `src/lib/generations.ts`, which now also lists each generation's first and last number), and only lists that generation's Pokémon: infinite scroll, search and the type filter all stay inside it, and changing generation starts the list from the top. A new "Filter by generation" dropdown next to the type filter does the same, and a bar above the list ("Generation 2 · Johto (No. 152–251)") has a "Show all Pokémon" button to go back to the whole list. Picking a Pokémon keeps `?gen=` in the address. An unknown generation (`?gen=9`) shows everything. The Favorites page has the dropdown too ("Show all favorites", and "No favorites from this generation yet."). On phones the search bar gets its own row above the two dropdowns.

Done when: the five homepage buttons open the Pokédex at Nos. 1, 152, 252, 387 and 494 with only that generation's Pokémon; scrolling Gen 3 loads No. 302 and never leaves Gen 3; searching "pika" finds Pikachu in Gen 1 and nothing in Gen 2; picking Mudkip goes to /pokedex/258?gen=3; "Show all Pokémon" goes back to Bulbasaur and /pokedex/258; and at 375 pixels wide the search bar is readable.

## Task 46: Favorites in the Team Builder ✅
- **Pick from favorites:** the picker gets "All Pokémon" and "★ Favorites (n)" tabs. Favorites lists only the starred Pokémon not already in the team, searchable like the full list, with a message when there are none ("Star Pokémon in the Pokédex to pick them here"), when all are already in the team, or when none match. Favorites are starred in the full list too.
- **Favorite teams:** each team box on `/teams` has a ☆ button (★ when starred) left of "Delete", and the editor has "☆ Add to favorite teams" / "★ Favorite team". Starred teams are listed first; each group keeps the order the teams were made in. Teams save `favorite: true/false`; teams saved before this load as not starred.

Done when: with Charizard and Mewtwo starred, the Favorites tab shows only those two and picking Mewtwo adds it; a favorite already in the team isn't offered; starring Sand in Rain, Sun, Sand lists Sand, Rain, Sun, then starring Sun lists Sun, Sand, Rain; unstarring moves a team back; a star from the editor shows on `/teams`; and the stars are still there after a reload.

## Task 47: Team Builder button on the homepage ✅
The homepage's buttons are now "Browse the Pokédex", "My favorites" and "Team Builder", which opens `/teams`.

Done when: the button opens the Team Builder, and the three buttons wrap neatly on a phone.

## Task 48: Pokémon Solid titles and themed Team Builder dropdowns ✅
- **Font:** titles and headings (the app name, page headings, "Browse by generation", card names, team names and the generation buttons) use Pokémon Solid by IPBP, the Pokémon logo's lettering, from https://www.fontspace.com/pokemon-solid-font-f13844 (Creative Commons Attribution, credited on the About page and in the README). The app's name in the menu and on the homepage is yellow with a blue outline, like the logo. The font comes with the site (`src/assets/fonts/pokemon-solid.ttf`), so the Content Security Policy now allows fonts from the site itself; `ascent-override` and `descent-override` move its letters up to line up with other text. Everything else keeps the card font. The "✦ Legendary" and "✦ Mythical" marks inside card titles keep the card font. (A pixel font was tried first and rolled back.)
- **Dropdowns:** the Team Builder's dropdowns (Smogon build, item, ability, moves and nature) are rounded with a gold frame, a cream background, a little Poké Ball and an arrow (only the arrow on the narrow move dropdowns), and turn red on hover and focus. In Chrome and Edge 135 and later (`appearance: base-select`), the open list is styled too: a cream card with a gold frame, rounded choices, a red hover, the chosen one in gold, and the build formats as small red headings. Other browsers show their own list. The EV boxes have the same gold frame.

Done when: the titles show Pokémon Solid (including the "é" in Pokédex) without overlapping the text below at 1280 and 375 pixels wide, nothing is blocked by the Content Security Policy, the open build, ability and move lists look as described in Chrome on a computer and on a phone, and all tests pass.

## Task 49: Pokémon Hollow for titles, Pokémon Solid for the logo and homepage ✅
Titles and headings outside the homepage (card names, team names, page headings) use Pokémon Hollow, the outline version of Pokémon Solid by the same designer (IPBP, https://www.fontspace.com/pokemon-hollow-font-f13845, also Creative Commons Attribution, also bundled with the site as `src/assets/fonts/pokemon-hollow.ttf`). Its outline is thin at smaller sizes, so smaller titles get a slightly thicker line (`-webkit-text-stroke`). The logo in the menu and everything on the homepage (the big title, "Browse by generation", the Gen buttons and the Pokémon of the day's name) keep the filled Pokémon Solid. Both fonts are credited on the About page and in the README. (Pocket Monk was also tried, on this computer only: its free license is non-commercial and doesn't allow a font on a public website, so it isn't used.)

Done when: the menu logo and homepage titles show Pokémon Solid, the Pokédex and Team Builder card names show Pokémon Hollow and are readable on legendary cards too, nothing is blocked by the Content Security Policy, and all tests pass.

## Task 50: A pastel gradient background, with panels under text ✅
The plain beige page background becomes a soft pastel gradient: pink, peach, mint, baby blue and lavender (the same pastels at dusk in dark mode). A brighter yellow-to-purple gradient was tried first and replaced. It is drawn on its own fixed layer (`body::before`), so it stays put while the page scrolls, also on phones, which ignore `background-attachment: fixed`. Everything that used to sit straight on the background now sits on a soft, slightly see-through rounded panel (`--panel`, with a light blur), so it stays easy to read: the menu (with the yellow line now along its bottom edge), the homepage's title and intro and "Browse by generation", the Team Builder's heading and its "No teams yet" hint, the team editor's name, buttons and export (wrapped in a new `team-editor-header`), the About page's heading and fine print, "Page not found" and "Team not found", and the Pokédex's "Pick a Pokémon" hint. The Pokédex card's panel is see-through now, so the gradient shows around the card. Headings in Pokémon Hollow outside the homepage get the slightly thicker outline too.

Also: an integration test sometimes failed on a busy computer (about 1 run in 30, always right after other heavy work). The integration tests now wait up to 5 seconds for something to appear (`asyncUtilTimeout`, 1 second by default) and each test may take up to 15 seconds (`testTimeout`), which doesn't hide real failures: a test still fails if what it waits for never appears.

Done when: every page (Home, Pokédex, a legendary card, Team Builder, a team, About, "Page not found") shows the gradient with all text on a panel, in light and dark mode, at 1280 and 375 pixels wide, and all tests pass.

## Task 51: A dark mode button ✅
A round 🌙 button at the end of the menu switches to dark mode (☀️ switches back). Until it is used, the site follows the computer's setting, and changes with it; once used, the choice is saved in this browser (localStorage key `theme`) and put on `<html>` as `data-theme="dark"` or `"light"`, which the CSS reads alongside `prefers-color-scheme`. `src/main.tsx` applies a saved choice before the first render, so the page never flashes the wrong mode. Dark mode's gradient is darker and soft: the pastels at night (plum, deep teal and navy). The hook is `useTheme` in `src/lib/theme.ts` and the button `src/components/ThemeToggle.tsx`.

Done when: on a light computer the button shows 🌙 and nothing is saved; clicking it turns every page dark with the dark gradient and panels, saves "dark", and the next visit opens dark; clicking again goes back to light; a dark computer starts dark without saving anything; and the integration and end-to-end tests check all of this.

## Task 52: A see-through band down the middle of the page ✅
A 50% see-through band runs down the middle of every page, between the gradient and the content: white in light mode, near-black in dark mode, a little wider than the content (up to 1180 pixels), with soft faded sides. The edges, where the sprites peek in, stay uncovered. It is a fixed layer (`body::after`), so it stays put while scrolling.

Done when: at 1600 pixels wide the band covers the menu, list and card but not the edge sprites, in light and dark mode.

## Task 53: A Shiny button on the Pokédex card ✅
A "✨ Shiny: Off / On" button next to "3D effect" swaps the card's artwork for the Pokémon's shiny (different colored) version, from PokéAPI's `sprites.other['official-artwork'].front_shiny` (or the small `front_shiny` sprite if there is no shiny artwork), which comes in the same request as the rest of the card. The choice is remembered in this browser (localStorage key `shiny`), so other Pokémon and later visits open shiny too. The picture's text says "shiny charizard". For a Pokémon without any shiny picture, the button is off and the usual artwork shows.

Done when: Pikachu's card swaps to its shiny artwork and back, Charizard then opens shiny, a reload keeps it, a Pokémon without shiny pictures shows its usual artwork with the button off, and the real shiny artwork loads on the live data.
