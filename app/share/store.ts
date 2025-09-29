import type { UserResponseType } from "~/lib/type"

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('accessToken') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') || ''

export const getUserFromLocalStorage = (): UserResponseType | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}
export const removeAccessTokenFromLS = () => {
  localStorage.removeItem('accessToken')
}

export const removeRefreshTokenFromLS = () => {
  localStorage.removeItem('refreshToken')
}

export const setUserToLS = (user: { id: number; name: string; email: string; role: number }) => {
  localStorage.setItem('user', JSON.stringify(user))
}
export const removeUserFromLS = () => {
  localStorage.removeItem('user')
}
