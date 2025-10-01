export type  UserResponseType = {
  id: string
  name: string
  email: string
  role: string
}

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const