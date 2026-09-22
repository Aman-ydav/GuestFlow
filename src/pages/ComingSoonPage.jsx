import { Card, CardContent } from '@/components/ui/card'
import { FlowBanner } from '@/components/FlowBanner'

/** Honest placeholder for a flow not built yet — never fake data, never a silent 404. */
export function ComingSoonPage({ flowKey, note }) {
  return (
    <div className="space-y-6">
      <FlowBanner flowKey={flowKey} />
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <h3 className="text-base font-semibold">Coming next</h3>
          <p className="max-w-sm text-sm text-muted-foreground">{note}</p>
        </CardContent>
      </Card>
    </div>
  )
}
