import axiosClient from '~/lib/http'
import type {
  GetProductDetailResType,
  GetProductsResType,
  GetProductsQueryType,
  ProductType,
  UpdateProductBodyType
} from '~/validateSchema/product.schema'
import type { CreateProductBodyType } from '~/validateSchema/product.schema'

const API_GET_MANAGEMENT_PRODUCTS_URL = 'management-product/products'
const API_CREATE_PRODUCT_URL = 'management-product/products'
const API_UPDATE_PRODUCT_URL = 'management-product/products'
const API_DELETE_PRODUCT_URL = 'management-product/products'
const API_GET_MANAGEMENT_PRODUCT_BY_ID_URL = 'management-product/products'
const API_GET_PRODUCTS_URL = '/product'
const API_GET_PRODUCT_BY_ID_URL = '/product'

export const productApi = {
  getManagementProducts: (): Promise<GetProductsResType> => axiosClient.get(API_GET_MANAGEMENT_PRODUCTS_URL),
  createProduct: (body: CreateProductBodyType): Promise<ProductType> => axiosClient.post(API_CREATE_PRODUCT_URL, body),
  updateProduct: (body: UpdateProductBodyType, productId: number): Promise<ProductType> =>
    axiosClient.put(`${API_UPDATE_PRODUCT_URL}/${productId}`, body),
  deleteProduct: (productId: number): Promise<void> => axiosClient.delete(`${API_DELETE_PRODUCT_URL}/${productId}`),
  getManagementProductById: (productId: number): Promise<GetProductDetailResType> =>
    axiosClient.get(`${API_GET_MANAGEMENT_PRODUCT_BY_ID_URL}/${productId}`),
  getProducts: (query?: GetProductsQueryType | undefined): Promise<GetProductsResType> => {
    // Handle array parameters manually for proper serialization
    const params = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // For arrays, add each value separately
            value.forEach((item) => params.append(key, String(item)))
          } else {
            params.append(key, String(value))
          }
        }
      })
    }

    return axiosClient.get(`${API_GET_PRODUCTS_URL}?${params.toString()}`)
  },
  getProductById: (productId: number): Promise<GetProductDetailResType> =>
    axiosClient.get(`${API_GET_PRODUCT_BY_ID_URL}/${productId}`)
}
