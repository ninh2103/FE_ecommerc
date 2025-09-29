import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { profileApi } from "~/apiRequest/profile"
import type { GetUserProfileResponseType, UpdateUserProfileBodyType } from "~/validateSchema/profile.chema"

interface ProfileState {
  profile: GetUserProfileResponseType | null
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
}

export const fetchProfile = createAsyncThunk<GetUserProfileResponseType, void>('profile/fetchProfile', async () => {
  const response = await profileApi.getProfile()
  return response
})

export const updateProfile = createAsyncThunk<GetUserProfileResponseType, UpdateUserProfileBodyType>('profile/updateProfile', async (body) => {
  const response = await profileApi.updateProfile(body)
  return response
})


export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
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
  }
})
