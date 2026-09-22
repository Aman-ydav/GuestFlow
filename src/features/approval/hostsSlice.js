import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import * as hostService from '@/services/hostService'

const adapter = createEntityAdapter()

export const fetchHosts = createAsyncThunk('hosts/fetch', async (_, { rejectWithValue }) => {
  try {
    return await hostService.listHosts()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createHost = createAsyncThunk('hosts/create', async (fields, { rejectWithValue }) => {
  try {
    return await hostService.createHost(fields)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteHost = createAsyncThunk('hosts/delete', async (id, { rejectWithValue }) => {
  try {
    await hostService.deleteHost(id)
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const hostsSlice = createSlice({
  name: 'hosts',
  initialState: adapter.getInitialState({ status: 'idle', error: null, mutatingIds: [] }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchHosts.fulfilled, (state, action) => {
        state.status = 'idle'
        adapter.setAll(state, action.payload)
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? action.error.message
      })
      .addCase(createHost.fulfilled, (state, action) => {
        adapter.addOne(state, action.payload)
      })
      .addCase(createHost.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message
      })
      .addCase(deleteHost.pending, (state, action) => {
        state.mutatingIds.push(action.meta.arg)
      })
      .addCase(deleteHost.fulfilled, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.payload)
        adapter.removeOne(state, action.payload)
      })
      .addCase(deleteHost.rejected, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.meta.arg)
        state.error = action.payload ?? action.error.message
      })
  },
})

export default hostsSlice.reducer
export const hostSelectors = adapter.getSelectors((state) => state.hosts)
export const selectIsHostMutating = (state, id) => state.hosts.mutatingIds.includes(id)
