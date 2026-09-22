import { useEffect, useState } from 'react'

/** Debounces a fast-changing value (e.g. search input) so expensive derived
 * work (filtering thousands of rows) runs once per pause, not per keystroke. */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
