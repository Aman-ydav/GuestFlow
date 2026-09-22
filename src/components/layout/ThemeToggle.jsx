import { FiSun, FiMoon } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

/** Dashboard-only — the marketing site never shows this (see docs/03-design-system.md). */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <FiSun className="size-4" /> : <FiMoon className="size-4" />}
    </Button>
  )
}
