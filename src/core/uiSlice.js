import { createSlice } from '@reduxjs/toolkit'

const THEME_KEY = 'guestflow:theme'
const ROLE_KEY = 'guestflow:role'

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage unavailable (private mode) — fall through to system preference
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getPreferredRole() {
  try {
    const stored = localStorage.getItem(ROLE_KEY)
    if (['visitor', 'host', 'front-desk', 'admin'].includes(stored)) return stored
  } catch {
    // ignore
  }
  return 'front-desk'
}

const initialState = {
  theme: getPreferredTheme(),
  role: getPreferredRole(),
  filters: { query: '', status: '', date: '' },
  selectedVisitorId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    themeToggled(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_KEY, state.theme)
      } catch {
        // ignore write failure
      }
    },
    roleChanged(state, action) {
      state.role = action.payload
      state.selectedVisitorId = null
      try {
        localStorage.setItem(ROLE_KEY, state.role)
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

export const { themeToggled, roleChanged, filterChanged, filtersReset, visitorSelected } = uiSlice.actions
export default uiSlice.reducer

export const selectTheme = (state) => state.ui.theme
export const selectRole = (state) => state.ui.role
export const selectFilters = (state) => state.ui.filters
export const selectSelectedVisitorId = (state) => state.ui.selectedVisitorId
