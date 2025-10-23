import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { orderApi } from '~/apiRequest/order'
import type { CancelOrderResType, GetOrderDetailResType, GetOrderListResType } from '~/validateSchema/order.schema'

const initialState = {
  orders: [] as GetOrderListResType['data'],
  order: null as GetOrderDetailResType | null,
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: null as string | null
}

export const getOrderList = createAsyncThunk<GetOrderListResType, void>('order/getOrderList', async () => {
  const response = await orderApi.getOrderList()
  return response
})

export const cancelOrder = createAsyncThunk<CancelOrderResType, number>('order/cancelOrder', async (orderId) => {
  const response = await orderApi.cancelOrder(orderId, {})
  return response
})

export const changeOrderStatus = createAsyncThunk<void, number>('order/changeOrderStatus', async (orderId) => {
  await orderApi.changeOrderStatus(orderId, {})
})

export const getOrderDetail = createAsyncThunk<GetOrderDetailResType, number>(
  'order/getOrderDetail',
  async (orderId) => {
    const response = await orderApi.getOrderDetail(orderId)
    return response
  }
)

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action) => {
      state.orders = action.payload.data
      state.page = action.payload.page
      state.limit = action.payload.limit
      state.totalItems = action.payload.totalItems
      state.totalPages = action.payload.totalPages
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.data
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch orders'
        state.orders = []
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        )
      })
      .addCase(changeOrderStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to change order status'
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.order = action.payload
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to fetch order detail'
      })
  }
})
