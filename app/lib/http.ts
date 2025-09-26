import axios, { HttpStatusCode } from 'axios'
import { toast } from 'sonner'
import config from '~/config'
import { getAccessTokenFromLS, getRefreshTokenFromLS, removeAccessTokenFromLS, removeRefreshTokenFromLS, setAccessTokenToLS } from '~/share/store'

const axiosClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLS()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true     
    }
    try {
      const refreshToken = getRefreshTokenFromLS()
      if (!refreshToken) {
        removeAccessTokenFromLS()
        removeRefreshTokenFromLS()
        return Promise.reject(error)
      }
      const response = await axiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, { refreshToken })

      if (response.status === HttpStatusCode.Ok) {
        const { accessToken } = response.data
        setAccessTokenToLS(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosClient(originalRequest)
      }
    } catch (error) {
      removeAccessTokenFromLS()
      removeRefreshTokenFromLS()
      toast.error('Session expired')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default axiosClient