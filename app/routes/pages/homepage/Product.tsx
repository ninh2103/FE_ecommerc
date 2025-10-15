import { ShoppingCart } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { getProducts } from '~/features/productSlice'
import { useEffect } from 'react'
import type { ProductType } from '~/validateSchema/product.schema'
import { Link } from 'react-router'

export default function ProductSection() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((s: RootState) => s.product.data)
  const isProductLoading = useSelector((s: RootState) => s.product.isLoading)

  useEffect(() => {
    if (!isProductLoading && (!products || products.length === 0)) dispatch(getProducts()).catch(() => {})
  }, [dispatch, isProductLoading, products])
  return (
    <section className='container mx-auto px-4 py-8 md:py-10 lg:py-12'>
      <div className='flex items-center justify-between gap-3 mb-6 md:mb-8'>
        <div className='flex items-baseline gap-3'>
          <h2 className='text-lg md:text-xl font-semibold text-slate-900'>Featured Products</h2>
        </div>
        <Button variant='outline' className='gap-1 text-slate-900'>
          <span>View All</span>
          <span aria-hidden>→</span>
        </Button>
      </div>

      {/* Grid: 4 columns on lg+ */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
        {products.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ProductType }) {
  const priceFmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
  const image = (product.images && product.images[0]) || '/placeholder.png'
  return (
    <div className='group relative bg-white rounded-xl ring-1 ring-slate-100 hover:ring-slate-200 transition-all duration-200 hover:shadow-lg'>
      {/* Product image */}
      <div className='aspect-square p-4'>
        <img
          src={image}
          alt={product.name}
          className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-200'
        />
      </div>

      {/* Product info */}
      <div className='p-4 pt-0'>
        <h3 className='font-medium text-slate-900 text-sm md:text-base line-clamp-2 mb-2'>{product.name}</h3>

        {/* Price (basePrice with optional virtualPrice strike-through) */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-baseline gap-2'>
            <span className='text-lg font-semibold text-slate-900'>
              {priceFmt.format(Number(product.basePrice || 0))}
            </span>
            {product.virtualPrice !== undefined && product.virtualPrice > 0 && (
              <span className='text-sm text-slate-400 line-through'>
                {priceFmt.format(Number(product.virtualPrice))}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        <Link to={`/product/${product.id}`}>
          <Button className='w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-pointer'>
            <ShoppingCart className='h-4 w-4' />
            <span>Add to Cart</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
