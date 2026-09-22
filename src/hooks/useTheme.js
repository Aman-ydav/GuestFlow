import { useSelector } from 'react-redux'
import { selectTheme } from '@/core/uiSlice'

/**
 * Light-only by design (see core/uiSlice.js) — this hook exists only so
 * shadcn's Toaster (sonner.jsx) has a `theme` value to read, matching its
 * generated API. There is no toggle anywhere in the UI.
 */
export function useTheme() {
  return { theme: useSelector(selectTheme) }
}
