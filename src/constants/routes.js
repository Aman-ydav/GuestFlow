export const ROUTES = {
  KIOSK: '/kiosk',
  HOST_INBOX: '/inbox',
  INVITES: '/invites',
  FRONT_DESK: '/front-desk',
  FRONT_DESK_VISITOR: '/front-desk/:visitorId',
  ADMIN: '/admin',
}

export const frontDeskVisitorPath = (id) => `/front-desk/${id}`
