import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { roleApi } from '~/apiRequest/role'
import type { CreateRoleBodyType, GetRoleResType, RoleType, UpdateRoleBodyType } from '~/validateSchema/role.schema'

// Thunk gọi API
export const getRole = createAsyncThunk<GetRoleResType, void>('role/getRole', async () => {
  const response = await roleApi.getRole()
  return response
})

export const getRoleById = createAsyncThunk<RoleType, number>('role/getRoleById', async (id) => {
  const response = await roleApi.getRoleById(id)
  return response
})

export const createRole = createAsyncThunk<RoleType, CreateRoleBodyType>('role/createRole', async (body) => {
  const response = await roleApi.createRole(body)
  return response
})

export const updateRole = createAsyncThunk<RoleType, { body: UpdateRoleBodyType; roleId: number }>(
  'role/updateRole',
  async ({ body, roleId }) => {
    const response = await roleApi.updateRole(body, roleId)
    return response
  }
)

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
      .addCase(getRoleById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.isLoading = false
        state.roles = [...state.roles, action.payload]
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch role by id'
      })
      .addCase(createRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false
        state.roles = [...state.roles, action.payload]
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to create role'
      })
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false
        state.roles = state.roles.map((role) => (role.id === action.payload.id ? action.payload : role))
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to update role'
      })
  }
})

export const { setRoles } = roleSlice.actions

export default roleSlice.reducer
