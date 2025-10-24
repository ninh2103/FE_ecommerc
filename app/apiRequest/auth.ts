import axiosClient from '~/lib/http'
import type {
  Disable2FABodyType,
  Enable2FABodyType,
  Enable2FAResponseType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LoginResponseType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResponseType,
  RegisterBodyType,
  RegisterResponseType,
  SendOTPBodyType
} from '~/validateSchema/auth.schema'
import type { MessageResponseType } from '~/validateSchema/message.schema'

const API_LOGIN_URL = '/auth/login'
const API_REGISTER_URL = '/auth/register'
const API_SEND_OTP_URL = '/auth/send-otp-code'
const API_REFRESH_TOKEN_URL = '/auth/refresh-token'
const API_LOGOUT_URL = '/auth/logout'
const API_FORGOT_PASSWORD_URL = '/auth/forgot-password'
const API_ENABLE_2FA_URL = '/auth/2fa/setup'
const API_DISABLE_2FA_URL = '/auth/2fa/disable'

export const authApi = {
  login: (body: LoginBodyType): Promise<LoginResponseType> => axiosClient.post(API_LOGIN_URL, body),
  register: (body: RegisterBodyType): Promise<RegisterResponseType> => axiosClient.post(API_REGISTER_URL, body),
  sendOtp: (body: SendOTPBodyType): Promise<MessageResponseType> => axiosClient.post(API_SEND_OTP_URL, body),
  refreshToken: (body: RefreshTokenBodyType): Promise<RefreshTokenResponseType> =>
    axiosClient.post(API_REFRESH_TOKEN_URL, body),
  logout: (body: LogoutBodyType): Promise<MessageResponseType> => axiosClient.post(API_LOGOUT_URL, body),
  forgotPassword: (body: ForgotPasswordBodyType): Promise<MessageResponseType> =>
    axiosClient.post(API_FORGOT_PASSWORD_URL, body),
  enable2fa: (body: Enable2FABodyType): Promise<Enable2FAResponseType> => axiosClient.post(API_ENABLE_2FA_URL, body),
  disable2fa: (body: Disable2FABodyType): Promise<MessageResponseType> => axiosClient.post(API_DISABLE_2FA_URL, body)
}
