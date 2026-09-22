export const ROUTES = {
  HOME: '/',
  KIOSK: '/app/kiosk',
  HOST_INBOX: '/app/inbox',
  INVITES: '/app/invites',
  FRONT_DESK: '/app/front-desk',
  FRONT_DESK_VISITOR: '/app/front-desk/:visitorId',
  ADMIN: '/app/admin',
}

export const frontDeskVisitorPath = (id) => `/app/front-desk/${id}`
