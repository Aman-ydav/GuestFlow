import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme, themeToggled } from '@/core/uiSlice'

/**
 * Applies the current theme as a `.dark` class on <html> and exposes a toggle.
 * Single source of truth is Redux (ui.theme); this hook is the DOM-syncing side effect.
 */
export function useTheme() {
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return { theme, toggleTheme: () => dispatch(themeToggled()) }
}
