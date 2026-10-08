import { useEffect, useRef } from 'react'
import { canReadMotion, useMotionAccess } from './motionAccess'

// How far the card can turn, in degrees. The card is tall, so it tips
// forward and back less than it turns left and right.
const MAX_TILT_X = 8
const MAX_TILT_Y = 14
// How far its shadow moves, in pixels.
const MAX_SHADOW_SHIFT = 18
// On phones: how far the phone must be tilted, in degrees, to turn the card
// all the way.
const PHONE_TILT_RANGE = 20
// On phones: how quickly the card settles back to flat around however the
// phone is being held (a little of the way on each sensor reading, about
// 60 per second, so it takes a few seconds).
const SETTLE_RATE = 0.01
// How long after the mouse last moved that motion readings are ignored, in ms.
const MOUSE_PRIORITY_MS = 1500

// An angle difference between -180 and 180 degrees.
function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// The phone's tilt as left/right and forward/back of the screen, which
// depends on whether it is held upright or sideways.
function screenTilt(beta: number, gamma: number): [number, number] {
  switch (screen.orientation?.angle ?? 0) {
    case 90:
      return [beta, -gamma]
    case 180:
      return [-gamma, -beta]
    case 270:
      return [-beta, gamma]
    default:
      return [gamma, beta]
  }
}

// Makes a card tilt in 3D: toward the mouse on a computer, and with the
// phone's motion sensor on a phone or tablet. Put the returned ref on a
// wrapper around the card: the wrapper does not move, so measuring it
// stays steady while the card inside turns. The tilt is passed to CSS as
// variables (--rx, --ry, --mx, --my, --sx, --sy), so React does not need to
// re-render on every move. When `enabled` is false (the 3D effect is
// turned off), the card stays flat.
export function useTilt<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null)
  const motionAccess = useMotionAccess()

  useEffect(() => {
    const wrapper = ref.current
    if (!wrapper || !enabled) return
    // People who asked their system for less motion get a still card.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    // Leans the card toward a point on it, from 0 (left/top) to 1 (right/bottom).
    function tiltToward(x: number, y: number) {
      // Update at most once per frame, which is all the screen can show.
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!wrapper) return
        wrapper.classList.add('tilting')
        wrapper.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT_X}deg`)
        wrapper.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT_Y}deg`)
        wrapper.style.setProperty('--mx', `${x * 100}%`)
        wrapper.style.setProperty('--my', `${y * 100}%`)
        wrapper.style.setProperty('--sx', `${(0.5 - x) * 2 * MAX_SHADOW_SHIFT}px`)
        wrapper.style.setProperty('--sy', `${(0.5 - y) * 2 * MAX_SHADOW_SHIFT + 12}px`)
      })
    }

    // The card eases back to lying flat.
    function layFlat() {
      cancelAnimationFrame(frame)
      if (!wrapper) return
      wrapper.classList.remove('tilting')
      for (const name of ['--rx', '--ry', '--mx', '--my', '--sx', '--sy']) {
        wrapper.style.removeProperty(name)
      }
    }

    // When the mouse last moved over the card. While it is moving, it is in
    // charge, even on a laptop or tablet that also has a motion sensor.
    let lastMouseMove = -Infinity

    function handleMove(event: PointerEvent) {
      // Only the mouse: on touch screens, following a finger would fight
      // with scrolling, so phones use the motion sensor below instead.
      if (event.pointerType !== 'mouse' || !wrapper) return
      lastMouseMove = performance.now()
      const rect = wrapper.getBoundingClientRect()
      tiltToward((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
    }

    // The way the phone is being held, which counts as "flat". It starts at
    // the first reading and slowly follows the phone, so the card settles
    // back to flat whether the phone is held upright, tipped back or lying
    // on a table.
    let rest: [number, number] | null = null
    let restAngle = 0

    function handleOrientation(event: DeviceOrientationEvent) {
      if (event.beta === null || event.gamma === null) return
      if (performance.now() - lastMouseMove < MOUSE_PRIORITY_MS) return
      const [side, forward] = screenTilt(event.beta, event.gamma)
      const angle = screen.orientation?.angle ?? 0
      // Start again after the phone turns between upright and sideways.
      if (!rest || angle !== restAngle) {
        rest = [side, forward]
        restAngle = angle
      }
      const dSide = angleDiff(side, rest[0])
      const dForward = angleDiff(forward, rest[1])
      rest = [rest[0] + dSide * SETTLE_RATE, rest[1] + dForward * SETTLE_RATE]
      tiltToward(
        0.5 + clamp(dSide / PHONE_TILT_RANGE, -1, 1) / 2,
        0.5 + clamp(dForward / PHONE_TILT_RANGE, -1, 1) / 2,
      )
    }

    // Any device that sends motion readings tilts with them; computers
    // without a motion sensor never send any.
    wrapper.addEventListener('pointermove', handleMove)
    wrapper.addEventListener('pointerleave', layFlat)
    if (canReadMotion(motionAccess)) window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      wrapper.removeEventListener('pointermove', handleMove)
      wrapper.removeEventListener('pointerleave', layFlat)
      window.removeEventListener('deviceorientation', handleOrientation)
      // If the effect is turned off mid-tilt, lay the card flat again.
      layFlat()
    }
  }, [enabled, motionAccess])

  return ref
}
