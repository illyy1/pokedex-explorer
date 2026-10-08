import { useEffect, useState } from 'react'

// An on/off setting that is remembered in this browser's localStorage.
// If storage is blocked (for example in a private window), the setting
// still works until the page is closed.
export function useStoredToggle(key: string, initial: boolean): [boolean, () => void] {
  const [on, setOn] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved === null ? initial : saved === 'true'
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, String(on))
    } catch {
      // Saving failed; keep the setting for this visit only.
    }
  }, [key, on])

  return [on, () => setOn((current) => !current)]
}
