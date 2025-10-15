import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '~/features/authSlice'
import { profileSlice } from './features/profileSlice'
import { mediaSlice } from './features/mediaSlice'
import userSlice from './features/userSlice'
import roleSlice from './features/roleSlice'
import permissionSlice from './features/permissionSlice'
import { categorySlice } from '~/features/categorySlice'
import { brandSlice } from '~/features/brandSlice'
import { productSlice } from '~/features/productSlice'
import { cartSlice } from '~/features/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    profile: profileSlice.reducer,
    media: mediaSlice.reducer,
    user: userSlice,
    role: roleSlice,
    permission: permissionSlice,
    category: categorySlice.reducer,
    brand: brandSlice.reducer,
    product: productSlice.reducer,
    cart: cartSlice.reducer
  }
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
