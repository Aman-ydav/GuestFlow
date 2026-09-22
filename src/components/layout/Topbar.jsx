import { RoleSwitcher } from './RoleSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Topbar({ title }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <h1 className="truncate">{title}</h1>
      <div className="flex items-center gap-2">
        <RoleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
