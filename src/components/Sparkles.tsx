import type { CSSProperties } from 'react'

// Where each sparkle sits on the card (in %), how big it is (in px) and when
// it starts twinkling (in s). Fixed positions look the same every time.
const SPARKLES = [
  { top: 7, left: 12, size: 30, delay: 0 },
  { top: 15, left: 84, size: 44, delay: 0.8 },
  { top: 24, left: 40, size: 22, delay: 1.6 },
  { top: 33, left: 70, size: 36, delay: 0.3 },
  { top: 40, left: 20, size: 26, delay: 2.1 },
  { top: 46, left: 8, size: 40, delay: 1.1 },
  { top: 52, left: 90, size: 28, delay: 1.9 },
  { top: 60, left: 52, size: 20, delay: 0.6 },
  { top: 68, left: 28, size: 34, delay: 2.4 },
  { top: 75, left: 78, size: 38, delay: 0.4 },
  { top: 83, left: 14, size: 24, delay: 1.4 },
  { top: 90, left: 58, size: 30, delay: 2.0 },
]

// Twinkling four-pointed stars over a legendary or mythical card.
function Sparkles() {
  return (
    <span className="sparkles" aria-hidden="true">
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              '--size': `${s.size}px`,
              '--delay': `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}

export default Sparkles
