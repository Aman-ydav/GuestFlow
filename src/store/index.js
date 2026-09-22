import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/core/uiSlice'
import visitorsReducer from '@/features/registration/visitorsSlice'
import hostsReducer from '@/features/approval/hostsSlice'
import invitesReducer from '@/features/invites/invitesSlice'
import configReducer from '@/features/admin/configSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    visitors: visitorsReducer,
    hosts: hostsReducer,
    invites: invitesReducer,
    config: configReducer,
  },
  devTools: import.meta.env.DEV,
})
