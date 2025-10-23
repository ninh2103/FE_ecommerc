import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { getOrderDetail } from '~/features/orderSlice'
import { formatVND } from '~/lib/utils'
import { Badge } from '../../../components/ui/badge'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  User,
  CreditCard,
  ShoppingBag
} from 'lucide-react'

const statusConfig = {
  PENDING_PAYMENT: {
    label: 'Chờ thanh toán',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Đơn hàng đang chờ thanh toán'
  },
  PENDING_PICKUP: {
    label: 'Chờ lấy hàng',
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
    description: 'Đơn hàng đang chờ shop lấy hàng'
  },
  PENDING_DELIVERY: {
    label: 'Đang giao hàng',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    description: 'Đơn hàng đang được giao'
  },
  DELIVERED: {
    label: 'Đã giao hàng',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Đơn hàng đã được giao thành công'
  },
  RETURNED: {
    label: 'Đã trả hàng',
    color: 'bg-orange-100 text-orange-800',
    icon: RotateCcw,
    description: 'Đơn hàng đã được trả lại'
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    description: 'Đơn hàng đã bị hủy'
  }
}

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const order = useSelector((state: RootState) => state.order.order)
  const isLoading = useSelector((state: RootState) => state.order.isLoading)

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetail(Number(orderId))).catch(() => {})
    }
  }, [dispatch, orderId])

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900'></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <Package className='h-12 w-12 text-slate-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-900 mb-2'>Không tìm thấy đơn hàng</h3>
          <p className='text-slate-600 mb-4'>Đơn hàng không tồn tại hoặc đã bị xóa</p>
          <Button onClick={() => navigate('/orders')} className='bg-slate-900 hover:bg-slate-800 text-white'>
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING_PAYMENT
  const StatusIcon = statusInfo.icon
  const totalAmount = order.snapshots.reduce((sum, item) => sum + item.skuPrice * item.quantity, 0)

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='container mx-auto px-4 py-6 md:py-8'>
      {/* Breadcrumbs */}
      <nav className='text-xs text-slate-500 mb-4'>
        <Link to='/'>Home</Link>
        <span className='mx-1'>›</span>
        <Link to='/orders'>Đơn hàng của tôi</Link>
        <span className='mx-1'>›</span>
        <span className='text-slate-700'>Chi tiết đơn hàng #{order.id}</span>
      </nav>

      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' onClick={() => navigate('/orders')} className='flex items-center gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Quay lại
        </Button>
        <h1 className='text-2xl font-bold text-slate-900'>Chi tiết đơn hàng #{order.id}</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Order Status */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <StatusIcon className='h-6 w-6 text-slate-600' />
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Trạng thái đơn hàng</h2>
                <p className='text-sm text-slate-600'>{statusInfo.description}</p>
              </div>
            </div>
            <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>{statusInfo.label}</Badge>
          </div>

          {/* Order Items */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Sản phẩm đã đặt</h2>
            <div className='space-y-4'>
              {order.snapshots.map((item, index) => (
                <div key={index} className='flex items-center gap-4 p-4 rounded-lg bg-slate-50'>
                  <img
                    src={item.image || 'https://placehold.co/80x80?text=No+Image'}
                    alt={item.productName}
                    className='h-16 w-16 object-contain rounded-md ring-1 ring-slate-200'
                  />
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-base font-medium text-slate-900 mb-1'>{item.productName}</h3>
                    <p className='text-sm text-slate-600 mb-2'>{item.skuValue}</p>
                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                      <span>Số lượng: {item.quantity}</span>
                      <span>Giá: {formatVND(item.skuPrice)}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-semibold text-slate-900'>
                      {formatVND(item.skuPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Lịch sử đơn hàng</h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
                  <CheckCircle className='h-4 w-4 text-green-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-slate-900'>Đơn hàng được tạo</p>
                  <p className='text-xs text-slate-500'>{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.status !== 'PENDING_PAYMENT' && (
                <div className='flex items-center gap-3'>
                  <div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    <CreditCard className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-slate-900'>Đã thanh toán</p>
                    <p className='text-xs text-slate-500'>Thanh toán thành công</p>
                  </div>
                </div>
              )}

              {order.status === 'DELIVERED' && (
                <div className='flex items-center gap-3'>
                  <div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
                    <Truck className='h-4 w-4 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-slate-900'>Đã giao hàng</p>
                    <p className='text-xs text-slate-500'>Giao hàng thành công</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Order Summary */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Tóm tắt đơn hàng</h2>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Tạm tính:</span>
                <span className='font-medium'>{formatVND(totalAmount)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-slate-600'>Phí vận chuyển:</span>
                <span className='font-medium'>Miễn phí</span>
              </div>
              <div className='border-t pt-3'>
                <div className='flex justify-between'>
                  <span className='font-semibold text-slate-900'>Tổng cộng:</span>
                  <span className='text-lg font-bold text-slate-900'>{formatVND(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receiver Information */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Thông tin người nhận</h2>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-slate-500' />
                <span className='text-sm text-slate-900'>{order.receiver.name}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-slate-500' />
                <span className='text-sm text-slate-900'>{order.receiver.phone}</span>
              </div>
              <div className='flex items-start gap-2'>
                <MapPin className='h-4 w-4 text-slate-500 mt-0.5' />
                <span className='text-sm text-slate-900'>{order.receiver.address}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-slate-900 mb-4'>Thao tác</h2>
            <div className='space-y-3'>
              {order.status === 'PENDING_PAYMENT' && (
                <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white'>Thanh toán ngay</Button>
              )}
              {order.status === 'DELIVERED' && (
                <Button variant='outline' className='w-full'>
                  Mua lại
                </Button>
              )}
              {(order.status === 'PENDING_PAYMENT' || order.status === 'PENDING_PICKUP') && (
                <Button variant='outline' className='w-full text-red-600 hover:bg-red-50'>
                  Hủy đơn hàng
                </Button>
              )}
              <Button variant='outline' className='w-full'>
                Liên hệ hỗ trợ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
