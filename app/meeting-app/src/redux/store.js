import React from 'react'
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
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

export const { setUser, setAvailabilityFromScheduler } = counterSlice.actions;

const store = configureStore({
  reducer: counterSlice.reducer
})

export default store;