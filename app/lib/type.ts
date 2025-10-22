export type UserResponseType = {
  id: string
  name: string
  email: string
  role: string
}

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED'
} as const

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
} as const

export const ALL_LANGUAGE = 'all'

export const ProductOrderBy = {
  ASC: 'asc',
  DESC: 'desc'
} as const

export type ProductOrderByType = (typeof ProductOrderBy)[keyof typeof ProductOrderBy]

export const ProductSortBy = {
  PRICE: 'price',
  CREATED_AT: 'createdAt',
  SALE: 'sale'
} as const

export type ProductSortByType = (typeof ProductSortBy)[keyof typeof ProductSortBy]

export const PAYMENT_PREFIX = 'DH'

export type Variant = {
  value: string
  options: string[]
}

export type SKU = {
  value: string
  price: number
  stock: number
  image: string
}

export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_PICKUP: 'PENDING_PICKUP',
  PENDING_DELIVERY: 'PENDING_DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED'
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
