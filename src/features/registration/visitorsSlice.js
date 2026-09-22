import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import * as visitorService from '@/services/visitorService'

const adapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
})

export const fetchVisitors = createAsyncThunk('visitors/fetch', async (params, { rejectWithValue }) => {
  try {
    return await visitorService.listVisitors(params)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const registerVisitor = createAsyncThunk('visitors/register', async (fields, { rejectWithValue }) => {
  try {
    return await visitorService.registerVisitor(fields)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

/** Covers approve / reject / check-in / check-out — the service enforces the transition table. */
export const transitionVisitor = createAsyncThunk(
  'visitors/transition',
  async ({ id, to }, { rejectWithValue }) => {
    try {
      return await visitorService.transitionVisitor(id, to)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const visitorsSlice = createSlice({
  name: 'visitors',
  initialState: adapter.getInitialState({ status: 'idle', error: null, mutatingIds: [] }),
  reducers: {
    visitorsErrorCleared(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.status = 'idle'
        adapter.setAll(state, action.payload)
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? action.error.message
      })
      .addCase(registerVisitor.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload)
      })
      .addCase(registerVisitor.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message
      })
      .addCase(transitionVisitor.pending, (state, action) => {
        state.mutatingIds.push(action.meta.arg.id)
      })
      .addCase(transitionVisitor.fulfilled, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.payload.id)
        adapter.upsertOne(state, action.payload)
      })
      .addCase(transitionVisitor.rejected, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.meta.arg.id)
        state.error = action.payload ?? action.error.message
      })
  },
})

export const { visitorsErrorCleared } = visitorsSlice.actions
export default visitorsSlice.reducer

export const visitorSelectors = adapter.getSelectors((state) => state.visitors)
export const selectVisitorsStatus = (state) => state.visitors.status
export const selectVisitorsError = (state) => state.visitors.error
export const selectIsVisitorMutating = (state, id) => state.visitors.mutatingIds.includes(id)

/** Single combined predicate, one pass — O(n) on the ids array, not O(n) per active filter. */
export const selectVisibleVisitors = createSelector(
  [visitorSelectors.selectAll, (state) => state.ui.filters],
  (visitors, { query, status, date }) => {
    const q = query.trim().toLowerCase()
    if (!q && !status && !date) return visitors
    return visitors.filter((v) => {
      if (status && v.status !== status) return false
      if (date && v.createdAt.slice(0, 10) !== date) return false
      if (q && !(v.name.toLowerCase().includes(q) || v.phone.includes(q) || v.email?.toLowerCase().includes(q))) return false
      return true
    })
  }
)

export const selectPendingForHost = createSelector(
  [visitorSelectors.selectAll, (_state, hostId) => hostId],
  (visitors, hostId) => visitors.filter((v) => v.hostId === hostId && v.status === 'pending')
)
