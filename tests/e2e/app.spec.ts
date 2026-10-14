import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// End-to-end tests: the built site in a real browser, with real PokéAPI and
// Smogon data. They check whole journeys through the site, plus things the
// integration tests can't: real scrolling, reloading the page, downloads and
// the Content Security Policy that is only in the built site.

// Errors the page logs, such as blocked requests or crashes.
function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

function pokemonList(page: Page) {
  return page.getByRole('region', { name: 'Pokémon list' })
}

test('finds a Pokémon from the home page and opens its card', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Pokédex Explorer', level: 1 })).toBeVisible()

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Pokédex', exact: true }).click()
  await expect(page).toHaveURL(/\/pokedex$/)
  await expect(pokemonList(page).getByRole('button', { name: /bulbasaur/i })).toBeVisible()

  await page.getByRole('searchbox', { name: /search pokémon/i }).fill('pikachu')
  await pokemonList(page).getByRole('button', { name: /pikachu/i }).click()
  await expect(page).toHaveURL(/\/pokedex\/25$/)

  const card = page.getByRole('article', { name: 'pikachu card' })
  await expect(card.getByRole('heading', { name: /pikachu/i })).toBeVisible()
  await expect(card.getByText('Mouse Pokémon')).toBeVisible()
  // Smogon has Generation 5 builds for Pikachu.
  await expect(page.getByRole('region', { name: 'Recommended builds' }).locator('.build').first()).toBeVisible()

  // Nothing was blocked by the Content Security Policy, and nothing crashed.
  expect(errors).toEqual([])
})

test('opens a card straight from its address', async ({ page }) => {
  await page.goto('./pokedex/150')
  await expect(page.getByRole('article', { name: 'mewtwo card' })).toBeVisible()
})

test('loads more Pokémon when the list is scrolled to the end', async ({ page }) => {
  await page.goto('./pokedex')
  const list = pokemonList(page)
  await expect(list.getByRole('button', { name: /No\. 50\b/ })).toBeAttached()
  await expect(list.getByRole('button', { name: /No\. 51\b/ })).not.toBeAttached()

  // Keep scrolling until the next page of Pokémon arrives.
  await expect(async () => {
    await list.getByRole('button').last().scrollIntoViewIfNeeded()
    await expect(list.getByRole('button', { name: /No\. 51\b/ })).toBeAttached({ timeout: 1000 })
  }).toPass()
})

test('keeps favorites after the page is reloaded', async ({ page }) => {
  await page.goto('./pokedex/6')
  await page.getByRole('button', { name: 'Add charizard to favorites' }).click()
  await expect(page.getByRole('button', { name: 'Remove charizard from favorites' })).toBeVisible()

  await page.reload()
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Favorites' }).click()
  await expect(pokemonList(page).getByRole('button', { name: /charizard/i })).toBeVisible()
  await expect(pokemonList(page).getByRole('button')).toHaveCount(1)
})

test('builds a team and saves it as a text file for Showdown', async ({ page }) => {
  await page.goto('./teams')
  await page.getByRole('button', { name: /new team/i }).click()
  await page.getByRole('textbox', { name: 'Team name' }).fill('E2E Team')

  await page.getByRole('button', { name: /add pokémon/i }).click()
  await page.getByRole('searchbox', { name: 'Search for a Pokémon to add' }).fill('pikachu')
  await page.locator('.picker-list').getByRole('button', { name: /pikachu/i }).click()
  await expect(page.getByText(/1\/6 Pokémon/)).toBeVisible()

  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Save as text file' }).click()
  const download = await downloading
  const text = await readFile(await download.path(), 'utf8')
  expect(text).toContain('Pikachu')

  // The team is still there after a reload.
  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Team name' })).toHaveValue('E2E Team')
  await page.getByRole('link', { name: /all teams/i }).click()
  await expect(page.getByRole('link', { name: /E2E Team/ })).toBeVisible()
})

