# GuestFlow — Design Decisions & Complexity Notes

Fill in as the build progresses. This doc is what interview 1 will lean on — every entry should answer "why this, not the alternative?"

## Architecture

- Folder structure (feature-based vs type-based) — why:
- Routing approach — why:
- Role switching without real auth — why:

## State management

- What holds visitor/invite/approval state (Context vs Redux Toolkit vs Zustand) — why:
- How approval state transitions are enforced (state machine? plain reducer?) — why:

## Data layer

- Mock data shape:
- How the mock "API" is abstracted so a real backend could replace it:
- Simulated latency / failure for demoing loading & error states:

## Complexity analysis (per feature)

| Operation | Data structure | Time | Space | Notes |
|---|---|---|---|---|
| Search visitors by name/email/phone | | | | |
| Filter by date / time range / status | | | | |
| Lookup visitor by id (guest details panel) | | | | |
| Check pre-approval limit per employee per day | | | | |
| Expire unused pre-approvals | | | | |
| Approve / reject transition | | | | |

## UX / error handling decisions

- Where feedback is shown (toasts vs inline) — why:
- Invalid operations blocked and how the user is told:

## Tradeoffs & what I'd do with more time

-
