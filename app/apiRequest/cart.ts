import axiosClient from '~/lib/http'
import type {
  AddToCartBodyType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType
} from '~/validateSchema/cart.schema'

const API_CART_URL = '/cart'
const API_ADD_TO_CART_URL = '/cart/add'
const API_UPDATE_CART_URL = '/cart/update'
const API_DELETE_FROM_CART_URL = '/cart/delete'

export const cartApi = {
  getCart: (): Promise<GetCartResType> => axiosClient.get(API_CART_URL),
  addToCart: (body: AddToCartBodyType): Promise<GetCartResType> => axiosClient.post(API_ADD_TO_CART_URL, body),
  updateCart: (body: UpdateCartItemBodyType): Promise<GetCartResType> => axiosClient.put(API_UPDATE_CART_URL, body),
  deleteFromCart: (body: DeleteCartBodyType): Promise<GetCartResType> =>
    axiosClient.post(API_DELETE_FROM_CART_URL, body)
}
