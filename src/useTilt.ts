import { useEffect, useRef } from 'react'

// How far the card can turn, in degrees. The card is tall, so it tips
// forward and back less than it turns left and right.
const MAX_TILT_X = 8
const MAX_TILT_Y = 14
// How far its shadow moves, in pixels.
const MAX_SHADOW_SHIFT = 18

// Makes a card tilt toward the mouse in 3D. Put the returned ref on a
// wrapper around the card: the wrapper does not move, so measuring it
// stays steady while the card inside turns. The position is passed to
// CSS as variables (--rx, --ry, --mx, --my, --sx, --sy), so React does
// not need to re-render on every mouse move. When `enabled` is false
// (the 3D effect is turned off), the card stays flat.
export function useTilt<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const wrapper = ref.current
    if (!wrapper || !enabled) return
    // People who asked their system for less motion get a still card.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    function handleMove(event: PointerEvent) {
      // Only the mouse: on touch screens, tilting would fight with scrolling.
      if (event.pointerType !== 'mouse' || !wrapper) return
      const rect = wrapper.getBoundingClientRect()
      // Where the pointer is, from 0 (left/top) to 1 (right/bottom).
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      // Update at most once per frame, which is all the screen can show.
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        wrapper.classList.add('tilting')
        wrapper.style.setProperty('--rx', `${(0.5 - y) * 2 * MAX_TILT_X}deg`)
        wrapper.style.setProperty('--ry', `${(x - 0.5) * 2 * MAX_TILT_Y}deg`)
        wrapper.style.setProperty('--mx', `${x * 100}%`)
        wrapper.style.setProperty('--my', `${y * 100}%`)
        wrapper.style.setProperty('--sx', `${(0.5 - x) * 2 * MAX_SHADOW_SHIFT}px`)
        wrapper.style.setProperty('--sy', `${(0.5 - y) * 2 * MAX_SHADOW_SHIFT + 12}px`)
      })
    }

    // When the mouse leaves, the card eases back to lying flat.
    function handleLeave() {
      cancelAnimationFrame(frame)
      if (!wrapper) return
      wrapper.classList.remove('tilting')
      for (const name of ['--rx', '--ry', '--mx', '--my', '--sx', '--sy']) {
        wrapper.style.removeProperty(name)
      }
    }

    wrapper.addEventListener('pointermove', handleMove)
    wrapper.addEventListener('pointerleave', handleLeave)
    return () => {
      wrapper.removeEventListener('pointermove', handleMove)
      wrapper.removeEventListener('pointerleave', handleLeave)
      // If the effect is turned off mid-tilt, lay the card flat again.
      handleLeave()
    }
  }, [enabled])

  return ref
}
