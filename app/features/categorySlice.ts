import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryApi } from '~/apiRequest/category'
import type {
  CategoryIncludeTranslationType,
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  UpdateCategoryBodyType
} from '~/validateSchema/category.schema'

const initialState = {
  data: [] as GetAllCategoriesResType['data'],
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null as string | null
}

export const getCategory = createAsyncThunk<GetAllCategoriesResType, void>('Category/getCategory', async () => {
  const response = await categoryApi.getCategory()
  return response
})

export const getCategoryById = createAsyncThunk<CategoryIncludeTranslationType, number>(
  'Category/getCategoryById',
  async (id) => {
    const response = await categoryApi.getCategoryById(id)
    return response
  }
)

export const createCategory = createAsyncThunk<CategoryIncludeTranslationType, CreateCategoryBodyType>(
  'Category/createCategory',
  async (body) => {
    const response = await categoryApi.createCategory(body)
    return response
  }
)

export const updateCategory = createAsyncThunk<
  CategoryIncludeTranslationType,
  { body: UpdateCategoryBodyType; CategoryId: number }
>('Category/updateCategory', async ({ body, CategoryId }) => {
  const response = await categoryApi.updateCategory(body, CategoryId)
  return response
})

export const deleteCategory = createAsyncThunk<void, number>('Category/deleteCategory', async (CategoryId: number) => {
  await categoryApi.deleteCategory(CategoryId)
  return
})
export const categorySlice = createSlice({
  name: 'category',
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
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch categories'
        state.data = []
      })
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = [...state.data, action.payload]
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch category by id'
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = [...state.data, action.payload]
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to create category'
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.map((category) => (category.id === action.payload.id ? action.payload : category))
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update category'
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = state.data.filter((category) => category.id !== action.meta.arg)
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to delete category'
      })
  }
})

export const { setCategory, setCategoryData } = categorySlice.actions
export default categorySlice.reducer
