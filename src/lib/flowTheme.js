import { FiUserPlus, FiInbox, FiMail, FiMonitor, FiSettings } from 'react-icons/fi'
import { ROUTES } from '@/constants/routes'

/**
 * One color per flow, defined ONCE and reused identically on the landing
 * page's flow cards and each dashboard page's banner — so the two halves of
 * the site (marketing + product) read as one visual system, not two apps
 * glued together. Never redefine these colors locally in a page/component.
 */
export const FLOWS = {
  registration: {
    to: ROUTES.KIOSK,
    title: 'Visitor Registration',
    desc: 'Kiosk check-in with mandatory photo capture.',
    icon: FiUserPlus,
    tone: 'bg-brand-coral text-brand-coral-foreground',
    soft: 'bg-brand-coral/10 text-brand-coral',
  },
  approvals: {
    to: ROUTES.HOST_INBOX,
    title: 'Host Approvals',
    desc: 'Approve or reject requests, with a full audit trail.',
    icon: FiInbox,
    tone: 'bg-brand-lime text-brand-lime-foreground',
    soft: 'bg-brand-lime/15 text-brand-lime-foreground',
  },
  invites: {
    to: ROUTES.INVITES,
    title: 'Pre-Approved Invites',
    desc: 'QR e-pass, auto-expiry, per-host daily limits.',
    icon: FiMail,
    tone: 'bg-primary text-primary-foreground',
    soft: 'bg-primary/10 text-primary',
  },
  frontDesk: {
    to: ROUTES.FRONT_DESK,
    title: 'Front Desk Dashboard',
    desc: 'Live search, guest details, check-in/out, overstays.',
    icon: FiMonitor,
    // No dark: prefix needed — --brand-ink/--brand-ink-foreground are already
    // redefined inside .dark{} in index.css (ink flips to near-white,
    // ink-foreground flips to near-black), so this one pair of classes already
    // renders correctly in both themes. An earlier fix added `dark:bg-white
    // dark:text-brand-ink` on top of that, which put dark mode's near-white
    // `--brand-ink` value as TEXT on top of a literal bg-white — near-invisible.
    // Caught from a screenshot; don't re-add dark: overrides here.
    tone: 'bg-brand-ink text-brand-ink-foreground',
    soft: 'bg-brand-ink/10 text-brand-ink',
  },
  admin: {
    to: ROUTES.ADMIN,
    title: 'Admin',
    desc: 'Pre-approval limits, overstay threshold, offices.',
    icon: FiSettings,
    tone: 'bg-zinc-700 text-white',
    soft: 'bg-zinc-700/10 text-zinc-700',
  },
}

export const FLOW_LIST = Object.values(FLOWS)
