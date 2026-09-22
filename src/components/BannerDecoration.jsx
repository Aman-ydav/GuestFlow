import { useMemo } from 'react'

// Deterministic PRNG (mulberry32) seeded per-flow so each banner's scatter is
// stable across renders/reloads but visibly different flow-to-flow — the
// "switch some variations" Aman asked for, without random reshuffling on
// every repaint.
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return h
}

const SHAPES = ['circle', 'plus', 'ring']

function ShapeSvg({ type, size }) {
  const half = size / 2
  if (type === 'plus') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'ring') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r={half > 4 ? 10 : 6} fill="currentColor" />
    </svg>
  )
}

/**
 * ~26 small solid-color shapes scattered across a banner — pure decoration,
 * seeded per `flowKey` so it's stable, not random-per-render. Concentrated
 * loosely toward the right/edges so it never fights the title text on the left.
 */
export function BannerDecoration({ flowKey, count = 26 }) {
  const shapes = useMemo(() => {
    const rand = mulberry32(hashSeed(flowKey))
    return Array.from({ length: count }, (_, i) => {
      const type = SHAPES[Math.floor(rand() * SHAPES.length)]
      // bias x toward the right two-thirds so shapes don't sit under the title
      const x = 30 + rand() * 68
      const y = rand() * 100
      const size = 8 + rand() * 22
      const opacity = 0.08 + rand() * 0.16
      const rotate = Math.floor(rand() * 45)
      return { id: i, type, x, y, size, opacity, rotate }
    })
  }, [flowKey, count])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s) => (
        <div
          key={s.id}
          className="absolute text-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, opacity: s.opacity, transform: `translate(-50%, -50%) rotate(${s.rotate}deg)` }}
        >
          <ShapeSvg type={s.type} size={s.size} />
        </div>
      ))}
    </div>
  )
}
