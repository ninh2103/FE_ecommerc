import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { userApi } from "~/apiRequest/user"
import type { GetUserResType } from "~/validateSchema/account.schema"

interface UserState {
  users: GetUserResType['data']
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

export const getUser = createAsyncThunk<GetUserResType, void>('user/getUser', async () => {
  const response = await userApi.getUser()
  return response.data
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
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
        // do not clear users here to avoid flashing empty UI
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        const payload: unknown = action.payload as unknown
        let nextUsers: unknown[] = []
        if (payload && typeof payload === 'object') {
          const obj = payload as { data?: unknown; items?: unknown }
          if (Array.isArray(obj.data)) nextUsers = obj.data as unknown[]
          else if (Array.isArray(obj.items)) nextUsers = obj.items as unknown[]
        }
        if (Array.isArray(payload)) nextUsers = payload as unknown[]
        state.users = (nextUsers as unknown) as GetUserResType['data']
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load users'
        // keep existing users on error
      })
  },
})  

export const { setUsers, clearUsers } = userSlice.actions
export default userSlice.reducer