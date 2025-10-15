import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { deleteFromCart, getCart, updateCart } from '~/features/cartSlice'
import { formatVND } from '~/lib/utils'

type UIItem = {
  id: number
  skuId: number
  title: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.cart)
  const isCartLoading = useSelector((s: RootState) => s.cart.isLoading)
  useEffect(() => {
    if (!isCartLoading && (!cart || cart.length === 0)) {
      dispatch(getCart()).catch(() => {})
    }
  }, [dispatch, isCartLoading, cart])

  const items = useMemo<UIItem[]>(() => {
    if (!cart) return []
    return cart.flatMap((group) =>
      group.cartItems.map((ci) => ({
        id: ci.id,
        skuId: ci.skuId,
        title: ci.sku.product.translations?.[0]?.name || ci.sku.product.name,
        price: ci.sku.price ?? ci.sku.product.basePrice,
        quantity: ci.quantity,
        image: ci.sku.image || ci.sku.product.images?.[0] || 'https://placehold.co/128x128?text=No+Image'
      }))
    )
  }, [cart])

  const subTotal = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const shipping = items.length ? 0 : 0
  const total = subTotal + shipping

  function updateQty(item: UIItem, delta: number) {
    const nextQty = Math.max(1, item.quantity + delta)
    dispatch(updateCart({ skuId: item.skuId, quantity: nextQty })).catch(() => {})
  }
  function removeItem(id: number) {
    dispatch(deleteFromCart({ cartItemIds: [id] })).catch(() => {})
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <nav className='text-xs text-slate-500 mb-6'>
        <Link to='/'>Home</Link>
        <span className='mx-1'>/</span>
        <span className='text-slate-700'>Cart</span>
      </nav>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-6'>
          <section className='rounded-xl ring-1 ring-slate-200 bg-white'>
            <div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Shopping Cart</div>
            <div className='divide-y'>
              {items.map((it) => (
                <div key={it.id} className='p-4 flex items-center gap-3'>
                  <img src={it.image} alt='' className='h-16 w-16 object-contain rounded-md ring-1 ring-slate-200' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-slate-900 truncate'>{it.title}</p>
                    <p className='text-xs text-slate-500'>{formatVND(it.price)}</p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='inline-flex items-center rounded border overflow-hidden'>
                      <button
                        onClick={() => updateQty(it, -1)}
                        className='px-2 py-1.5 hover:bg-slate-50'
                        aria-label='Decrease quantity'
                        title='Decrease quantity'
                      >
                        <Minus className='h-4 w-4' />
                      </button>
                      <span className='w-10 text-center text-sm'>{it.quantity}</span>
                      <button
                        onClick={() => updateQty(it, 1)}
                        className='px-2 py-1.5 hover:bg-slate-50'
                        aria-label='Increase quantity'
                        title='Increase quantity'
                      >
                        <Plus className='h-4 w-4' />
                      </button>
                    </div>
                    <div className='w-20 text-right text-sm font-semibold text-slate-900'>
                      {formatVND(it.price * it.quantity)}
                    </div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className='text-slate-500 hover:text-rose-600 p-1 rounded'
                      aria-label='Remove item'
                      title='Remove item'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className='p-4 flex items-center justify-between border-t'>
              <Link to='/products'>
                <Button variant='outline' className='text-slate-900'>
                  Continue shopping
                </Button>
              </Link>
              <Button
                variant='ghost'
                className='text-rose-600 hover:bg-rose-50'
                onClick={() =>
                  items.length && dispatch(deleteFromCart({ cartItemIds: items.map((i) => i.id) })).catch(() => {})
                }
              >
                Clear cart
              </Button>
            </div>
          </section>

          <aside className='rounded-xl ring-1 ring-slate-200 bg-white h-max'>
            <div className='px-4 py-3 border-b text-sm font-semibold text-slate-800'>Order Summary</div>
            <div className='p-4 space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Subtotal</span>
                <span className='font-semibold text-slate-900'>{formatVND(subTotal)}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-slate-600'>Shipping</span>
                <span className='font-semibold text-slate-900'>{formatVND(shipping)}</span>
              </div>
              <div className='flex items-center justify-between border-t pt-3'>
                <span className='text-slate-900 font-semibold'>Total</span>
                <span className='text-lg font-bold text-slate-900'>{formatVND(total)}</span>
              </div>
              <Button className='w-full bg-slate-900 hover:bg-slate-800 text-white'>Proceed to Checkout</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function EmptyCart() {
  return (
    <div className='flex flex-col items-center justify-center py-16'>
      <img src='https://illustrations.popsy.co/amber/empty-box-open.svg' alt='Empty cart' className='h-40 md:h-56' />
      <div className='mt-4 w-full max-w-md border rounded-md px-4 py-2 text-center text-[12px] font-semibold text-rose-600'>
        YOUR CART IS CURRENTLY EMPTY.
      </div>
      <Link to='/products' className='mt-4'>
        <Button className='bg-slate-900 hover:bg-slate-800 text-white px-6'>Return to shop</Button>
      </Link>
    </div>
  )
}
