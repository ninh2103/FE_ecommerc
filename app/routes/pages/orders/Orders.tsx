import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { getOrderList } from '~/features/orderSlice'
import { formatVND } from '~/lib/utils'
import { Badge } from '../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Calendar,
  MapPin,
  Phone,
  User
} from 'lucide-react'
import { OrderStatus } from '~/lib/type'

type OrderStatusType =
  | 'all'
  | 'pending_payment'
  | 'pending_pickup'
  | 'pending_delivery'
  | 'delivered'
  | 'returned'
  | 'cancelled'

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

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const orders = useSelector((state: RootState) => state.order.orders)
  const isLoading = useSelector((state: RootState) => state.order.isLoading)
  const [activeTab, setActiveTab] = useState<OrderStatusType>('all')

  useEffect(() => {
    dispatch(getOrderList()).catch(() => {})
  }, [dispatch])

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true
    return order.status === activeTab.toUpperCase()
  })

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_PAYMENT
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
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
        <span className='text-slate-700'>Đơn hàng của tôi</span>
      </nav>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900 mb-2'>Đơn hàng của tôi</h1>
        <p className='text-slate-600'>Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as OrderStatusType)}>
        <TabsList className='grid w-full grid-cols-7 mb-6'>
          <TabsTrigger value='all'>Tất cả</TabsTrigger>
          <TabsTrigger value='pending_payment'>Chờ thanh toán</TabsTrigger>
          <TabsTrigger value='pending_pickup'>Chờ lấy hàng</TabsTrigger>
          <TabsTrigger value='pending_delivery'>Đang giao</TabsTrigger>
          <TabsTrigger value='delivered'>Đã giao</TabsTrigger>
          <TabsTrigger value='returned'>Trả hàng</TabsTrigger>
          <TabsTrigger value='cancelled'>Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='space-y-4'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900'></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className='text-center py-12'>
              <Package className='h-12 w-12 text-slate-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-slate-900 mb-2'>Không có đơn hàng</h3>
              <p className='text-slate-600 mb-4'>Bạn chưa có đơn hàng nào trong trạng thái này</p>
              <Link to='/products'>
                <Button className='bg-slate-900 hover:bg-slate-800 text-white'>Mua sắm ngay</Button>
              </Link>
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusConfig(order.status)
                const StatusIcon = statusInfo.icon
                const totalAmount = order.snapshots.reduce((sum, item) => sum + item.skuPrice * item.quantity, 0)

                return (
                  <div key={order.id} className='rounded-xl ring-1 ring-slate-200 bg-white p-6'>
                    {/* Order Header */}
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                          <StatusIcon className='h-5 w-5 text-slate-600' />
                          <span className='text-sm font-medium text-slate-900'>Đơn hàng #{order.id}</span>
                        </div>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-slate-500'>{formatDate(order.createdAt)}</span>
                        <Link to={`/orders/${order.id}`}>
                          <Button variant='outline' size='sm'>
                            <Eye className='h-4 w-4 mr-1' />
                            Chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className='space-y-3 mb-4'>
                      {order.snapshots.map((item, index) => (
                        <div key={index} className='flex items-center gap-3 p-3 rounded-lg bg-slate-50'>
                          <img
                            src={item.image || 'https://placehold.co/64x64?text=No+Image'}
                            alt={item.productName}
                            className='h-12 w-12 object-contain rounded-md ring-1 ring-slate-200'
                          />
                          <div className='flex-1 min-w-0'>
                            <h4 className='text-sm font-medium text-slate-900 truncate'>{item.productName}</h4>
                            <p className='text-xs text-slate-500'>
                              {item.skuValue} • Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className='text-sm font-semibold text-slate-900'>
                            {formatVND(item.skuPrice * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className='flex items-center justify-between pt-4 border-t'>
                      <div className='flex items-center gap-4 text-sm text-slate-600'>
                        <div className='flex items-center gap-1'>
                          <Package className='h-4 w-4' />
                          <span>{order.snapshots.length} sản phẩm</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <span>Tổng cộng:</span>
                          <span className='font-semibold text-slate-900 text-lg'>{formatVND(totalAmount)}</span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        {order.status === 'PENDING_PAYMENT' && (
                          <Button className='bg-blue-600 hover:bg-blue-700 text-white'>Thanh toán ngay</Button>
                        )}
                        {order.status === 'DELIVERED' && <Button variant='outline'>Mua lại</Button>}
                        {(order.status === 'PENDING_PAYMENT' || order.status === 'PENDING_PICKUP') && (
                          <Button variant='outline' className='text-red-600 hover:bg-red-50'>
                            Hủy đơn hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
