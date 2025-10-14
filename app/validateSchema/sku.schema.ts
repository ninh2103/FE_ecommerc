import { z } from 'zod'

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string(),
  price: z.number().min(0),
  stock: z.number().min(0),
  image: z.string(),
  productId: z.number(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number(),
  updatedById: z.number().nullable()
})

export type SKUType = z.infer<typeof SKUSchema>

export const UpsertSKUSchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true
})

export type UpsertSKUType = z.infer<typeof UpsertSKUSchema>
