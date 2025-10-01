import z from "zod"
import { UserStatus } from "~/lib/type"
import { RoleSchema } from "./role.schema"

export const UserSchema = z
  .object({
    id: z.number(),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    phoneNumber: z.string().min(10),
    avatar: z.string().nullable(),
    totpSecret: z.string().nullable(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
    roleId: z.number(),
    createdAt: z.date(),
    createdById: z.number().nullable(),
    updatedAt: z.date(),
    updatedById: z.number().nullable(),
    deletedAt: z.date().nullable(),
  })
  .strict()

export type UserType = z.infer<typeof UserSchema>



export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  roleId: true,
  avatar: true,
  status: true,
  phoneNumber: true,
  name: true,
}).strict()

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>

export const UpdateUserBodySchema = CreateUserBodySchema

export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>

export const GetUserQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
})

export type GetUserQueryType = z.infer<typeof GetUserQuerySchema>

export const GetUserParamsSchema = z.object({
  userId: z.coerce.number().int(),
})

export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>

export const GetUserSchema = z.object({
  data: z.array(
    UserSchema.omit({ password: true, totpSecret: true }).extend({ role: RoleSchema.pick({ id: true, name: true }) }),
  ),
  totalItems: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
})

export type GetUserResType = z.infer<typeof GetUserSchema>