import { Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { MarketingLayout } from '@/components/marketing/MarketingLayout'
import { ROUTES } from '@/constants/routes'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import KioskPage from '@/pages/KioskPage'
import HostInboxPage from '@/pages/HostInboxPage'
import InvitesPage from '@/pages/InvitesPage'
import FrontDeskPage from '@/pages/FrontDeskPage'
import AdminPage from '@/pages/AdminPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RouteErrorPage from '@/pages/RouteErrorPage'

/**
 * Route definitions only — no router instance here. `router.jsx` builds the
 * real `createBrowserRouter` for the app; tests build a `createMemoryRouter`
 * from this same array so route content is exercised identically without
 * fighting a browser-history singleton across test cases.
 *
 * `/` is the public marketing site (landing page); the working product lives
 * under `/app/*`, using the dashboard shell (sidebar/topbar/role switcher).
 */
export const routes = [
  {
    path: '/',
    element: <MarketingLayout />,
    errorElement: <RouteErrorPage />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  // Login is standalone (its own split-screen layout, no navbar/footer chrome)
  // but real: picking a role there sets ui.role/currentHostId exactly like the
  // in-app RoleSwitcher. Not a hard gate on /app/* — the landing page's "no fake
  // demo form, dashboard is live" promise stays true either way. There is no
  // signup page — accounts aren't a real concept in this demo.
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorPage /> },
  {
    path: '/app',
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to={ROUTES.FRONT_DESK} replace /> },
      { path: 'kiosk', element: <KioskPage />, handle: { title: 'Visitor Kiosk' } },
      { path: 'inbox', element: <HostInboxPage />, handle: { title: 'Host Inbox' } },
      { path: 'invites', element: <InvitesPage />, handle: { title: 'Invites' } },
      { path: 'front-desk', element: <FrontDeskPage />, handle: { title: 'Front Desk' } },
      { path: 'front-desk/:visitorId', element: <FrontDeskPage />, handle: { title: 'Front Desk' } },
      { path: 'admin', element: <AdminPage />, handle: { title: 'Admin' } },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]
