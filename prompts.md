# Prompts

Every prompt I gave the AI assistant while planning and building Pokédex Explorer, in order and word for word.

## 1. Planning interview (PRD)

```text
You are a product manager helping a first-year student plan a small React web app.
The app is a master-detail app: a list of items, and a details panel for the item I click.
The data comes from a free public API that needs no key.

Interview me one question at a time, at most 8 questions, until you know:
who the app is for, what they want to do, which API to use,
and which fields to show in the list and in the details panel.
Talk with me in the language I write in.

Then write PRD.md in English: one page, plain language, no code, with these sections:
1. One-sentence pitch
2. Who it is for
3. Screens (list, details)
4. Must-have features (at most 5)
5. Acceptance criteria: 3 to 5 lines, each written as "When I ..., I see ..."
6. Not now (ideas for later)
7. Data: the API URL and the fields we use
```

## 2. Interview answer: who it is for

```text
the project is for pokemon enthusiests who want to learn more about their favorite pokemon
```

## 3. Interview answer: what they want to do

```text
i want the app to be able to do all of these
```

## 4. Interview answer: scope of the first version

```text
for the first prd just be able to press a pokemon to see the details about it
```

## 5. Interview answer: list fields

```text
name number picture and type
```

## 6. Interview answer: details fields

```text
short pokedex description, base stats, bigger picture, name number and type
```

## 7. Interview answer: how many Pokémon

```text
gen 1-5
```

## 8. Interview answer: how the list loads

```text
load 50 at a time
```

## 9. Task list

```text
Read the PRD above. Write tasks.md: at most 8 tasks, in build order.
Each task must be small enough for one commit, and end with a "Done when:" line.
Task 1: show the list using a few sample items saved in a local JSON file (no API yet).
Task 2: click an item to show its details.
No code.
```

## 10. Build tasks 1–3

```text
run the first 3 tasks from tasks.md
```

## 11. GitHub repo

```text
create a new repo for the project and push the first commit
```

## 12. GitHub login

```text
can you give me a line to run in the terminal for the login
```

## 13. GitHub login code (sent with a screenshot of GitHub's "Authorize your device" page)

```text
i didnt get a code in the app or email. what code is it referring to
```

## 14. Push the first commit

```text
ok i logged in now create a repo and push the commit
```

## 15. Question about missing details

```text
why are some pokemon details missing like ivysaur for example
```

## 16. Build tasks 4–6

```text
run tasks 4 to 6
```

## 17. Commit

```text
commit changes
```

## 18. Push

```text
push
```

## 19. Build tasks 7–8

```text
run tasks 7 and 8
```

## 20. Search bar

```text
add a search bar that responds to both the pokemon name and the pokedex number
```

## 21. Update docs and save prompts

```text
update prd and tasks, add a prompts.md file and post all the prompts i gave you into it
```

## 22. Push and make the repo public

```text
push the commits, make the repo public please
```

## 23. Email privacy

```text
my email addresses are already set to private in the settings
```

## 24. Choice: hide the email before going public

```text
2
```

## 25. Push status

```text
so did you push all recent changes or no
```

## 26. Ran the force-push and visibility commands

```text
i ran both commands
```

## 27. New tasks

```text
add to tasks, search by pokemon types, see pokemon weaknesses by their type, update css to a more sleek design
```

## 28. Update docs

```text
update both
```

## 29. Push

```text
push
```

## 30. Abilities and recommended builds

```text
update prd and prompts and tasks with this: add pokemon abilities, add recommended builds per pokemon
```

## 31. Matching names between the two data sources

```text
how do you recommend we handle this issue
```

## 32. Follow-up on matching

```text
cant you match names between the 2 apis?
```

## 33. Apply the recommendation

```text
make the changes and push
```

## 34. Pages, routing and favorites

```text
update the docs to include routing, include homepage, add the ability to favorite pokemon and then add a "favorite pokemon" tab to the routing, and an about page
```

## 35. Build tasks 10–12

```text
execute tasks 10 to 12
```

## 36. Save the prompt and push

```text
add the prompt and push
```

## 37. Infinite scroll

```text
add to the docs, instead of a "load more" button replace it with an infinite scroll that begins loading when you reach the end of the page
```

## 38. Build tasks 13–15

```text
execute tasks 13 to 15
```

## 39. Push

```text
push the changes
```

## 40. Build tasks 16–19 with a Pokémon card design (sent with an image of original Pokémon cards as a reference)

```text
execute tasks 16 to 19, when you get to the sleeker design part, i would like the design to be based on a traditional pokemon card, i attached an image with what i mean, try to replicate the font and layout
```

## 41. Push

```text
push
```

## 42. Redesign the About page

```text
change the design in the about section, it looks generic and boring
```

## 43. 3D cards

```text
i would like the pokemon card in the pokedex section to act as 3d cards that react to your mouse
```

## 44. Toggle the 3D effect and update the docs

```text
update the docs, add the option to toggle the 3d effect on and off
```

## 45. Legendary mark and sparkly cards (sent with an image of rainbow rare Pokémon cards as a reference)

```text
please add a mark for legendary pokemon, and give their cards a sparkly effect like the image attached
```

## 46. Team Builder

```text
please add to the routing a "team builder" option, this allows you to pick 6 pokemon, choose their abilities and their moves, you can build as many teams as you want and each one is saved to local storage just like the favorites tab
```

## 47. Update the docs (sent while the Team Builder was being built)

```text
update the docs  files
```

## 48. Fix the picker's scrolling

```text
fix the infinite scroll in the team builder route
```

## 49. Update the docs and push (sent while the fix was being tested)

```text
update the docs and push
```

## 50. Can a team go to Pokémon Showdown?

```text
is it possible to add a button to the team builder that allows you to extract the team you built into the pokemon showdown website??
```

## 51. A direct link to Showdown?

```text
could we do a direct link that automatically opens pokemon showdown with the team already built according to the specifications provided or is that not possible
```

## 52. Export to Showdown

```text
do option 1 and update the docs
```

## 53. Items, EVs and Smogon builds in the Team Builder

```text
add the option to add items to the team builder and edit EVs, also add the option to just choose a completed smogon build from the ones we imported
```
