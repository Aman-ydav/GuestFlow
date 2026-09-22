import { makeHost } from './makeHost'
import { makeVisitor } from './makeVisitor'
import { makeInvite } from './makeInvite'

/**
 * Builds a full, internally-consistent mock dataset once at module load.
 *
 * Defaults kept minimal for now (Aman: "keep very less mock data, minimal")
 * so manual QA/browsing is quick — a few pages of data, not thousands of rows
 * to scroll past. Before final submission, bump visitorCount back up (e.g.
 * 3000) to actually demonstrate the "Performance" evaluation criterion
 * (search/filter jank, unmemoised derived lists, unvirtualized tables) — the
 * Front Desk table's pagination is built for scale either way, this only
 * changes how much data there is to page through during testing.
 */
export function seedDataset({ hostCount = 4, visitorCount = 7, inviteCount = 5 } = {}) {
  const hosts = Array.from({ length: hostCount }, (_, i) => makeHost(i))
  const visitors = Array.from({ length: visitorCount }, (_, i) => makeVisitor(i, hosts))
  const invites = Array.from({ length: inviteCount }, (_, i) => makeInvite(i, hosts, visitors))
  return { hosts, visitors, invites }
}
