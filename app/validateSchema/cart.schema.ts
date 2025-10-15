import { z } from 'zod'
import { UserSchema } from '~/validateSchema/account.schema'
import { ProductTranslationSchema } from '~/validateSchema/product-translation'
import { ProductSchema } from '~/validateSchema/product.schema'
import { SKUSchema } from '~/validateSchema/sku.schema'

export const CartItemSchema = z.object({
  id: z.number(),
  skuId: z.number().int().positive(),
  quantity: z.number(),
  userId: z.number(),

  createdAt: z.date(),
  updatedAt: z.date()
})

export type CartItemType = z.infer<typeof CartItemSchema>

export const GetCartItemParamsSchema = z.object({
  cartItemId: z.coerce.number().int().positive()
})

export type GetCartItemParamsType = z.infer<typeof GetCartItemParamsSchema>

export const GetCartItemDetailSchema = z.object({
  shop: UserSchema.pick({
    id: true,
    name: true,
    avatar: true
  }),
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SKUSchema.extend({
        product: ProductSchema.extend({
          translations: z.array(ProductTranslationSchema)
        })
      })
    })
  )
})

export type GetCartItemDetailType = z.infer<typeof GetCartItemDetailSchema>

export const GetCartResSchema = z.object({
  data: z.array(GetCartItemDetailSchema),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export type GetCartResType = z.infer<typeof GetCartResSchema>

export const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true
})

export type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>

export const UpdateCartItemBodySchema = AddToCartBodySchema

export type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>

export const DeleteCartBodySchema = z.object({
  cartItemIds: z.array(z.coerce.number().int().positive())
})

export type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>
