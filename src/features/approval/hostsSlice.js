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

const hostsSlice = createSlice({
  name: 'hosts',
  initialState: adapter.getInitialState({ status: 'idle', error: null }),
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
  },
})

export default hostsSlice.reducer
export const hostSelectors = adapter.getSelectors((state) => state.hosts)