test.describe('3D tilt', () => {
  // The wrapper around the card gets the "tilting" class while it is turned.
  function tiltWrapper(page: Page) {
    return page.locator('.tilt-wrapper')
  }

  test('the card leans toward the mouse', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Phones tilt with the motion sensor instead.')
    await page.goto('./pokedex/25')
    const card = page.getByRole('article', { name: 'pikachu card' })
    await expect(card).toBeVisible()

    const box = (await card.boundingBox())!
    // Near the top-right corner: the card turns right and tips back.
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1)
    await expect(tiltWrapper(page)).toHaveClass(/tilting/)
    const ry = await tiltWrapper(page).evaluate((el) => parseFloat(el.style.getPropertyValue('--ry')))
    const rx = await tiltWrapper(page).evaluate((el) => parseFloat(el.style.getPropertyValue('--rx')))
    expect(ry).toBeGreaterThan(0)
    expect(rx).toBeGreaterThan(0)

    // Moving off the card lays it flat again.
    await page.mouse.move(0, 0)
    await expect(tiltWrapper(page)).not.toHaveClass(/tilting/)
  })

  test('the card tilts with the phone', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only phones use the motion sensor.')
    await page.goto('./pokedex/25')
    await expect(page.getByRole('article', { name: 'pikachu card' })).toBeVisible()

    // Pretend to be the motion sensor: the phone held still, then turned 10° to the side.
    function tiltPhone(gammas: number[]) {
      return page.evaluate((gammas) => {
        for (const gamma of gammas) {
          window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { beta: 40, gamma }))
        }
      }, gammas)
    }
    // Chromium, like iPhones, asks before sharing the sensor. The app takes a
    // first reading as a "yes" and starts tilting from the next ones.
    await tiltPhone([0])
    await expect(page.getByRole('button', { name: '3D effect: On' })).toBeVisible()
    await expect(async () => {
      await tiltPhone([0, 10])
      await expect(tiltWrapper(page)).toHaveClass(/tilting/, { timeout: 500 })
    }).toPass()
  })

  test('the card stays flat when the 3D effect is off', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Uses the mouse.')
    await page.goto('./pokedex/25')
    await page.getByRole('button', { name: '3D effect: On' }).click()
    await expect(page.getByRole('button', { name: '3D effect: Off' })).toBeVisible()

    const box = (await page.getByRole('article', { name: 'pikachu card' }).boundingBox())!
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1)
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2)
    await expect(tiltWrapper(page)).not.toHaveClass(/tilting/)

    // Still off after a reload.
    await page.reload()
    await expect(page.getByRole('button', { name: '3D effect: Off' })).toBeVisible()
  })

  test('the card stays flat for people who asked for less motion', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Uses the mouse.')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./pokedex/25')
    const box = (await page.getByRole('article', { name: 'pikachu card' }).boundingBox())!
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1)
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2)
    await expect(tiltWrapper(page)).not.toHaveClass(/tilting/)
  })

  test('a legendary card sparkles', async ({ page }) => {
    await page.goto('./pokedex/150')
    const card = page.getByRole('article', { name: 'mewtwo card' })
    await expect(card).toHaveClass(/holo-rare/)
    await expect(card.locator('.sparkle')).toHaveCount(12)
  })
})

test('the About page loads all its pictures and fits the screen', async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto('./about')
  await expect(page.getByRole('article', { name: 'Pokédex Explorer' })).toBeVisible()

  // Every sprite in the Trainer card loaded (none blocked or missing).
  const sprites = page.locator('.trainer-art img')
  await expect(sprites).toHaveCount(9)
  for (const sprite of await sprites.all()) {
    await expect(sprite).toHaveJSProperty('complete', true)
    expect(await sprite.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  }

  // Nothing sticks out sideways, even on a phone.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
  expect(errors).toEqual([])
})

test('exports a team with a real Smogon build to Showdown', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  // Don't really load Showdown; just check that it is opened.
  await context.route('https://play.pokemonshowdown.com/**', (route) =>
    route.fulfill({ body: '<title>Showdown</title>', contentType: 'text/html' }),
  )

  await page.goto('./teams')
  await page.getByRole('button', { name: /new team/i }).click()
  await page.getByRole('button', { name: /add pokémon/i }).click()
  await page.getByRole('searchbox', { name: 'Search for a Pokémon to add' }).fill('garchomp')
  await page.locator('.picker-list').getByRole('button', { name: /garchomp/i }).click()

  // Pick the first Smogon build in the list.
  const builds = page.getByRole('combobox', { name: 'Smogon build' })
  await expect(builds.locator('option').nth(1)).toBeAttached()
  await builds.selectOption({ index: 1 })
  await expect(page.getByRole('combobox', { name: 'Move 1' })).not.toHaveValue('')

  const opening = context.waitForEvent('page')
  await page.getByRole('button', { name: 'Export to Showdown' }).click()
  const showdown = await opening
  await expect(showdown).toHaveURL('https://play.pokemonshowdown.com/teambuilder')
  await expect(page.getByRole('status')).toContainText('Team copied!')

  // What was copied is a complete set in Showdown's format.
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  // Windows ends lines on the clipboard with \r\n.
  const lines = copied.split(/\r?\n/)
  expect(lines[0]).toMatch(/^Garchomp @ \S/)
  expect(lines).toContainEqual(expect.stringMatching(/^Ability: /))
  expect(lines).toContainEqual(expect.stringMatching(/^EVs: \d+ /))
  expect(lines).toContainEqual(expect.stringMatching(/^\w+ Nature$/))
  expect(lines.filter((line) => line.startsWith('- '))).toHaveLength(4)
})

