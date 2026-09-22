import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as configService from '@/services/configService'

export const fetchConfig = createAsyncThunk('config/fetch', async (_, { rejectWithValue }) => {
  try {
    return await configService.getConfig()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateConfig = createAsyncThunk('config/update', async (patch, { rejectWithValue }) => {
  try {
    return await configService.updateConfig(patch)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

// 'idle' = never fetched yet, 'loading' = fetch in flight, 'succeeded' = has real
// data. Distinguishing 'idle' from 'succeeded' (rather than collapsing both to
// 'idle') is what lets AdminSettingsForm know whether it's safe to key/mount its
// editable copy of the config, vs still showing a loading state.
const configSlice = createSlice({
  name: 'config',
  initialState: { preApprovalLimit: 5, overstayMinutes: 120, offices: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { status: 'succeeded' })
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.status = 'succeeded' // don't block the UI forever on a failed fetch — fall back to defaults
        state.error = action.payload ?? action.error.message
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
  },
})

export default configSlice.reducer
export const selectConfig = (state) => state.config
export const selectPreApprovalLimit = (state) => state.config.preApprovalLimit
export const selectOverstayMinutes = (state) => state.config.overstayMinutes
