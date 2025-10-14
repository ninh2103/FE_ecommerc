import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productApi } from '~/apiRequest/product'
import type { GetProductsResType } from '~/validateSchema/product.schema'

const initialState = {
  data: [] as GetProductsResType['data'],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null as string | null
}

const getManagementProducts = createAsyncThunk<GetProductsResType, void>('Product/getManagementProducts', async () => {
  const response = await productApi.getManagementProducts()
  return response
})

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getManagementProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getManagementProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getManagementProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch management products'
        state.data = []
      })
  }
})

export default productSlice.reducer
