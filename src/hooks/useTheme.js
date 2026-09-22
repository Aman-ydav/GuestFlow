import { useDispatch, useSelector } from 'react-redux'
import { selectTheme, themeToggled } from '@/core/uiSlice'

/**
 * Theme applies ONLY inside the /app/* dashboard. AppShell reads `theme` and
 * puts the `dark` class on its OWN root div (not <html>) — since this is an
 * SPA, touching <html> would leak dark mode into the marketing site on
 * navigation. The marketing site is never wrapped in that class, so it always
 * renders light regardless of this value — no separate "force light" code
 * needed, it's just never inside the `.dark` ancestor Tailwind's dark:
 * variant looks for (@custom-variant dark in index.css).
 */
export function useTheme() {
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()
  return { theme, toggleTheme: () => dispatch(themeToggled()) }
}
