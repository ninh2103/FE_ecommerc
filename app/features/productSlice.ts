import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productApi } from '~/apiRequest/product'
import type {
  GetProductDetailResType,
  GetProductsResType,
  GetProductsQueryType,
  ProductType,
  UpdateProductBodyType
} from '~/validateSchema/product.schema'
import type { CreateProductBodyType } from '~/validateSchema/product.schema'

const initialState = {
  data: [] as GetProductsResType['data'],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null as string | null
}

export const getManagementProducts = createAsyncThunk<GetProductsResType, void>(
  'Product/getManagementProducts',
  async () => {
    const response = await productApi.getManagementProducts()
    return response
  }
)

export const getManagementProductById = createAsyncThunk<GetProductDetailResType, number>(
  'Product/getManagementProductById',
  async (productId) => {
    const response = await productApi.getManagementProductById(productId)
    return response
  }
)

export const createProduct = createAsyncThunk<ProductType, CreateProductBodyType>(
  'Product/createProduct',
  async (body) => {
    const response = await productApi.createProduct(body)
    return response
  }
)

export const updateProduct = createAsyncThunk<ProductType, { body: UpdateProductBodyType; productId: number }>(
  'Product/updateProduct',
  async ({ body, productId }) => {
    const response = await productApi.updateProduct(body, productId)
    return response
  }
)

export const deleteProduct = createAsyncThunk<void, number>('Product/deleteProduct', async (productId) => {
  await productApi.deleteProduct(productId)
  return
})

export const getProducts = createAsyncThunk<GetProductsResType, GetProductsQueryType | undefined>(
  'Product/getProducts',
  async (params) => {
    const response = await productApi.getProducts(params)
    return response
  }
)

export const getProductById = createAsyncThunk<GetProductDetailResType, number>(
  'Product/getProductById',
  async (productId) => {
    const response = await productApi.getProductById(productId)
    return response
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch products'
        state.data = []
      })
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false
        const product = action.payload as any
        const idx = state.data.findIndex((p) => p.id === product.id)
        const safeProduct = { ...product, translations: product.translations ?? [] }
        if (idx >= 0) {
          state.data[idx] = { ...state.data[idx], ...safeProduct }
        } else {
          state.data.push(safeProduct)
        }
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch product by id'
      })
      .addCase(getManagementProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getManagementProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
      })
      .addCase(getManagementProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch management products'
      })
      .addCase(getManagementProductById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getManagementProductById.fulfilled, (state, action) => {
        state.isLoading = false
        const product = action.payload as any
        const idx = state.data.findIndex((p) => p.id === product.id)
        const safeProduct = { ...product, translations: product.translations ?? [] }
        if (idx >= 0) {
          state.data[idx] = { ...state.data[idx], ...safeProduct }
        } else {
          state.data.push(safeProduct)
        }
      })
      .addCase(getManagementProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch management product by id'
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const safeProduct = { ...(action.payload as any), translations: [] }
        state.data = [...state.data, safeProduct]
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to create product'
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload as any
        state.data = state.data.map((p) =>
          p.id === updated.id ? { ...p, ...updated, translations: p.translations ?? [] } : p
        )
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update product'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.filter((product) => product.id !== action.meta.arg)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to delete product'
      })
  }
})

export default productSlice.reducer
