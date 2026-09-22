import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { FiUserPlus } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HeroIllustration } from '@/components/marketing/HeroIllustration'
import { ROUTES } from '@/constants/routes'
import { ROLES, ROLE_LABELS, ALL_ROLES } from '@/constants/roles'
import { roleChanged } from '@/core/uiSlice'
import { required, isEmail, composeValidators, validate } from '@/lib/validators'

const RULES = { name: required('Name'), email: composeValidators(required('Email'), isEmail) }

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', role: ROLES.VISITOR })
  const [touched, setTouched] = useState({})

  const errors = validate(values, RULES)
  const showError = (f) => touched[f] && errors[f]

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true })
    if (Object.keys(errors).length > 0) return
    dispatch(roleChanged(values.role))
    toast.success(`Welcome, ${values.name.split(' ')[0]}! You're signed in as ${ROLE_LABELS[values.role]}.`)
    navigate(values.role === ROLES.VISITOR ? ROUTES.KIOSK : ROUTES.FRONT_DESK)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B0D10] p-10 text-white lg:flex">
        <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight">
          Guest<span className="text-brand-teal">Flow</span>
        </Link>
        <div>
          <HeroIllustration className="h-auto w-full max-w-sm" />
          <h2 className="mt-6 max-w-sm text-2xl font-bold">Set up your workplace's front desk in minutes.</h2>
          <p className="mt-2 max-w-sm text-sm text-white/60">This is a demo account — nothing is stored beyond your browser session.</p>
        </div>
        <p className="text-xs text-white/40">Demo-only — no real accounts, no passwords stored anywhere.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight text-foreground">
              Guest<span className="text-primary">Flow</span>
            </Link>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Create an account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Demo signup — instantly signs you in, nothing is persisted server-side.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} onBlur={() => setTouched((t) => ({ ...t, name: true }))} aria-invalid={!!showError('name')} />
            {showError('name') && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} onBlur={() => setTouched((t) => ({ ...t, email: true }))} aria-invalid={!!showError('email')} />
            {showError('email') && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">I'll mostly be using this as a…</Label>
            <Select value={values.role} onValueChange={(role) => setValues((v) => ({ ...v, role }))}>
              <SelectTrigger id="role" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="btn-cta w-full">
            <FiUserPlus className="size-4" /> Create Account
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
