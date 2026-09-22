import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { Providers } from './providers'

/**
 * Full-app smoke test: mounts the real route tree (real store, real shadcn
 * components) via a fresh createMemoryRouter per test — React Router's own
 * recommended pattern, since reusing the app's createBrowserRouter singleton
 * across tests doesn't respond to raw window.history.pushState. This is the
 * closest thing to "open it in a browser" available in this sandbox; see
 * docs/design-decisions.md for why a real headless-Chromium check wasn't
 * possible here (binary download blocked by sandbox network).
 */
function renderAt(path) {
  const testRouter = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <Providers>
      <RouterProvider router={testRouter} />
    </Providers>
  )
}

describe('Marketing site', () => {
  it('renders the landing page hero and nav', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { level: 1, name: /go beyond the/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /view live demo/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /try the kiosk/i })).toBeInTheDocument()
  })

  it('flow cards link into the real app routes', async () => {
    renderAt('/')
    const kioskCard = await screen.findByRole('link', { name: /visitor registration/i })
    expect(kioskCard).toHaveAttribute('href', '/app/kiosk')
  })
})

describe('App shell', () => {
  it('renders the dashboard and redirects /app to Front Desk by default', async () => {
    renderAt('/app')
    expect(await screen.findByRole('heading', { level: 1, name: /front desk/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /front desk/i })).toBeInTheDocument()
  })

  it('navigates to the kiosk and renders the registration form without auto-requesting the camera', async () => {
    renderAt('/app/kiosk')
    expect(await screen.findByRole('heading', { name: /visitor registration/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    // camera must NOT auto-start on mount — only after an explicit click
    expect(screen.getByText(/camera is off/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start camera/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload instead/i })).toBeInTheDocument()
  })

  it('falls back gracefully when the camera is unavailable, only after Start Camera is clicked', async () => {
    renderAt('/app/kiosk')
    const user = userEvent.setup()
    await screen.findByRole('heading', { name: /visitor registration/i })
    expect(screen.queryByText(/camera not available/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start camera/i }))
    // jsdom has no navigator.mediaDevices — must fall back, not crash
    expect(await screen.findByText(/camera not available/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload instead/i })).toBeInTheDocument()
  })

  it('shows validation errors and keeps submit from silently succeeding on an empty form', async () => {
    renderAt('/app/kiosk')
    const user = userEvent.setup()
    const submit = await screen.findByRole('button', { name: /register visitor/i })
    await user.click(submit)
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()
  })

  it('has no theme toggle — light-only by design', async () => {
    renderAt('/app')
    await screen.findByRole('heading', { level: 1, name: /front desk/i })
    expect(screen.queryByLabelText(/switch to dark theme/i)).not.toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('accepts an uploaded photo as a camera fallback', async () => {
    renderAt('/app/kiosk')
    const user = userEvent.setup()
    await screen.findByRole('heading', { name: /visitor registration/i })

    await user.click(screen.getByRole('button', { name: /upload instead/i }))
    const file = new File(['fake-image-bytes'], 'photo.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]')
    await user.upload(fileInput, file)

    expect(await screen.findByAltText(/captured visitor/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retake/i })).toBeInTheDocument()
  })

  it('shows a 404 page for an unknown route', async () => {
    renderAt('/nonexistent-route')
    expect(await screen.findByRole('heading', { name: /doesn't exist/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to guestflow/i })).toBeInTheDocument()
  })

  it('collapses and expands the sidebar, hiding visible nav labels while collapsed', async () => {
    renderAt('/app')
    const user = userEvent.setup()
    await screen.findByRole('heading', { level: 1, name: /front desk/i })
    const nav = screen.getByRole('navigation')
    // visible label text node (distinct from the icon-only link's aria-label, which
    // stays present in both states on purpose — collapsed nav must stay screen-reader labelled)
    expect(within(nav).getByText('Front Desk Dashboard')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }))
    expect(within(nav).queryByText('Front Desk Dashboard')).not.toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Front Desk Dashboard' })).toBeInTheDocument() // aria-label still there

    await user.click(screen.getByRole('button', { name: /expand sidebar/i }))
    expect(within(nav).getByText('Front Desk Dashboard')).toBeInTheDocument()
  })

  it('shows the flow-colored Host Approvals banner, and a "pick a host" state before one is chosen', async () => {
    renderAt('/app/inbox')
    expect(await screen.findByRole('heading', { level: 2, name: /host approvals/i })).toBeInTheDocument()
    // default role is 'front-desk', so no host is auto-selected yet — a real, honest empty state
    expect(await screen.findByText(/pick a host from the top bar/i)).toBeInTheDocument()
  })

  it('renders the Invites page with a working creation form', async () => {
    renderAt('/app/invites')
    expect(await screen.findByRole('heading', { level: 2, name: /pre-approved invites/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /new invite/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm invite/i })).toBeInTheDocument()
  })

  it('renders the Front Desk table with real mock data (thousands of seeded visitors, not empty)', async () => {
    renderAt('/app/front-desk')
    expect(await screen.findByRole('heading', { level: 1, name: /front desk/i })).toBeInTheDocument()
    expect(await screen.findByPlaceholderText(/search by name, email or phone/i)).toBeInTheDocument()
    // the table renders real rows from the seeded dataset, not the "no visitors" empty state
    expect(await screen.findByText(/page 1 of/i)).toBeInTheDocument()
    expect(screen.queryByText(/no visitors match these filters/i)).not.toBeInTheDocument()
  })

  it('filters the Front Desk table by search text', async () => {
    renderAt('/app/front-desk')
    const user = userEvent.setup()
    await screen.findByText(/page 1 of/i)
    const search = screen.getByPlaceholderText(/search by name, email or phone/i)
    await user.type(search, 'zzzzznobodyhasthisname')
    expect(await screen.findByText(/no visitors match these filters/i)).toBeInTheDocument()
  })

  it('renders the Admin settings form once config finishes loading', async () => {
    renderAt('/app/admin')
    expect(await screen.findByRole('heading', { level: 2, name: /^admin$/i })).toBeInTheDocument()
    expect(await screen.findByLabelText(/pre-approval limit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument()
  })
})
