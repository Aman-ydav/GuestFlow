import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/constants/routes'
import KioskPage from '@/pages/KioskPage'
import HostInboxPage from '@/pages/HostInboxPage'
import InvitesPage from '@/pages/InvitesPage'
import FrontDeskPage from '@/pages/FrontDeskPage'
import AdminPage from '@/pages/AdminPage'
import NotFoundPage from '@/pages/NotFoundPage'
import RouteErrorPage from '@/pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
