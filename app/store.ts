import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '~/features/authSlice'
import { profileSlice } from './features/profileSlice'
import { mediaSlice } from './features/mediaSlice'
import userSlice from './features/userSlice'

export const store = configureStore({
  reducer: { auth: authSlice.reducer, profile: profileSlice.reducer, media: mediaSlice.reducer, user: userSlice },
  
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
