import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { roleApi } from '~/apiRequest/role'
import type { GetRoleResType, RoleType } from '~/validateSchema/role.schema'

// Thunk gọi API
export const getRole = createAsyncThunk<GetRoleResType, void>('role/getRole', async () => {
  const response = await roleApi.getRole()
  return response
})

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    roles: [] as RoleType[],
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    error: null as string | null
  },
  reducers: {
    setRoles: (state, action) => {
      state.roles = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.isLoading = false
        state.roles = action.payload.roles
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch roles'
        state.roles = []
      })
  }
})

export const { setRoles } = roleSlice.actions

export default roleSlice.reducer
