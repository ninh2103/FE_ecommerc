import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Label } from '../../../components/ui/label'
import type { AppDispatch, RootState } from '~/store'
import { getCart, deleteFromCart } from '~/features/cartSlice'
import { orderApi } from '~/apiRequest/order'
import { formatVND } from '~/lib/utils'
import { toast } from 'sonner'
import { CreditCard, Banknote } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'

type ReceiverForm = {
  name: string
  phone: string
  address: string
  paymentMethod: 'cash' | 'online'
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.cart)
  const isCartLoading = useSelector((s: RootState) => s.cart.isLoading)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get selected cart item IDs from navigation state
  const selectedCartItemIds = location.state?.cartItemIds as number[] | undefined
  const shopId = location.state?.shopId as number | undefined

  const form = useForm<ReceiverForm>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'cash'
    }
  })

  useEffect(() => {
    if (!isCartLoading && cart === null) {
      dispatch(getCart()).catch(() => {})
    }
  }, [dispatch, isCartLoading, cart])

  // Redirect if no selected items
  useEffect(() => {
    if (!selectedCartItemIds || selectedCartItemIds.length === 0) {
      navigate('/cart')
    }
  }, [selectedCartItemIds, navigate])

  const items = useMemo(() => {
    return (
      cart?.flatMap((group) =>
        group.cartItems
          .filter((ci) => selectedCartItemIds?.includes(ci.id))
          .map((ci) => ({
            id: ci.id,
            skuId: ci.skuId,
            title: ci.sku.product.translations?.[0]?.name || ci.sku.product.name,
            price: ci.sku.price ?? ci.sku.product.basePrice,
            quantity: ci.quantity,
            image: ci.sku.image || ci.sku.product.images?.[0] || 'https://placehold.co/128x128?text=No+Image',
            shopId: group.shop.id
          }))
      ) || []
    )
  }, [cart, selectedCartItemIds])

  // Debug log to verify data flow

  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = items.length ? 30000 : 0
  const total = subTotal + shipping

  const onSubmit = async (data: ReceiverForm) => {
    if (!selectedCartItemIds || selectedCartItemIds.length === 0) return

    setIsSubmitting(true)
    try {
      // Tạo đơn hàng trước
      const orderResponse = await orderApi.createOrder([
        {
          shopId: shopId || null,
          cartItemsIds: selectedCartItemIds,
          receiver: {
            name: data.name,
            phone: data.phone,
            address: data.address
          }
        }
      ])

      // Lấy order ID từ response (giả sử response có structure như vậy)
      const orderId = orderResponse.orders[0].id // Fallback nếu không có ID

      // Nếu thanh toán online, chuyển đến trang payment
      if (data.paymentMethod === 'online') {
        // Chuyển đến trang payment với thông tin order
        navigate('/payment', {
          state: {
            orderId,
            total,
            receiver: {
              name: data.name,
              phone: data.phone,
              address: data.address
            },
            items: items.map((item) => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            }))
          }
        })
        return
      } else {
        // Thanh toán tiền mặt - hoàn thành đơn hàng
        toast.success('Order created successfully!')

        //Clear selected items from cart after successful order
        if (selectedCartItemIds && selectedCartItemIds.length > 0) {
          dispatch(deleteFromCart({ cartItemIds: selectedCartItemIds })).catch(() => {})
        }
        navigate('/cart')
      }
    } catch (error) {
      toast.error('Failed to create order')
      console.error('Order creation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedCartItemIds || selectedCartItemIds.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center justify-center py-16'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-slate-900 mb-2'>No items selected</h2>
            <p className='text-slate-600 mb-6'>Please go back to your cart and select items to checkout.</p>
            <Button onClick={() => navigate('/cart')} className='bg-slate-900 hover:bg-slate-800 text-white'>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isCartLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center py-16'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4'></div>
            <p className='text-slate-600'>Loading cart items...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <nav className='text-xs text-slate-500 mb-6'>
        <span className='text-slate-700'>Checkout</span>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left side - Customer Information */}
        <section className='space-y-6'>
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-800 mb-4'>Thông tin người nhận</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập họ và tên' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Please enter a valid phone number (10-11 digits)'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập số điện thoại' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address'
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập địa chỉ nhận hàng' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method Selection */}
                <div className='space-y-3'>
                  <Label className='text-sm font-medium text-slate-700'>Phương thức thanh toán</Label>
                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value} className='space-y-3'>
                            <div className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50'>
                              <RadioGroupItem value='cash' id='cash' />
                              <Label htmlFor='cash' className='flex items-center gap-2 cursor-pointer'>
                                <Banknote className='h-4 w-4 text-green-600' />
                                <span>Thanh toán khi nhận hàng</span>
                              </Label>
                            </div>
                            <div className='flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50'>
                              <RadioGroupItem value='online' id='online' />
                              <Label htmlFor='online' className='flex items-center gap-2 cursor-pointer'>
                                <CreditCard className='h-4 w-4 text-blue-600' />
                                <span>Thanh toán online</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full bg-slate-900 hover:bg-slate-800 text-white'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              </form>
            </Form>
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
                  <span className='text-lg font-bold text-slate-900'>{formatVND(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
