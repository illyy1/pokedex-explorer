// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

// motionAccess.ts decides at load time what this browser can do, so each
// test pretends to be a browser first and then loads a fresh copy of it.

type Answer = 'granted' | 'denied' | 'throws'

// Loads motionAccess.ts in a browser with no motion events at all, with
// them (like Android and computers), or with them behind a question (iPhone).
async function loadIn(browser: 'no sensor' | 'android' | { iphone: Answer }) {
  vi.resetModules()
  if (browser !== 'no sensor') {
    class FakeDeviceOrientationEvent extends Event {}
    const iphone = typeof browser === 'object' ? browser.iphone : null
    const ask = vi.fn(async () => {
      if (iphone === 'throws') throw new Error('Must be called from a tap')
      return iphone
    })
    vi.stubGlobal(
      'DeviceOrientationEvent',
      iphone ? Object.assign(FakeDeviceOrientationEvent, { requestPermission: ask }) : FakeDeviceOrientationEvent,
    )
    return { ...(await import('../../src/lib/motionAccess')), ask }
  }
  // jsdom has the event, so take it away.
  vi.stubGlobal('DeviceOrientationEvent', undefined)
  return { ...(await import('../../src/lib/motionAccess')), ask: vi.fn() }
}

// A sensor reading, as the browser would send it.
function sendReading(beta: number | null) {
  window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta, gamma: 0 }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('requestMotionAccess', () => {
  it('says "unsupported" when the browser has no motion events', async () => {
    const { requestMotionAccess } = await loadIn('no sensor')
    expect(await requestMotionAccess()).toBe('unsupported')
  })

  it('needs no question on Android and computers', async () => {
    const { requestMotionAccess, ask } = await loadIn('android')
    expect(await requestMotionAccess()).toBe('not-needed')
    expect(ask).not.toHaveBeenCalled()
  })

  it('asks on iPhone, and remembers a yes', async () => {
    const { requestMotionAccess, ask } = await loadIn({ iphone: 'granted' })
    expect(await requestMotionAccess()).toBe('granted')
    // It doesn't ask again.
    expect(await requestMotionAccess()).toBe('granted')
    expect(ask).toHaveBeenCalledTimes(1)
  })

  it('remembers a no', async () => {
    const { requestMotionAccess } = await loadIn({ iphone: 'denied' })
    expect(await requestMotionAccess()).toBe('denied')
  })

  it('stays "unknown" so the next tap can ask again when asking fails', async () => {
    const { requestMotionAccess } = await loadIn({ iphone: 'throws' })
    expect(await requestMotionAccess()).toBe('unknown')
  })

  it('counts a sensor reading as a yes from an earlier visit', async () => {
    const { requestMotionAccess, ask } = await loadIn({ iphone: 'denied' })
    // An empty reading (some browsers send one at the start) doesn't count.
    sendReading(null)
    sendReading(12)
    expect(await requestMotionAccess()).toBe('granted')
    expect(ask).not.toHaveBeenCalled()
  })
})

describe('canReadMotion', () => {
  it('only reads the sensor when allowed or no question is needed', async () => {
    const { canReadMotion } = await loadIn('no sensor')
    expect(canReadMotion('not-needed')).toBe(true)
    expect(canReadMotion('granted')).toBe(true)
    expect(canReadMotion('unknown')).toBe(false)
    expect(canReadMotion('denied')).toBe(false)
    expect(canReadMotion('unsupported')).toBe(false)
  })
})

describe('isTouchScreen', () => {
  function pretend({ touchPoints, coarse }: { touchPoints: number; coarse: boolean }) {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: touchPoints, configurable: true })
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: coarse && query.includes('coarse') }))
  }

  afterEach(() => {
    delete (navigator as { maxTouchPoints?: number }).maxTouchPoints
  })

  it('is true for phones, including Samsung phones that say they can hover', async () => {
    const { isTouchScreen } = await loadIn('android')
    pretend({ touchPoints: 5, coarse: false })
    expect(isTouchScreen()).toBe(true)
  })

  it('is true for a coarse pointer without touch points', async () => {
    const { isTouchScreen } = await loadIn('android')
    pretend({ touchPoints: 0, coarse: true })
    expect(isTouchScreen()).toBe(true)
  })

  it('is false for a computer with a mouse', async () => {
    const { isTouchScreen } = await loadIn('android')
    pretend({ touchPoints: 0, coarse: false })
    expect(isTouchScreen()).toBe(false)
  })
})
