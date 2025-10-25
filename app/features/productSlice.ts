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

type ProductListState = {
  data: GetProductsResType['data']
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

type ProductState = {
  list: ProductListState
  details: Record<number, GetProductDetailResType | null> // map id -> detail
  listLoading: boolean
  detailLoading: boolean
  error: string | null
}

const initialState: ProductState = {
  list: {
    data: [],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  },
  details: {},
  listLoading: false,
  detailLoading: false,
  error: null
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
        state.listLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.listLoading = false
        state.list.data = action.payload.data
        state.list.page = action.payload.page
        state.list.limit = action.payload.limit
        state.list.totalItems = action.payload.totalItems
        state.list.totalPages = action.payload.totalPages
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.listLoading = false
        state.error = action.error.message ?? 'Failed to fetch products'
        state.list.data = []
      })
      .addCase(getProductById.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.detailLoading = false
        const product = action.payload as GetProductDetailResType
        const safeProduct = { ...product, translations: product.translations ?? [] }

        // Lưu vào productDetails
        state.details[product.id] = safeProduct

        // Cũng cập nhật vào productList.data nếu có
        const idx = state.list.data.findIndex((p) => p.id === product.id)
        if (idx >= 0) {
          state.list.data[idx] = { ...state.list.data[idx], ...safeProduct }
        } else {
          state.list.data.push(safeProduct)
        }
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.error.message ?? 'Failed to fetch product by id'
      })
      .addCase(getManagementProducts.pending, (state) => {
        state.listLoading = true
      })
      .addCase(getManagementProducts.fulfilled, (state, action) => {
        state.listLoading = false
        state.list.data = action.payload.data
      })
      .addCase(getManagementProducts.rejected, (state, action) => {
        state.listLoading = false
        state.error = action.error.message ?? 'Failed to fetch management products'
      })
      .addCase(getManagementProductById.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(getManagementProductById.fulfilled, (state, action) => {
        state.detailLoading = false
        const product = action.payload as GetProductDetailResType
        const safeProduct = { ...product, translations: product.translations ?? [] }

        // Lưu vào productDetails
        state.details[product.id] = safeProduct

        // Cũng cập nhật vào productList.data nếu có
        const idx = state.list.data.findIndex((p) => p.id === product.id)
        if (idx >= 0) {
          state.list.data[idx] = { ...state.list.data[idx], ...safeProduct }
        } else {
          state.list.data.push(safeProduct)
        }
      })
      .addCase(getManagementProductById.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.error.message ?? 'Failed to fetch management product by id'
      })
      .addCase(createProduct.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.detailLoading = false
        const safeProduct = { ...(action.payload as any), translations: [] }
        state.list.data = [...state.list.data, safeProduct]
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.error.message ?? 'Failed to create product'
      })
      .addCase(updateProduct.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.detailLoading = false
        const updated = action.payload as any
        state.list.data = state.list.data.map((p) =>
          p.id === updated.id ? { ...p, ...updated, translations: p.translations ?? [] } : p
        )
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.error.message ?? 'Failed to update product'
      })
      .addCase(deleteProduct.pending, (state) => {
        state.detailLoading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.detailLoading = false
        state.list.data = state.list.data.filter((product) => product.id !== action.meta.arg)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.detailLoading = false
        state.error = action.error.message ?? 'Failed to delete product'
      })
  }
})

export default productSlice.reducer
