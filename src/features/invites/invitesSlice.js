import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import * as inviteService from '@/services/inviteService'

const adapter = createEntityAdapter({
  sortComparer: (a, b) => new Date(a.windowStart) - new Date(b.windowStart),
})

export const fetchInvites = createAsyncThunk('invites/fetch', async (_, { rejectWithValue }) => {
  try {
    return await inviteService.listInvites()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createInvite = createAsyncThunk('invites/create', async (fields, { rejectWithValue }) => {
  try {
    return await inviteService.createInvite(fields)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const cancelInvite = createAsyncThunk('invites/cancel', async (id, { rejectWithValue }) => {
  try {
    return await inviteService.cancelInvite(id)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const invitesSlice = createSlice({
  name: 'invites',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
  reducers: {
    invitesErrorCleared(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvites.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchInvites.fulfilled, (state, action) => {
        state.status = 'idle'
        adapter.setAll(state, action.payload)
      })
      .addCase(fetchInvites.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? action.error.message
      })
      .addCase(createInvite.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload)
      })
      .addCase(createInvite.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        adapter.upsertOne(state, action.payload)
      })
      .addCase(cancelInvite.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message
      })
  },
})

export const { invitesErrorCleared } = invitesSlice.actions
export default invitesSlice.reducer

export const inviteSelectors = adapter.getSelectors((state) => state.invites)

export const selectInvitesForHost = createSelector(
  [inviteSelectors.selectAll, (_state, hostId) => hostId],
  (invites, hostId) => invites.filter((i) => i.hostId === hostId)
)
