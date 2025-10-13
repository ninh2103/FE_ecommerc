import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { brandApi } from '~/apiRequest/brand'
import type {
  CreateBrandBodyType,
  GetBrandDetailResType,
  GetBrandResType,
  UpdateBrandBodyType
} from '~/validateSchema/brand.schema'
import type { GetAllCategoriesResType } from '~/validateSchema/category.schema'

const initialState = {
  data: [] as GetBrandResType['data'],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null as string | null
}

export const getBrand = createAsyncThunk<GetBrandResType, void>('Brand/getBrand', async () => {
  const response = await brandApi.getBrands()
  return response
})

export const getBrandById = createAsyncThunk<GetBrandDetailResType, number>('Brand/getBrandById', async (id) => {
  const response = await brandApi.getBrandById(id)
  return response
})

export const createBrand = createAsyncThunk<GetBrandDetailResType, CreateBrandBodyType>(
  'Brand/createBrand',
  async (body) => {
    const response = await brandApi.createBrand(body)
    return response
  }
)

export const updateBrand = createAsyncThunk<GetBrandDetailResType, { body: UpdateBrandBodyType; BrandId: number }>(
  'Brand/updateBrand',
  async ({ body, BrandId }) => {
    const response = await brandApi.updateBrand(body, BrandId)
    return response
  }
)

export const deleteBrand = createAsyncThunk<void, number>('Brand/deleteBrand', async (BrandId: number) => {
  await brandApi.deleteBrand(BrandId)
  return
})
export const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.data = action.payload
    },
    setCategoryData: (state, action) => {
      state.data = action.payload.data
      state.page = action.payload.page
      state.limit = action.payload.limit
      state.totalItems = action.payload.totalItems
      state.totalPages = action.payload.totalPages
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBrand.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBrand.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getBrand.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch categories'
        state.data = []
      })
      .addCase(getBrandById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBrandById.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = [...state.data, action.payload]
      })
      .addCase(getBrandById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch category by id'
      })
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = [...state.data, action.payload]
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to create category'
      })
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.map((category) => (category.id === action.payload.id ? action.payload : category))
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update category'
      })
      .addCase(deleteBrand.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.filter((category) => category.id !== action.meta.arg)
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to delete category'
      })
  }
})
