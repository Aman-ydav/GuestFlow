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
