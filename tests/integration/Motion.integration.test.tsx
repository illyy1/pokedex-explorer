// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setUpFakeBrowser } from '../helpers/renderApp'

// The 3D button on phones and tablets. The app works out what the motion
// sensor allows when it loads, so each test pretends to be a touch screen
// first and then loads a fresh copy of the app.

setUpFakeBrowser()

type Phone = 'no sensor' | 'android' | { iphone: 'granted' | 'denied' }

async function openOnPhone(phone: Phone, path = '/pokedex/25') {
  vi.resetModules()
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true })
  const ask = vi.fn(async () => (typeof phone === 'object' ? phone.iphone : 'granted'))
  if (phone === 'no sensor') {
    vi.stubGlobal('DeviceOrientationEvent', undefined)
  } else {
    class FakeDeviceOrientationEvent extends Event {}
    vi.stubGlobal(
      'DeviceOrientationEvent',
      typeof phone === 'object'
        ? Object.assign(FakeDeviceOrientationEvent, { requestPermission: ask })
        : FakeDeviceOrientationEvent,
    )
  }
  // A fresh copy of the app and of Testing Library, loaded after the pretending.
  const { renderApp } = await import('../helpers/renderApp')
  const { screen, cleanup } = await import('@testing-library/react')
  const user = renderApp(path)
  await screen.findByRole('article', { name: 'pikachu card' })
  return { user, screen, cleanup, ask }
}

let cleanUp: (() => void) | undefined
afterEach(() => {
  cleanUp?.()
  cleanUp = undefined
  delete (navigator as { maxTouchPoints?: number }).maxTouchPoints
})

describe('3D button on phones', () => {
  it('works straight away on Android', async () => {
    const { screen, cleanup, ask } = await openOnPhone('android')
    cleanUp = cleanup
    const toggle = screen.getByRole('button', { name: '3D effect: On' })
    expect(toggle).toHaveAttribute('title', 'Make the card tilt as you tilt your phone')
    expect(ask).not.toHaveBeenCalled()
  })

  it('says "Tap to start" on iPhone, and asks when tapped', async () => {
    const { user, screen, cleanup, ask } = await openOnPhone({ iphone: 'granted' })
    cleanUp = cleanup
    await user.click(screen.getByRole('button', { name: '3D effect: Tap to start' }))
    expect(ask).toHaveBeenCalledTimes(1)
    // The tap only asked; the effect is still on.
    expect(await screen.findByRole('button', { name: '3D effect: On' })).toBeInTheDocument()
  })

  it('shows "Not available" when the iPhone says no', async () => {
    const { user, screen, cleanup } = await openOnPhone({ iphone: 'denied' })
    cleanUp = cleanup
    await user.click(screen.getByRole('button', { name: '3D effect: Tap to start' }))
    const toggle = await screen.findByRole('button', { name: '3D effect: Not available' })
    expect(toggle).toBeDisabled()
    expect(toggle.getAttribute('title')).toMatch(/Motion access was turned down/)
  })

  it('skips the question when a reading arrives without asking', async () => {
    const { screen, cleanup, ask } = await openOnPhone({ iphone: 'denied' })
    cleanUp = cleanup
    const { act } = await import('@testing-library/react')
    act(() => {
      window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta: 20, gamma: 0 }))
    })
    expect(await screen.findByRole('button', { name: '3D effect: On' })).toBeInTheDocument()
    expect(ask).not.toHaveBeenCalled()
  })

  it('shows "Not available" on a touch screen without a motion sensor', async () => {
    const { screen, cleanup } = await openOnPhone('no sensor')
    cleanUp = cleanup
    const toggle = screen.getByRole('button', { name: '3D effect: Not available' })
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveAttribute('title', "This device doesn't share how it is tilted.")
  })
})
