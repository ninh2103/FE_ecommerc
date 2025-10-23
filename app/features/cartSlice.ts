import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cartApi } from '~/apiRequest/cart'
import type {
  AddToCartBodyType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType
} from '~/validateSchema/cart.schema'

type CartState = {
  cart: GetCartResType['data'] | null
  isLoading: boolean
  error: string | null
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0
}

export const getCart = createAsyncThunk<GetCartResType, void>('cart/getCart', async () => {
  console.log('getCart API - Calling cartApi.getCart()')
  const response = await cartApi.getCart()
  console.log('getCart API - Response:', response)
  return response
})

export const addToCart = createAsyncThunk<GetCartResType, AddToCartBodyType>('cart/addToCart', async (body) => {
  const response = await cartApi.addToCart(body)
  return response
})

export const updateCart = createAsyncThunk<GetCartResType, { body: UpdateCartItemBodyType; cartItemId: number }>(
  'cart/updateCart',
  async ({ body, cartItemId }) => {
    const response = await cartApi.updateCart(body, cartItemId)
    return response
  }
)

export const deleteFromCart = createAsyncThunk<GetCartResType, DeleteCartBodyType>(
  'cart/deleteFromCart',
  async (body) => {
    const response = await cartApi.deleteFromCart(body)
    return response
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.isLoading = false
      state.cart = action.payload.data
      state.page = action.payload.page
      state.limit = action.payload.limit
      state.totalItems = action.payload.totalItems
      state.totalPages = action.payload.totalPages
      console.log('getCart.fulfilled - state.cart after update:', state.cart)
    })
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message ?? 'Failed to fetch cart'
      state.cart = []
    })
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false
      state.cart = action.payload.data
    })
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message ?? 'Failed to add to cart'
      state.cart = []
    })
    builder.addCase(updateCart.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.isLoading = false
      state.cart = action.payload.data
    })
    builder.addCase(updateCart.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message ?? 'Failed to update cart'
      state.cart = []
    })
    builder.addCase(deleteFromCart.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(deleteFromCart.fulfilled, (state, action) => {
      state.isLoading = false
      state.cart = action.payload.data
    })
    builder.addCase(deleteFromCart.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message ?? 'Failed to delete from cart'
      state.cart = []
    })
  }
})