test('the Pokémon of the day opens its own card', async ({ page }) => {
  await page.goto('./')
  const featured = page.getByRole('region', { name: 'Pokémon of the day' }).getByRole('link')
  // The card's footer says "227/649"; its picture has loaded.
  await expect(featured.locator('.card-art img')).toHaveJSProperty('complete', true)
  const number = (await featured.locator('.card-footer span').last().textContent())!.split('/')[0]
  await expect(featured).toContainText(/Gen \d · \w+/)

  await featured.click()
  await expect(page).toHaveURL(new RegExp(`/pokedex/${number}$`))
  await expect(page.locator('.poke-card .card-flavor-number')).toHaveText(`No. ${number}`)
})

test('an unknown address shows "Page not found"', async ({ page }) => {
  await page.goto('./no-such-page')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back to Home' }).click()
  await expect(page.getByRole('heading', { name: 'Pokédex Explorer', level: 1 })).toBeVisible()
})

test('browses one generation from the home page and goes back to all', async ({ page }) => {
  await page.goto('./')
  await page
    .getByRole('region', { name: 'Browse by generation' })
    .getByRole('link', { name: /^Gen 3/ })
    .click()
  await expect(page).toHaveURL(/\/pokedex\?gen=3$/)
  const list = pokemonList(page)
  await expect(list.locator('.row').first()).toContainText('treecko')
  await expect(list.getByRole('button', { name: /bulbasaur/i })).not.toBeAttached()

  // Infinite scroll stays inside the generation: No. 302 comes after No. 301.
  await expect(async () => {
    await list.locator('.row').last().scrollIntoViewIfNeeded()
    await expect(list.getByRole('button', { name: /No\. 302(?!\d)/ })).toBeAttached({ timeout: 1000 })
  }).toPass()

  // Picking a Pokémon keeps the generation in the address.
  await list.getByRole('button', { name: /mudkip/i }).click()
  await expect(page).toHaveURL(/\/pokedex\/258\?gen=3$/)

  await list.getByRole('button', { name: 'Show all Pokémon' }).click()
  await expect(page).toHaveURL(/\/pokedex\/258$/)
  await expect(list.locator('.row').first()).toContainText('bulbasaur')
})

test('builds a team from favorite Pokémon and stars it', async ({ page }) => {
  await page.goto('./pokedex/445')
  await page.getByRole('button', { name: 'Add garchomp to favorites' }).click()

  await page.goto('./teams')
  await page.getByRole('button', { name: /new team/i }).click()
  await page.getByRole('button', { name: /add pokémon/i }).click()
  await page.getByRole('button', { name: '★ Favorites (1)' }).click()
  await expect(page.locator('.picker-list button')).toHaveCount(1)
  await page.locator('.picker-list').getByRole('button', { name: /garchomp/i }).click()
  await expect(page.getByRole('button', { name: 'Remove Garchomp' })).toBeVisible()

  await page.getByRole('button', { name: '☆ Add to favorite teams' }).click()
  await page.getByRole('link', { name: /all teams/i }).click()
  await page.getByRole('button', { name: /new team/i }).click()
  await page.getByRole('link', { name: /all teams/i }).click()
  // The starred team stays first, above the newer one.
  await expect(page.locator('.team-box-name')).toHaveText(['Team 1', 'Team 2'])
  await expect(page.getByRole('button', { name: 'Remove Team 1 from favorites' })).toBeVisible()
})
