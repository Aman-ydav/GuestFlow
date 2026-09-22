import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Scales its text content to exactly fill the width of its container —
 * a "big wordmark that truly spans the full width" (not just a large vw-based
 * font-size, which either overflows or falls short depending on word length).
 * Measures natural text width vs container width, applies a uniform
 * transform: scale() (not scaleX-only, which would distort the glyphs).
 * No-ops safely if ResizeObserver/layout isn't available (e.g. jsdom in tests).
 */
export function FitText({ children, className, textClassName }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [dims, setDims] = useState({ scale: 1, height: null })

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const fit = () => {
      const containerWidth = container.offsetWidth
      const textWidth = text.scrollWidth
      const textHeight = text.offsetHeight
      if (textWidth > 0 && containerWidth > 0) {
        const scale = containerWidth / textWidth
        setDims({ scale, height: textHeight * scale })
      }
    }

    fit()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    return () => observer.disconnect()
  }, [children])

  return (
    <div ref={containerRef} className={className} style={{ height: dims.height ?? undefined, overflow: 'hidden' }}>
      <span
        ref={textRef}
        className={textClassName}
        style={{ display: 'inline-block', whiteSpace: 'nowrap', transform: `scale(${dims.scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </span>
    </div>
  )
}
