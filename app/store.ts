import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '~/features/authSlice'
import { profileSlice } from './features/profileSlice'
import { mediaSlice } from './features/mediaSlice'

export const store = configureStore({
  reducer: { auth: authSlice.reducer, profile: profileSlice.reducer, media: mediaSlice.reducer },
  
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
