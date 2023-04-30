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
      state.user = action.payload;
    },
    setAvailabilityFromScheduler: (state, action) => {
      state.availabilityInScheduler = action.payload;
    }
  }
})

export const { setUser, setAvailabilityFromScheduler } = mainSlice.actions;

const store = configureStore({
  reducer: mainSlice.reducer
})

export default store;