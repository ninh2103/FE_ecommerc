import axiosClient from '~/lib/http'
import type { CancelOrderBodyType, CreateOrderBodyType, GetOrderListResType } from '~/validateSchema/order.schema'

const API_CREATE_ORDER_URL = '/order'
const API_GET_ORDER_LIST_URL = '/order'
const API_GET_ORDER_DETAIL_URL = '/order'
const API_CANCEL_ORDER_URL = '/order'
const API_CHANGE_ORDER_STATUS_URL = '/order'

export const orderApi = {
  createOrder: (body: CreateOrderBodyType) => axiosClient.post(API_CREATE_ORDER_URL, body),
  getOrderList: (): Promise<GetOrderListResType> => axiosClient.get(API_GET_ORDER_LIST_URL),
  getOrderDetail: (orderId: number) => axiosClient.get(`${API_GET_ORDER_DETAIL_URL}/${orderId}`),
  cancelOrder: (orderId: number, body: CancelOrderBodyType) =>
    axiosClient.put(`${API_CANCEL_ORDER_URL}/${orderId}`, body),
  changeOrderStatus: (orderId: number, body: CancelOrderBodyType) =>
    axiosClient.put(`${API_CHANGE_ORDER_STATUS_URL}/${orderId}`, body)
}
