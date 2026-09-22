import { ROUTES } from './routes'

export const ROLES = {
  VISITOR: 'visitor',
  HOST: 'host',
  FRONT_DESK: 'front-desk',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.VISITOR]: 'Visitor (Kiosk)',
  [ROLES.HOST]: 'Host',
  [ROLES.FRONT_DESK]: 'Front Desk',
  [ROLES.ADMIN]: 'Admin',
}

export const ALL_ROLES = Object.values(ROLES)

// Where each role naturally lands — mirrors how the problem statement describes
// each user's first screen. Shared by LoginPage (signing in) and RoleSwitcher
// (switching role from inside the app, where the page you were just on may not
// make sense for the new role — e.g. an Admin on /app/admin switching to Host).
export const ROLE_LANDING = {
  [ROLES.VISITOR]: ROUTES.KIOSK,
  [ROLES.HOST]: ROUTES.HOST_INBOX,
  [ROLES.FRONT_DESK]: ROUTES.FRONT_DESK,
  [ROLES.ADMIN]: ROUTES.FRONT_DESK,
}
