import { seedDataset } from './generators/seedDataset'
import { configMock } from './config.mock'

/**
 * The in-memory "database" behind the mock API. Genuinely mutable (Map keyed
 * by id) so approve/reject/check-in actually persist for the session, not
 * just a static read-only array. Only services/*Service.js reads this —
 * components never import mocks/ directly.
 *
 * Persisted to localStorage so a page refresh doesn't wipe out everything
 * you just did in the demo (Aman: "why did my thing get cleared after a
 * refresh"). It also fixes a second symptom that had the same root cause:
 * the seed generator uses Math.random() for createdAt jitter, so re-running
 * it fresh on every reload gave visitors slightly different timestamps each
 * time — and since the front-desk list sorts by createdAt, that made the
 * list order visibly "shuffle" between refreshes even though it was really
 * the same data. Persisting the *result* of one seed run, instead of
 * re-seeding on every load, fixes both at once.
 */
const STORAGE_KEY = 'guestflow:mock-db:v1'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.hosts) || !Array.isArray(parsed.visitors) || !Array.isArray(parsed.invites)) {
      return null
    }
    return parsed
  } catch {
    // Corrupt JSON, private-browsing storage block, or a stale shape from an
    // earlier version — fall back to a fresh seed rather than crash the app.
    return null
  }
}

function buildDb(snapshot) {
  return {
    hosts: new Map(snapshot.hosts.map((h) => [h.id, h])),
    visitors: new Map(snapshot.visitors.map((v) => [v.id, v])),
    invites: new Map(snapshot.invites.map((i) => [i.id, i])),
    auditEvents: snapshot.auditEvents ?? [],
    config: snapshot.config,
  }
}

function freshSeed() {
  const { hosts, visitors, invites } = seedDataset()
  return { hosts, visitors, invites, auditEvents: [], config: { ...configMock } }
}

const persisted = loadPersisted()
const db = buildDb(persisted ?? freshSeed())

/** Called by every service mutation (register/transition/invite create-or-cancel/config
 *  update) right after it changes `db` — keeps localStorage in sync with the live state. */
export function persist() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hosts: Array.from(db.hosts.values()),
        visitors: Array.from(db.visitors.values()),
        invites: Array.from(db.invites.values()),
        auditEvents: db.auditEvents,
        config: db.config,
      })
    )
  } catch {
    // Storage full or blocked — the demo still works for this session, it
    // just won't survive a refresh. Not worth surfacing to the user.
  }
}

if (!persisted) persist() // first-ever load: save the freshly seeded data so it stays stable from here on

/** Wipes the persisted snapshot and reloads with a brand new seeded dataset —
 *  wired to Admin's "Reset Demo Data" button, since there's otherwise no way
 *  back to a clean slate once you've approved/rejected/checked in a bunch of
 *  mock visitors. */
export function resetMockData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore — see persist() above
  }
  window.location.reload()
}

export function delay(min = 200, max = 600) {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** ~8% simulated failure rate on writes — exercises error-handling UI paths
 *  (toasts, disabled-while-mutating buttons). Deliberate: even a mock backend
 *  should occasionally behave like a real, imperfect network, so the app's
 *  error-handling code actually gets proven out instead of never running. */
export function maybeFail(rate = 0.08) {
  if (Math.random() < rate) {
    const error = new Error('The server is taking too long to respond. Please try again.')
    error.status = 503
    throw error
  }
}

export default db
