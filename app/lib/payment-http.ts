import axios from 'axios'
import config from '~/config'

// Create a separate axios instance for payment API that uses API key instead of Bearer token
const paymentAxiosClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add API key
paymentAxiosClient.interceptors.request.use(
  (config) => {
    // Add API key to headers
    const apiKey = import.meta.env.VITE_PAYMENT_API_KEY || ''
    config.headers['payment-api-key'] = apiKey
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to return data directly
paymentAxiosClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default paymentAxiosClient
