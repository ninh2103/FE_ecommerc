import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { userApi } from '~/apiRequest/user'
import type { CreateUserBodyType, GetUserResType, UpdateUserBodyType, UserType } from '~/validateSchema/account.schema'

interface UserState {
  users: GetUserResType['data']
  page: number
  limit: number
  totalItems: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  error: null
}

export const getUser = createAsyncThunk<GetUserResType, { silent?: boolean } | undefined>('user/getUser', async () => {
  const response = await userApi.getUser()
  return response
})

export const createUser = createAsyncThunk<void, CreateUserBodyType>('user/createUser', async (body, { dispatch }) => {
  await userApi.createUser(body)
})

export const updateUser = createAsyncThunk<void, UpdateUserBodyType & { id: number }>(
  'user/updateUser',
  async (body, { dispatch }) => {
    const { id, ...updateData } = body

    await userApi.updateUser(updateData, id)
  }
)

export const deleteUser = createAsyncThunk<void, number>('user/deleteUser', async (id, { dispatch }) => {
  await userApi.deleteUser(id)
})

export const getUserById = createAsyncThunk<UserType, number>('user/getUserById', async (id, { dispatch }) => {
  const response = await userApi.getUserById(id)
  return response
})
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<GetUserResType['data']>) => {
      state.users = action.payload
    },
    clearUsers: (state) => {
      state.users = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state, action) => {
        const isSilent = Boolean(action.meta.arg?.silent)
        if (!isSilent) {
          state.loading = true
        }
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const isSilent = Boolean(action.meta.arg?.silent)
        if (!isSilent) {
          state.loading = false
        }
        state.users = action.payload.data
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
      })
      .addCase(getUser.rejected, (state, action) => {
        const isSilent = Boolean(action.meta.arg?.silent)
        if (!isSilent) {
          state.loading = false
        }
        state.error = action.error.message || 'Failed to load users'
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create user'
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update user'
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete user'
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to get user by id'
      })
  }
})

export const { setUsers, clearUsers } = userSlice.actions
export default userSlice.reducer
