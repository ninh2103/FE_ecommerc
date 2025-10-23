import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { paymentApi } from '~/apiRequest/payment'
import type { PaymentTransaction, WebhookPaymentBodyType } from '~/validateSchema/payment.schema'

type PaymentState = {
  transactions: PaymentTransaction[]
  isLoading: boolean
  error: string | null
}

const initialState: PaymentState = {
  transactions: [],
  isLoading: false,
  error: null
}

export const receivePayment = createAsyncThunk<PaymentTransaction, WebhookPaymentBodyType>(
  'payment/receivePayment',
  async (body) => {
    const response = await paymentApi.receivePayment(body)
    return response
  }
)

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(receivePayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(receivePayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions.push(action.payload)
      })
      .addCase(receivePayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to receive payment'
      })
  }
})

export const { clearError } = paymentSlice.actions
export default paymentSlice.reducer
