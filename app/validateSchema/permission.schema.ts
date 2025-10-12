import z from 'zod'

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  path: z.string(),
  method: z.string(),
  module: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable()
})

export type PermissionType = z.infer<typeof PermissionSchema>

export const GetPermissionResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>

export const CreatePermissionBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  path: z.string(),
  method: z.string(),
  module: z.string()
})

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>

export const CreatePermissionResSchema = PermissionSchema

export const UpdatePermissionBodySchema = CreatePermissionBodySchema.partial().strict()
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
