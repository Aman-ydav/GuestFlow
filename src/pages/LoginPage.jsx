import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { FiArrowRight, FiLogIn } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { HeroIllustration } from '@/components/marketing/HeroIllustration'
import { ROUTES } from '@/constants/routes'
import { ROLES, ROLE_LABELS, ALL_ROLES } from '@/constants/roles'
import { roleChanged, currentHostChanged } from '@/core/uiSlice'
import { fetchHosts, hostSelectors } from '@/features/approval/hostsSlice'

// Where each role naturally lands — mirrors how the problem statement
// describes each user's first screen (visitor → kiosk, host → their inbox,
// security/front-desk → the dashboard, admin → the dashboard with full access).
const ROLE_LANDING = {
  [ROLES.VISITOR]: ROUTES.KIOSK,
  [ROLES.HOST]: ROUTES.HOST_INBOX,
  [ROLES.FRONT_DESK]: ROUTES.FRONT_DESK,
  [ROLES.ADMIN]: ROUTES.FRONT_DESK,
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const hosts = useSelector(hostSelectors.selectAll)
  const [role, setRole] = useState(ROLES.FRONT_DESK)
  const [hostId, setHostId] = useState('')

  useEffect(() => {
    if (hosts.length === 0) dispatch(fetchHosts())
  }, [dispatch, hosts.length])

  const needsHost = role === ROLES.HOST || role === ROLES.ADMIN

  const handleSignIn = (e) => {
    e.preventDefault()
    dispatch(roleChanged(role))
    if (needsHost) dispatch(currentHostChanged(hostId || hosts[0]?.id || null))
    toast.success(`Signed in as ${ROLE_LABELS[role]}`)
    navigate(ROLE_LANDING[role])
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: reuses the landing page's dark hero mood so auth feels like part of
          the same system (Aman: "theme based on landing page design"). */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B0D10] p-10 text-white lg:flex">
        <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight">
          Guest<span className="text-brand-teal">Flow</span>
        </Link>
        <div>
          <HeroIllustration className="h-auto w-full max-w-sm" />
          <h2 className="mt-6 max-w-sm text-2xl font-bold">Visitor management, without the front-desk chaos.</h2>
          <p className="mt-2 max-w-sm text-sm text-white/60">
            Sign in as the role you want to see — every screen behaves the way the actual VMS spec describes it for that user.
          </p>
        </div>
        <p className="text-xs text-white/40">Demo-only — no real accounts, no passwords stored anywhere.</p>
      </div>

      {/* Right: the actual form, in the light theme (matches "keep white default" on non-dashboard pages) */}
      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight text-foreground">
              Guest<span className="text-primary">Flow</span>
            </Link>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Pick who you're signing in as — this is a demo, not real auth.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">I am a…</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {needsHost && (
            <div className="space-y-1.5">
              <Label htmlFor="host">Which employee?</Label>
              <Select value={hostId} onValueChange={setHostId}>
                <SelectTrigger id="host" className="w-full"><SelectValue placeholder="Select yourself" /></SelectTrigger>
                <SelectContent>
                  {hosts.map((h) => <SelectItem key={h.id} value={h.id}>{h.name} — {h.department}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="btn-cta w-full">
            <FiLogIn className="size-4" /> Sign In
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New here? <Link to={ROUTES.SIGNUP} className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Just browsing? <Link to={ROUTES.FRONT_DESK} className="text-primary hover:underline">Skip straight to the live demo <FiArrowRight className="inline size-3" /></Link>
          </p>
        </form>
      </div>
    </div>
  )
}
