import paymentAxiosClient from '~/lib/payment-http'
import type { PaymentTransaction, WebhookPaymentBodyType } from '~/validateSchema/payment.schema'

const API_PAYMENT_URL = '/payment/receive'

const paymentApi = {
  receivePayment: (body: WebhookPaymentBodyType): Promise<PaymentTransaction> =>
    paymentAxiosClient.post(API_PAYMENT_URL, body)
}

export { paymentApi }
