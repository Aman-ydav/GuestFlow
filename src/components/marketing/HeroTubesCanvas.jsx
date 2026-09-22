import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// On-brand palette only — never arbitrary random hex — so the click-to-reshuffle
// easter egg (see handleClick below) still always looks like GuestFlow, not a
// generic demo. Teal/coral/lime plus a couple of lighter variants for contrast
// in the WebGL lighting.
const TUBE_COLORS = ['#1EA6A0', '#F43F5E', '#A3E635', '#14213A', '#5EEAD4', '#FDA4AF']
// No pure white here — it read as a harsh blown-out glow behind the headline
// text (Aman: "make that less glow, it was much glowing"). Dimmer brand tints only.
const LIGHT_COLORS = ['#1EA6A0', '#F43F5E', '#A3E635', '#5EEAD4', '#FDA4AF']

function sample(palette, count) {
  const pool = [...palette]
  const picked = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return picked
}

/**
 * Interactive WebGL background for the marketing hero — neon tubes that follow
 * the cursor; click anywhere empty to reshuffle colors (still only ever from
 * TUBE_COLORS/LIGHT_COLORS above). Loads the actual renderer from a CDN at
 * runtime (threejs-components' prebuilt "tubes" cursor bundle) instead of
 * installing `three` as a project dependency for one decorative section.
 *
 * Purely decorative (aria-hidden) — if the CDN is unreachable (offline,
 * blocked network, or a non-browser test environment with no real dynamic
 * `import()` of a remote URL) it fails silently and the hero just shows its
 * plain dark background instead, never a broken page.
 */
export function HeroTubesCanvas({ className }) {
  const canvasRef = useRef(null)
  const appRef = useRef(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      if (!canvasRef.current) return
      // Never fetch the real CDN bundle during automated tests — Vitest sets
      // MODE to 'test'. Keeps the suite hermetic (no live network calls) and
      // fast; the try/catch below already covers "CDN unreachable" for real
      // users, this just skips attempting it at all here.
      if (import.meta.env.MODE === 'test') return
      try {
        const { default: TubesCursor } = await import(
          /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        )
        if (!mounted || !canvasRef.current) return
        appRef.current = TubesCursor(canvasRef.current, {
          tubes: {
            colors: sample(TUBE_COLORS, 3),
            // Toned way down from the reference's intensity: 200 — that read as
            // a much stronger glow than a subtle text-readable background needs.
            lights: { intensity: 50, colors: sample(LIGHT_COLORS, 4) },
          },
        })
      } catch (error) {
        console.error('Hero background animation failed to load — falling back to the plain background.', error)
      }
    }

    init()
    return () => {
      mounted = false
      appRef.current = null
    }
  }, [])

  const handleClick = () => {
    if (!appRef.current) return
    appRef.current.tubes.setColors(sample(TUBE_COLORS, 3))
    appRef.current.tubes.setLightsColors(sample(LIGHT_COLORS, 4))
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      aria-hidden="true"
      className={cn('block', className)}
      style={{ touchAction: 'none' }}
    />
  )
}
