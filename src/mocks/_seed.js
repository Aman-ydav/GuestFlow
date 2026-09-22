import { seedDataset } from './generators/seedDataset'

// Seeded exactly once at module load, shared by hosts/visitors/invites.mock.js
// so cross-references (a visitor's hostId, an invite's guestIds) stay consistent.
// Not imported directly outside this folder — go through the per-entity *.mock.js files.
export const { hosts, visitors, invites } = seedDataset()
