import axiosClient from '~/lib/http'
import type {
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
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
  getProducts: (): Promise<GetProductsResType> => axiosClient.get(API_GET_PRODUCTS_URL),
  getProductById: (productId: number): Promise<GetProductDetailResType> =>
    axiosClient.get(`${API_GET_PRODUCT_BY_ID_URL}/${productId}`)
}
