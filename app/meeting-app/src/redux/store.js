import { createSlice, configureStore } from '@reduxjs/toolkit'

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    user: {
      id: null,
      phone: null,
      name: null,
      availability: null
    },
    availabilityInScheduler: {}
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // used whenever user data need to be updated, generally from a server-side action. 
    },
    setAvailabilityFromScheduler: (state, action) => {
      state.availabilityInScheduler = action.payload; // used by scheduler.jsx file
    }
  }
})

export const { setUser, setAvailabilityFromScheduler } = mainSlice.actions;

const store = configureStore({
  reducer: mainSlice.reducer
})

export default store;