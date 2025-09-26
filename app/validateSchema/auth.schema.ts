import { z } from 'zod'
import { VerificationCodeType } from '~/constant/enum'

export const LoginBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type LoginResponseType = z.infer<typeof LoginResponseSchema>

export const RegisterBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  name: z.string().min(1),
  phoneNumber: z.string().min(10),
  confirmPassword: z.string().min(8),
  code: z.string().length(6),

})

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = z.object({
  id: z.number(),
    email: z.string().email(),
    name: z.string().min(1),
    phoneNumber: z.string().min(10),
    avatar: z.string().nullable(),
    roleId: z.number(),
})

export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>

export const SendOTPBodySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  type: z.enum([
    VerificationCodeType.REGISTER,
    VerificationCodeType.FORGOT_PASSWORD,
    VerificationCodeType.LOGIN,
    VerificationCodeType.DISABLE_2FA,
  ]),

})

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
