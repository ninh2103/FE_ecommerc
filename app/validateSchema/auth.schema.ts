import { z } from 'zod'
import { VerificationCodeType } from '~/constant/enum'

export const LoginBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  code: z
    .union([z.string().length(6, 'Mã OTP phải gồm 6 số'), z.literal('')])
    .transform((v) => (v === '' ? undefined : v))
    .optional()
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    roleId: z.number(),
    email: z.string().email()
  })
})

export type LoginResponseType = z.infer<typeof LoginResponseSchema>

export const RegisterBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  name: z.string().min(1),
  phoneNumber: z.string().min(10),
  confirmPassword: z.string().min(8),
  code: z.string().length(6)
})

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().min(1),
  phoneNumber: z.string().min(10),
  avatar: z.string().nullable(),
  roleId: z.number()
})

export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>

export const SendOTPBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  type: z.enum([
    VerificationCodeType.REGISTER,
    VerificationCodeType.FORGOT_PASSWORD,
    VerificationCodeType.LOGIN,
    VerificationCodeType.DISABLE_2FA
  ])
})

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>

export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string()
})

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResponseType = LoginResponseType

export const ForgotPasswordBodySchema = z
  .object({
    email: z.string().email(),
    code: z.string().length(6),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8)
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['newPassword']
      })
    }
  })

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>

export const ChangePasswordBodySchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    newPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password and confirm password do not match',
        path: ['newPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>

export const LogoutBodySchema = z.object({
  refreshToken: z.string()
})

export type LogoutBodyType = z.infer<typeof LogoutBodySchema>

export const Enable2FABodySchema = z.object({})

export type Enable2FABodyType = z.infer<typeof Enable2FABodySchema>

export const Enable2FAResponseSchema = z.object({
  secret: z.string(),
  uri: z.string()
})
export type Enable2FAResponseType = z.infer<typeof Enable2FAResponseSchema>

export const Disable2FABodySchema = z.object({
  code: z.string().length(6)
})
export type Disable2FABodyType = z.infer<typeof Disable2FABodySchema>
