import axiosClient from "~/lib/http"
import type { LoginBodyType, LoginResponseType, RegisterBodyType, RegisterResponseType, SendOTPBodyType } from "~/validateSchema/auth.schema"
import type { MessageResponseType } from "~/validateSchema/message.schema"

const API_LOGIN_URL = '/auth/login'
const API_REGISTER_URL = '/auth/register'
const API_SEND_OTP_URL = '/auth/send-otp-code'

// const API_REFRESH_TOKEN_URL = '/auth/refresh-token'
// const API_LOGOUT_URL = '/auth/logout'
// const API_FORGOT_PASSWORD_URL = '/auth/forgot-password'
// const API_RESET_PASSWORD_URL = '/auth/reset-password'



export const authApi = {
  login: (body: LoginBodyType): Promise<LoginResponseType> => axiosClient.post(API_LOGIN_URL, body),
   register: (body: RegisterBodyType):Promise<RegisterResponseType> => axiosClient.post(API_REGISTER_URL, body),
   sendOtp: (body: SendOTPBodyType):Promise<MessageResponseType> => axiosClient.post(API_SEND_OTP_URL, body),
  // refreshToken: (data: RefreshTokenRequest) => axiosClient.post(API_REFRESH_TOKEN_URL, data),
  // logout: (data: LogoutRequest) => axiosClient.post(API_LOGOUT_URL, data),
  // forgotPassword: (data: ForgotPasswordRequest) => axiosClient.post(API_FORGOT_PASSWORD_URL, data),
  // resetPassword: (data: ResetPasswordRequest) => axiosClient.post(API_RESET_PASSWORD_URL, data),
  // verifyEmail: (data: VerifyEmailRequest) => axiosClient.post(API_VERIFY_EMAIL_URL, data),
}