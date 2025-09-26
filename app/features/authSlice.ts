import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "~/apiRequest/auth";
import type { LoginBodyType, LoginResponseType, RegisterBodyType, RegisterResponseType, SendOTPBodyType } from "~/validateSchema/auth.schema";
import type { MessageResponseType } from "~/validateSchema/message.schema";

interface AuthState {
  isAuthenticated: boolean
  accessToken: string
  refreshToken: string
  loading: boolean
  error: string | null
}

export const fetchLogin = createAsyncThunk<LoginResponseType,LoginBodyType>('auth/fetchLogin', async (body: LoginBodyType) => {
  const response = await authApi.login(body)
  return response
})

export const fetchRegister = createAsyncThunk<RegisterResponseType, RegisterBodyType>(
  'auth/fetchRegister',
  async (body) => {
    const response = await authApi.register(body)
    return response
  }
)

export const fetchSendOtpCode = createAsyncThunk<MessageResponseType,SendOTPBodyType>(
  'auth/fetchSendOtpCode',
  async (body) => {
    const response = await authApi.sendOtp(body)
    return response
  }
)

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: '',
  refreshToken: '',
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to login'
      })

      .addCase(fetchRegister.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRegister.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = true
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to Register'
      })
      .addCase(fetchSendOtpCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSendOtpCode.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = true
      })
      .addCase(fetchSendOtpCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Send OTP fail !'
      })

  }
})