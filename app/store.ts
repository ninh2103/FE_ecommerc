import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '~/features/authSlice'

export const store = configureStore({
  reducer: { auth: authSlice.reducer },
  
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
