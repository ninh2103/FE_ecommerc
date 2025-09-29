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
    const originalRequest = error?.config
    const status = error?.response?.status

    // Only handle 401 once per request
    if (status !== HttpStatusCode.Unauthorized || (originalRequest as any)?._retry) {
      return Promise.reject(error)
    }

    ;(originalRequest as any)._retry = true

    try {
      const refreshToken = getRefreshTokenFromLS()
      if (!refreshToken) {
        removeAccessTokenFromLS()
        removeRefreshTokenFromLS()
        return Promise.reject(error)
      }

      // Use base axios (no interceptors) to avoid recursive interceptor calls and response shaping
      const refreshResponse = await axios.post(
        `${config.baseUrl}/auth/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      )

      console.log('refreshResponse', refreshResponse)

      if (refreshResponse.status === HttpStatusCode.Ok) {
        const { accessToken } = refreshResponse.data
        if (!accessToken) {
          throw new Error('No access token returned from refresh endpoint')
        }
        setAccessTokenToLS(accessToken)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosClient(originalRequest)
      }
    } catch (refreshError) {
      removeAccessTokenFromLS()
      removeRefreshTokenFromLS()
      toast.error('Session expired')
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }

    return Promise.reject(error)
  }
)

export default axiosClient