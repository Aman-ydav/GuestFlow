import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, getAvatarColorClass } from '@/lib/avatarPalette'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'size-6 text-[10px]',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
}

/** Colored-initials avatar — no images, no network dependency. See docs/07-image-assets-and-prompts.md. */
export function AvatarInitials({ name, size = 'md', className }) {
  return (
    <Avatar className={cn(SIZES[size], className)}>
      <AvatarFallback className={cn(getAvatarColorClass(name), 'font-semibold text-white')}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
