import { Card, CardContent } from '@/components/ui/card'

/** Honest placeholder for a flow not built yet — never fake data, never a silent 404. */
export function ComingSoonPage({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm border-dashed text-center">
        <CardContent className="flex flex-col items-center gap-3 pt-6">
          {Icon && (
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="size-6" />
            </span>
          )}
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
