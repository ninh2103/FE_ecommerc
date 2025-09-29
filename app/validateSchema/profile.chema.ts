import { z } from "zod"

export const GetUserProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  avatar: z.string(),
})

export type GetUserProfileResponseType = z.infer<typeof GetUserProfileSchema>


export const UpdateUserProfileBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  avatar: z.string(),
})

export type UpdateUserProfileBodyType = z.infer<typeof UpdateUserProfileBodySchema>