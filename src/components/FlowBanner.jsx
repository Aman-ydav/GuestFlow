import { FLOWS } from '@/lib/flowTheme'
import { cn } from '@/lib/utils'
import { BannerDecoration } from './BannerDecoration'

/**
 * Bold, solid-color page header — the same color/icon as this flow's card on
 * the landing page (see lib/flowTheme.js), styled like the reference CTA
 * banner: full-width, an angled accent shape, and a scattered decorative
 * pattern (~26 shapes, seeded per flow — see BannerDecoration) so each flow's
 * banner reads as a variation on one system rather than identical blocks.
 *
 * The bigger heading size here is a deliberate exception to "page titles cap
 * at text-xl" (see docs/RULES.md) — that rule is about the Topbar's <h1>; this
 * is a hero-style banner element, styled to match the CTA banner precedent.
 */
export function FlowBanner({ flowKey, action }) {
  const flow = FLOWS[flowKey]
  const Icon = flow.icon

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', flow.tone)}>
      <BannerDecoration flowKey={flowKey} />
      <div className="absolute inset-y-0 right-0 hidden w-1/4 sm:block">
        <div className="absolute inset-0 bg-black/10 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
      </div>
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Icon className="size-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">{flow.title}</h2>
            <p className="mt-0.5 text-sm opacity-85">{flow.desc}</p>
          </div>
        </div>
        {action && <div className="relative shrink-0">{action}</div>}
      </div>
    </div>
  )
}
