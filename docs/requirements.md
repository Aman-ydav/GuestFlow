# GuestFlow — Requirements (extracted from case study: "1. Visitor Management System")

Source: LPU Frontend Case Studies PDF, Task 1. Screenshots in the PDF are reference only — own UI is allowed. Any framework is a plus point. Mock data is explicitly allowed where no API exists.

---

## 1. Visitor Registration

Captured when a visitor arrives (via security guard or self-service kiosk).

**Fields to capture**

| Field | Notes |
|---|---|
| Full name | Legal name for identification |
| Contact info | Mobile and/or email |
| Purpose of visit | e.g. meeting, maintenance, interview, delivery |
| Host employee | Name + department of the employee being visited |
| Company / organization | If visitor represents a business |
| Check-in / check-out time | Auto-logged, not typed by the user |
| Photo | **Mandatory** capture at the registration desk |

**Process**
1. Guard / kiosk collects details and captures photo.
2. System auto-sends an approval request to the host employee.
3. Visitor badge (physical or digital QR) is generated **after** approval.

---

## 2. Approval Workflow

Every visitor must be approved by the host employee.

1. **Real-time notification** to host (email / SMS / app — in our app: in-app notification).
2. **Approve / Reject** from the host's view (web portal in our case).
3. **Approved** → visitor allowed in, digital/printed pass issued.
4. **Rejected** → visitor not permitted, security is notified.

Must also keep an **approval history** for audit purposes.

---

## 3. Pre-Approval (Invite) for Convenience

Host schedules and approves a visit in advance.

- Specific **date + time window** (e.g. 10 AM – 12 PM).
- Visitor receives a **QR code / e-pass** (email/SMS — we'll show it in-app and make it downloadable/shareable) and scans on arrival to **bypass manual approval**.
- If the visitor doesn't check in within the window → request **expires automatically**.
- Admin-enforceable rules, e.g. **max N pre-approvals per employee per day** (PDF example: 5).

**Use cases:** client meetings, vendor visits, frequent visitors (maintenance), reducing day-of employee load.

---

## 4. Screens shown in the PDF (reference, not mandatory layout)

### Invite Visitor (host view)
- Event Title (required)
- Type of Visit dropdown (required) — options seen: Business Guests, Vendor, Personnel, Govt Officials, Interview, PwC Network Firm, Others
- Office dropdown (required) — e.g. Mumbai Goregaon
- Date picker + start/end time
- "Personal note to guests" (optional)
- Right panel: **search employee/guest by name, id, email or phone**, with an "Added Guests" list (avatar initials + name + remove ✕)
- "Confirm Invite" button, disabled until required fields are valid

### Front Desk Application (security/reception view)
- Header: "Visitors" — count (e.g. All (27)), search by name/email/phone
- Date filter + time-range filter, refresh button
- Table columns: Visitor (name + Host), Type of Invite (e.g. Contract Staff / Vendor + Self Check-in), Entry Time, Exit Time, Status
- Status badges seen: **OVERSTAY**, **SELF CHECK-OUT**
- Clicking a row opens a **Guest Details** side panel: status badge, guest ↔ host cards with initials/phone/email, check-in / check-out timeline, visit summary (type, date range), collapsible "Other Details" (company, role, sponsor, temp card no.), "Additional Information" textarea (0/1000 char counter), **Check-Out** button

---

## 5. Roles / views we need to build (full scope)

| Role | View |
|---|---|
| Visitor / Kiosk | Self-registration form with photo capture, QR scan/enter e-pass for pre-approved visits |
| Host employee | Notifications inbox, approve/reject, invite (pre-approve) visitors, see own visitor history |
| Front desk / security | Dashboard, visitor list, guest details, check-in / check-out, overstay + denied alerts |
| Admin (light) | Configure pre-approval limit per employee per day, view audit/approval history |

Role switching will be a simple in-app toggle (no real auth) since backend is mocked.

---

## 6. Evaluation criteria → what we must visibly demonstrate

From the PDF's "Plus Points / Overall Evaluation Criteria":

| Criterion | How GuestFlow shows it |
|---|---|
| **Complexity estimation** | Document time/space complexity of search, filtering, approval-state transitions, expiry checks in `design-decisions.md` and inline comments |
| **User experience** | Intuitive nav, clear feedback on every action (toasts, status badges, disabled states, loading states) |
| **Error handling** | Form validation, informative error messages, guard against invalid transitions (e.g. can't check out someone never checked in, can't approve an expired invite, can't exceed pre-approval limit) |
| **Performance** | Efficient filtering/search over large mock visitor lists, memoization, avoiding unnecessary re-renders; test with a big mock dataset |
| **Scalability** | Feature-based folder structure, reusable components, data layer abstracted so mock can be swapped for a real API |
| **Functionality** | All 4 flows working end to end; nothing half-finished |

---

## 7. Submission checklist (from PDF instructions)

- [ ] Code follows good naming, indentation, small focused functions/modules
- [ ] Comments/documentation on reusable parts and any non-obvious logic (esp. complexity)
- [ ] Mock data used wherever an API would be
- [ ] Pushed to GitHub, link ready to share
- [ ] Demo video **or** screenshots of key features (goes in `demo/`, linked from README)
