import { FLOWS } from '@/lib/flowTheme'
import { cn } from '@/lib/utils'

/**
 * Bold, solid-color page header — the exact same color/icon as this flow's
 * card on the landing page (see lib/flowTheme.js), so the dashboard doesn't
 * read as a different app from the marketing site.
 */
export function FlowBanner({ flowKey, action }) {
  const flow = FLOWS[flowKey]
  const Icon = flow.icon

  return (
    <div className={cn('flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center sm:justify-between md:p-6', flow.tone)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold">{flow.title}</h2>
          <p className="text-sm opacity-80">{flow.desc}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
