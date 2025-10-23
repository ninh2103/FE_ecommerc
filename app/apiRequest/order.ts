import axiosClient from '~/lib/http'
import type {
  CancelOrderBodyType,
  CancelOrderResType,
  CreateOrderBodyType,
  GetOrderDetailResType,
  GetOrderListResType
} from '~/validateSchema/order.schema'

const API_CREATE_ORDER_URL = '/orders'
const API_GET_ORDER_LIST_URL = '/orders'
const API_GET_ORDER_DETAIL_URL = '/orders'
const API_CANCEL_ORDER_URL = '/orders'
const API_CHANGE_ORDER_STATUS_URL = '/orders'

export const orderApi = {
  createOrder: (
    body: CreateOrderBodyType
  ): Promise<{
    paymentId: number
    orders: GetOrderListResType['data']
  }> => axiosClient.post(API_CREATE_ORDER_URL, body),
  getOrderList: (): Promise<GetOrderListResType> => axiosClient.get(API_GET_ORDER_LIST_URL),
  getOrderDetail: (orderId: number): Promise<GetOrderDetailResType> =>
    axiosClient.get(`${API_GET_ORDER_DETAIL_URL}/${orderId}`),
  cancelOrder: (orderId: number, body: CancelOrderBodyType): Promise<CancelOrderResType> =>
    axiosClient.put(`${API_CANCEL_ORDER_URL}/${orderId}`, body),
  changeOrderStatus: (orderId: number, body: CancelOrderBodyType): Promise<void> =>
    axiosClient.put(`${API_CHANGE_ORDER_STATUS_URL}/${orderId}`, body)
}
