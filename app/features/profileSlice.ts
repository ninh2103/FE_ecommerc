import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { profileApi } from '~/apiRequest/profile'
import type { ChangePasswordBodyType } from '~/validateSchema/auth.schema'
import type { MessageResponseType } from '~/validateSchema/message.schema'
import type { GetUserProfileResponseType, UpdateUserProfileBodyType } from '~/validateSchema/profile.chema'

interface ProfileState {
  profile: GetUserProfileResponseType | null
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null
}

export const fetchProfile = createAsyncThunk<GetUserProfileResponseType, void>('profile/fetchProfile', async () => {
  const response = await profileApi.getProfile()
  return response
})

export const updateProfile = createAsyncThunk<GetUserProfileResponseType, UpdateUserProfileBodyType>(
  'profile/updateProfile',
  async (body, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const changePassword = createAsyncThunk<MessageResponseType, ChangePasswordBodyType>(
  'profile/changePassword',
  async (body, { rejectWithValue }) => {
    try {
      const response = await profileApi.changePassword(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.loading = false
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Fetch profile failed'
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload
        state.loading = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Update profile failed'
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Change password failed'
      })
  }
})
