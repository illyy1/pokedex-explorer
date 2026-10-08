import { useSyncExternalStore } from 'react'

// Whether the page may read the phone's motion sensor (how it is tilted),
// which the 3D card effect uses on touch screens.
// - 'not-needed': the browser gives it without asking (Android, computers).
// - 'unknown': the browser asks first (iPhone and iPad), and hasn't yet.
// - 'granted' / 'denied': the person answered.
// - 'unsupported': the browser has no motion sensor events at all.
export type MotionAccess = 'not-needed' | 'unknown' | 'granted' | 'denied' | 'unsupported'

// Safari's extra method for asking; other browsers don't have it.
type AskingDeviceOrientationEvent = {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

function askFunction(): AskingDeviceOrientationEvent['requestPermission'] {
  if (typeof DeviceOrientationEvent === 'undefined') return undefined
  return (DeviceOrientationEvent as unknown as AskingDeviceOrientationEvent).requestPermission
}

function startingAccess(): MotionAccess {
  if (typeof DeviceOrientationEvent === 'undefined') return 'unsupported'
  return askFunction() ? 'unknown' : 'not-needed'
}

let access: MotionAccess = startingAccess()
const listeners = new Set<() => void>()

function setAccess(next: MotionAccess) {
  access = next
  for (const listener of listeners) listener()
}

// Safari may remember a "yes" from earlier. If sensor readings arrive
// without asking, access was already granted.
if (access === 'unknown') {
  const notice = (event: DeviceOrientationEvent) => {
    if (event.beta === null) return
    window.removeEventListener('deviceorientation', notice)
    if (access === 'unknown') setAccess('granted')
  }
  window.addEventListener('deviceorientation', notice)
}

// Asks for access. Safari only shows its question when this runs from a
// tap, so call it from a click handler.
export async function requestMotionAccess(): Promise<MotionAccess> {
  const ask = askFunction()
  if (!ask || access !== 'unknown') return access
  try {
    setAccess((await ask()) === 'granted' ? 'granted' : 'denied')
  } catch {
    // Not from a tap, or blocked; try again next tap.
  }
  return access
}

export function useMotionAccess(): MotionAccess {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => access,
  )
}

// Phones and tablets: a touch screen and no mouse to hover with. These tilt
// the card with the motion sensor instead of the mouse.
export function isTouchScreen(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

export function canReadMotion(access: MotionAccess): boolean {
  return access === 'not-needed' || access === 'granted'
}
