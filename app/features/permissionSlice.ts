import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { permissionApi } from '~/apiRequest/permission'
import type {
  CreatePermissionBodyType,
  GetPermissionResType,
  PermissionType,
  UpdatePermissionBodyType
} from '~/validateSchema/permission.schema'

// Thunk gọi API
export const getPermission = createAsyncThunk<GetPermissionResType, void>('permission/getPermission', async () => {
  const response = await permissionApi.getPermission()
  return response
})

export const getPermissionById = createAsyncThunk<PermissionType, number>(
  'permission/getPermissionById',
  async (id) => {
    const response = await permissionApi.getPermissionById(id)
    return response
  }
)

export const createPermission = createAsyncThunk<PermissionType, CreatePermissionBodyType>(
  'permission/createPermission',
  async (body) => {
    const response = await permissionApi.createPermission(body)
    return response
  }
)

export const updatePermission = createAsyncThunk<
  PermissionType,
  { body: UpdatePermissionBodyType; permissionId: number }
>('permission/updatePermission', async ({ body, permissionId }) => {
  const response = await permissionApi.updatePermission(body, permissionId)
  return response
})

export const deletePermission = createAsyncThunk<number, number>(
  'permission/deletePermission',
  async (permissionId: number) => {
    await permissionApi.deletePermission(permissionId)
    return permissionId
  }
)

const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    data: [] as GetPermissionResType['data'],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    error: null as string | null
  },
  reducers: {
    setPermissions: (state, action) => {
      state.data = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPermission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPermission.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getPermission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch permissions'
        state.data = []
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.data = state.data.filter((permission) => permission.id !== action.payload)
      })
      .addCase(deletePermission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to delete permission'
      })
      .addCase(getPermissionById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPermissionById.fulfilled, (state, action) => {
        state.isLoading = false
        // Không thêm vào data để tránh vòng lặp vô hạn
      })
      .addCase(getPermissionById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch permission by id'
      })
      .addCase(createPermission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.isLoading = false
        // Không thêm vào data để tránh re-render không cần thiết
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to create permission'
      })
      .addCase(updatePermission.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.isLoading = false
        // Không cập nhật data để tránh re-render không cần thiết
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update permission'
      })
  }
})

export const { setPermissions } = permissionSlice.actions

export default permissionSlice.reducer
