import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiGitBranch, FiUserPlus, FiInbox, FiMail, FiMonitor } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroIllustration } from '@/components/marketing/HeroIllustration'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const FLOW_CARDS = [
  { to: ROUTES.KIOSK, title: 'Visitor Registration', desc: 'Kiosk check-in with mandatory photo capture.', icon: FiUserPlus, tone: 'bg-brand-coral text-brand-coral-foreground' },
  { to: ROUTES.HOST_INBOX, title: 'Host Approvals', desc: 'Approve or reject requests, with a full audit trail.', icon: FiInbox, tone: 'bg-brand-lime text-brand-lime-foreground' },
  { to: ROUTES.INVITES, title: 'Pre-Approved Invites', desc: 'QR e-pass, auto-expiry, per-host daily limits.', icon: FiMail, tone: 'bg-primary text-primary-foreground' },
  { to: ROUTES.FRONT_DESK, title: 'Front Desk Dashboard', desc: 'Live search, guest details, check-in/out, overstays.', icon: FiMonitor, tone: 'bg-foreground text-background' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero — deliberately fixed dark background regardless of site theme, a brand
          treatment, not a light/dark-mode surface (see docs/03-design-system.md). */}
      <section className="bg-[#0B0D10] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Go beyond the <span className="text-brand-teal">front desk.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/70">
              GuestFlow is a visitor management system — registration, host approvals, pre-approved invites, and a
              live front-desk dashboard. Every screen you're about to click is real and working, backed by mock data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="btn-cta bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90">
                <Link to={ROUTES.FRONT_DESK}>
                  View Live Demo <FiArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-cta border-white/30 bg-transparent text-white hover:bg-white/10">
                <Link to={ROUTES.KIOSK}>Try the Kiosk</Link>
              </Button>
            </div>
          </div>
          <HeroIllustration className="mx-auto h-auto w-full max-w-sm" />
        </div>
      </section>

      {/* Two small facts, in the reference's icon-card style */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-xl font-semibold">Built for the whole visitor journey.</h2>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
          Not a single form — a full workflow, with rules enforced in one place.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-start gap-3 pt-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FiGitBranch className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Explicit status transitions</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Every state change — approve, reject, check-in, check-out — goes through one transition table. An
                  invalid move is impossible by construction, not by UI discipline.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 pt-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FiCheckCircle className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">Zero silent failures</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Every action gives feedback — a toast, an inline error, or a status badge change. Nothing succeeds
                  or fails without telling you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flow cards — the reference's "Industry expertise" card row, mapped to our 4 flows */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-xl font-semibold">Every flow, covered.</h2>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">Click any card — it opens the real screen.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW_CARDS.map(({ to, title, desc, icon: Icon, tone }) => (
              <Link key={to} to={to} className="group block">
                <Card className={cn('h-full overflow-hidden border-none py-0', tone)}>
                  <CardContent className="flex h-full flex-col gap-8 p-5">
                    <Icon className="size-6" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-xs opacity-80">{desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium underline-offset-2 group-hover:underline">
                        Open <FiArrowRight className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-[#0B0D10] py-16 text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 md:block">
          <div className="absolute inset-0 bg-brand-teal [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-0 bg-brand-coral opacity-90 [clip-path:polygon(60%_0,100%_0,100%_100%,90%_100%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="max-w-md text-2xl font-bold">Ready to see it in action?</h2>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            No sign-up, no fake demo form — the dashboard is live, right now, with a few thousand mock visitors already in it.
          </p>
          <Button asChild size="lg" className="btn-cta mt-5 bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90">
            <Link to={ROUTES.FRONT_DESK}>
              View Live Demo <FiArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Honest "about this project" section, in place of fabricated testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="rounded-lg border border-dashed border-border p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">About this project</p>
          <p className="mt-2 max-w-2xl text-sm text-foreground/90">
            GuestFlow is a case-study submission — a Visitor Management System built with React, Redux Toolkit, and
            shadcn/ui, backed entirely by mock data. Every screen linked from this page is fully functional. Full
            requirements, architecture, and design-decision docs are in the project's <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/</code> folder.
          </p>
        </div>
      </section>
    </div>
  )
}
