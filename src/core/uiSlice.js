import { createSlice } from '@reduxjs/toolkit'

const ROLE_KEY = 'guestflow:role'
const SIDEBAR_KEY = 'guestflow:sidebarCollapsed'

function getPreferredRole() {
  try {
    const stored = localStorage.getItem(ROLE_KEY)
    if (['visitor', 'host', 'front-desk', 'admin'].includes(stored)) return stored
  } catch {
    // ignore
  }
  return 'front-desk'
}

function getPreferredSidebarCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true'
  } catch {
    return false
  }
}

const initialState = {
  // Light-only by design (Aman's explicit call) — no theme toggle, no system-preference
  // detection. Kept as a field (rather than deleted outright) only so a future dark
  // mode doesn't require a state-shape migration; nothing in the UI can change it today.
  theme: 'light',
  role: getPreferredRole(),
  sidebarCollapsed: getPreferredSidebarCollapsed(),
  filters: { query: '', status: '', date: '' },
  selectedVisitorId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    roleChanged(state, action) {
      state.role = action.payload
      state.selectedVisitorId = null
      try {
        localStorage.setItem(ROLE_KEY, state.role)
      } catch {
        // ignore write failure
      }
    },
    sidebarToggled(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
      try {
        localStorage.setItem(SIDEBAR_KEY, String(state.sidebarCollapsed))
      } catch {
        // ignore write failure
      }
    },
    filterChanged(state, action) {
      Object.assign(state.filters, action.payload)
    },
    filtersReset(state) {
      state.filters = { query: '', status: '', date: '' }
    },
    visitorSelected(state, action) {
      state.selectedVisitorId = action.payload
    },
  },
})

export const { roleChanged, sidebarToggled, filterChanged, filtersReset, visitorSelected } = uiSlice.actions
export default uiSlice.reducer

export const selectTheme = (state) => state.ui.theme
export const selectRole = (state) => state.ui.role
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectFilters = (state) => state.ui.filters
export const selectSelectedVisitorId = (state) => state.ui.selectedVisitorId
