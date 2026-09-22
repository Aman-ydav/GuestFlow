import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('navigates to the kiosk and renders the registration form with photo capture', async () => {
    renderAt('/app/kiosk')
    expect(await screen.findByRole('heading', { name: /visitor registration/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    // jsdom has no camera — PhotoCapture must fall back gracefully, not crash
    expect(await screen.findByText(/upload a photo instead/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload instead/i })).toBeInTheDocument()
  })

  it('shows validation errors and keeps submit from silently succeeding on an empty form', async () => {
    renderAt('/app/kiosk')
    const user = userEvent.setup()
    const submit = await screen.findByRole('button', { name: /register visitor/i })
    await user.click(submit)
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument()
  })

  it('toggles theme and applies the dark class to <html>', async () => {
    renderAt('/app')
    const user = userEvent.setup()
    const toggle = await screen.findByRole('button', { name: /switch to dark theme/i })
    await user.click(toggle)
    await waitFor(() => expect(document.documentElement.classList.contains('dark')).toBe(true))
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
    expect(await screen.findByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
