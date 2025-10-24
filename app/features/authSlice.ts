import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from '~/apiRequest/auth'
import type {
  Disable2FABodyType,
  Enable2FABodyType,
  Enable2FAResponseType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResponseType,
  LogoutBodyType,
  RegisterBodyType,
  RegisterResponseType,
  SendOTPBodyType
} from '~/validateSchema/auth.schema'
import type { MessageResponseType } from '~/validateSchema/message.schema'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string
  refreshToken: string
  loading: boolean
  error: string | null
}

export const fetchLogin = createAsyncThunk<LoginResponseType, LoginBodyType>(
  'auth/fetchLogin',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.login(body)
      return response
    } catch (error: any) {
      // Chỉ trả về data có thể serialize được
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const fetchRegister = createAsyncThunk<RegisterResponseType, RegisterBodyType>(
  'auth/fetchRegister',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.register(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const fetchSendOtpCode = createAsyncThunk<MessageResponseType, SendOTPBodyType>(
  'auth/fetchSendOtpCode',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const fetchForgotPassword = createAsyncThunk<MessageResponseType, ForgotPasswordBodyType>(
  'auth/fetchForgotPassword',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const fetchLogout = createAsyncThunk<MessageResponseType, LogoutBodyType>('auth/fetchLogout', async (body) => {
  const response = await authApi.logout(body)
  return response
})

export const fetchEnable2FA = createAsyncThunk<Enable2FAResponseType, Enable2FABodyType>(
  'auth/fetchEnable2FA',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.enable2fa(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

export const fetchDisable2FA = createAsyncThunk<MessageResponseType, Disable2FABodyType>(
  'auth/fetchDisable2FA',
  async (body, { rejectWithValue }) => {
    try {
      const response = await authApi.disable2fa(body)
      return response
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || error.message,
        status: error.response?.status
      })
    }
  }
)

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: '',
  refreshToken: '',
  loading: false,
  error: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
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
        state.error = (action.error.message as string) || 'Failed to login'
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
      .addCase(fetchForgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchForgotPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchForgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Forgot password fail !'
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Logout fail !'
      })
      .addCase(fetchEnable2FA.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEnable2FA.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchEnable2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Enable 2FA fail !'
      })
      .addCase(fetchDisable2FA.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDisable2FA.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchDisable2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Disable 2FA fail !'
      })
  }
})
