import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import { formattedDate, formatVND } from '~/lib/utils'
import { toast } from 'sonner'
import { CreditCard, Banknote, ArrowLeft } from 'lucide-react'
import type { WebhookPaymentBodyType } from '~/validateSchema/payment.schema'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { receivePayment } from '~/features/paymentSlice'

type PaymentData = {
  orderId: number
  total: number
  receiver: {
    name: string
    phone: string
    address: string
  }
  items: Array<{
    id: number
    title: string
    price: number
    quantity: number
    image: string
  }>
}

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const transactions = useSelector((s: RootState) => s.payment.transactions)
  const isLoading = useSelector((s: RootState) => s.payment.isLoading)
  const error = useSelector((s: RootState) => s.payment.error)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')

  // Lấy dữ liệu từ Checkout page
  const paymentData = location.state as PaymentData | null

  // Redirect nếu không có dữ liệu
  useEffect(() => {
    if (!paymentData) {
      navigate('/checkout')
    }
  }, [paymentData, navigate])

  if (!paymentData) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-slate-900 mb-4'>Không tìm thấy thông tin đơn hàng</h2>
          <Button onClick={() => navigate('/checkout')} className='bg-slate-900 hover:bg-slate-800 text-white'>
            Quay lại Checkout
          </Button>
        </div>
      </div>
    )
  }

  const { orderId, total, receiver, items } = paymentData
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 30000
  const finalTotal = total

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const paymentBody: WebhookPaymentBodyType = {
        id: orderId + 1, // số tự tăng (tự tăng)
        gateway: paymentMethod as 'bank_transfer' | 'momo' | 'zalopay',
        transactionDate: formattedDate, // ngày thanh toán
        accountNumber: '0123499999', // số tài khoản
        code: null, // mã code
        content: `DH${orderId}`, // nội dung thanh toán
        transferType: 'in' as const, // in: nạp, out: rút
        transferAmount: 200000, // số tiền thanh toán
        accumulated: 19077000, // số tiền tích lũy
        subAccount: null, // số tài khoản con
        referenceCode: 'MBVCB.3278907687', // mã reference
        description: `Thanh toán đơn hàng DH${orderId}` // nội dung thanh toán
      }

      await dispatch(receivePayment(paymentBody)).unwrap()
      toast.success('Thanh toán thành công!')

      navigate('/cart')
    } catch (error) {
      toast.error('Thanh toán thất bại')
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-6 md:py-8'>
      <nav className='text-xs text-slate-500 mb-4'>
        <Link to='/'>Home</Link>
        <span className='mx-1'>›</span>
        <Link to='/checkout'>Checkout</Link>
        <span className='mx-1'>›</span>
        <span className='text-slate-700'>Payment</span>
      </nav>

      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' onClick={() => navigate('/checkout')} className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Quay lại
        </Button>
        <h1 className='text-2xl font-bold text-slate-900'>Xác nhận thanh toán</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left side - Payment Method */}
        <section className='space-y-6'>
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-800 mb-4'>Phương thức thanh toán</h2>

            <div className='space-y-4'>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'bank_transfer' | 'momo' | 'zalopay')}
              >
                <div className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50'>
                  <RadioGroupItem value='bank_transfer' id='bank_transfer' />
                  <Label htmlFor='bank_transfer' className='flex items-center gap-2 cursor-pointer'>
                    <CreditCard className='h-4 w-4 text-blue-600' />
                    <span>Vietcombank</span>
                  </Label>
                </div>
                <div className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50'>
                  <RadioGroupItem value='momo' id='momo' />
                  <Label htmlFor='momo' className='flex items-center gap-2 cursor-pointer'>
                    <Banknote className='h-4 w-4 text-pink-600' />
                    <span>Ví MoMo</span>
                  </Label>
                </div>
                <div className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50'>
                  <RadioGroupItem value='zalopay' id='zalopay' />
                  <Label htmlFor='zalopay' className='flex items-center gap-2 cursor-pointer'>
                    <CreditCard className='h-4 w-4 text-green-600' />
                    <span>ZaloPay</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h3 className='text-sm font-semibold text-blue-900 mb-2'>Thông tin chuyển khoản</h3>
              <div className='text-sm text-blue-800 space-y-1'>
                <p>
                  <strong>Ngân hàng:</strong> Vietcombank
                </p>
                <p>
                  <strong>Số tài khoản:</strong> 1234567890
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> Công ty ABC
                </p>
                <p>
                  <strong>Nội dung:</strong> DH{orderId}
                </p>
                <p>
                  <strong>Số tiền:</strong> {formatVND(finalTotal)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right side - Order Summary */}
        <aside className='space-y-6'>
          <div className='rounded-xl ring-1 ring-slate-200 bg-white'>
            <div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Thông tin đơn hàng</div>
            <div className='p-4 space-y-4'>
              <div className='space-y-3 max-h-64 overflow-y-auto'>
                {items.map((item) => (
                  <div key={item.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='h-12 w-12 object-contain rounded-md ring-1 ring-slate-200'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-slate-900 truncate'>{item.title}</p>
                      <p className='text-xs text-slate-500'>Số lượng: {item.quantity}</p>
                      <p className='text-xs text-slate-500'>Giá: {formatVND(item.price)}</p>
                    </div>
                    <div className='text-sm font-semibold text-slate-900'>{formatVND(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className='space-y-3 text-sm border-t pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-slate-600'>Tạm tính</span>
                  <span className='font-semibold text-slate-900'>{formatVND(subTotal)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-slate-600'>Phí vận chuyển</span>
                  <span className='font-semibold text-slate-900'>{formatVND(shipping)}</span>
                </div>
                <div className='flex items-center justify-between border-t pt-3'>
                  <span className='text-slate-900 font-semibold'>Tổng cộng</span>
                  <span className='text-lg font-bold text-slate-900'>{formatVND(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-4'>
            <h3 className='text-sm font-semibold text-slate-800 mb-3'>Thông tin người nhận</h3>
            <div className='space-y-2 text-sm text-slate-600'>
              <p>
                <strong>Họ tên:</strong> {receiver.name}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {receiver.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {receiver.address}
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-4'>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className='w-full bg-slate-900 hover:bg-slate-800 text-white'
            >
              {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatVND(finalTotal)}`}
            </Button>
            <p className='text-xs text-slate-500 mt-2 text-center'>
              Bằng cách thanh toán, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
