import { useSelector } from 'react-redux'
import { RoleSwitcher } from './RoleSwitcher'
import { MobileNav } from './MobileNav'
import { selectRole } from '@/core/uiSlice'

export function Topbar({ title }) {
  const role = useSelector(selectRole)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav role={role} />
        <h1 className="truncate">{title}</h1>
      </div>
      <RoleSwitcher />
    </header>
  )
}
