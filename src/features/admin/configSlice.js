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

const configSlice = createSlice({
  name: 'config',
  initialState: { preApprovalLimit: 5, overstayMinutes: 120, offices: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { status: 'idle' })
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
