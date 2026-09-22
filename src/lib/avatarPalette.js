/**
 * Deterministic solid-color background for an initials avatar, hashed from the
 * person's name so the same person always gets the same color across the app.
 * No images, no network dependency — matches the reference screenshots' "DB",
 * "LM" style badges exactly.
 */
const PALETTE = [
  'bg-teal-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-amber-600',
  'bg-emerald-600',
  'bg-violet-500',
]

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getAvatarColorClass(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0 // force 32-bit int
  }
  const index = Math.abs(hash) % PALETTE.length
  return PALETTE[index]
}
