import { RoleSwitcher } from './RoleSwitcher'

export function Topbar({ title }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-8">
      <h1 className="truncate">{title}</h1>
      <RoleSwitcher />
    </header>
  )
}
