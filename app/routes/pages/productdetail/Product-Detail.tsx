import { Heart, Minus, Plus, ShieldCheck, Share2, ShoppingCart, Truck } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '~/store'
import { getProductById, getProducts } from '~/features/productSlice'
import { useEffect, useMemo, useState } from 'react'
import type { ProductType } from '~/validateSchema/product.schema'
import type { CategoryIncludeTranslationType } from '~/validateSchema/category.schema'
import type { SKUType } from '~/validateSchema/sku.schema'
import { AddToCartBodySchema, type AddToCartBodyType } from '~/validateSchema/cart.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addToCart } from '~/features/cartSlice'
import { cn, formatVND, handleErrorApi } from '~/lib/utils'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { PATH } from '~/constant/path'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const productList = useSelector((s: RootState) => s.product.list)
  const productDetails = useSelector((s: RootState) => s.product.details)

  const isProductListLoading = useSelector((s: RootState) => s.product.listLoading)
  const isProductDetailLoading = useSelector((s: RootState) => s.product.detailLoading)

  // Gọi getProductById để lấy dữ liệu chi tiết của sản phẩm hiện tại
  useEffect(() => {
    if (id) {
      const productId = Number(id)
      const existingProductDetail = productDetails[productId]

      // Nếu chưa có product detail thì gọi API
      if (!existingProductDetail) {
        dispatch(getProductById(productId)).catch(() => {})
      }
    }
  }, [dispatch, id, productDetails])

  // Gọi getProducts để có dữ liệu cho Related products (chỉ khi cần)
  useEffect(() => {
    if (!isProductListLoading && productList.data.length === 0) {
      dispatch(getProducts()).catch(() => {})
    }
  }, [dispatch, isProductListLoading, productList.data.length])

  // Lấy product detail từ productDetails state
  const product = id ? productDetails[Number(id)] : null
  const [qty, setQty] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null)
  const priceFmt = useMemo(() => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }), [])
  const mainImage = (product?.images && product.images[0]) || 'https://placehold.co/800x800?text=No+Image'
  const thumbnails = product?.images?.slice(0, 4) || []

  const form = useForm<AddToCartBodyType>({
    resolver: zodResolver(AddToCartBodySchema),
    defaultValues: {
      skuId: 0,
      quantity: 1
    }
  })

  const handleAddToCart = async (body: AddToCartBodyType) => {
    try {
      await dispatch(addToCart(body)).unwrap()
      toast.success('Thêm vào giỏ hàng thành công')
    } catch (error) {
      handleErrorApi<AddToCartBodyType>({
        error: error,
        duration: 4000,
        showToastForFieldError: true
      })
    }
  }

  // Initialize default selections from first option of each variant
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const initial: Record<string, string> = {}
      product.variants.forEach((v) => {
        initial[v.value] = v.options[0]
      })
      setSelectedOptions(initial)
    }
  }, [product?.variants])

  // Compute selectedSkuId whenever selection changes
  useEffect(() => {
    if (!product || !product.skus || !product.variants) return
    const selectedValue = product.variants.map((v) => selectedOptions[v.value]).join('-')
    const matched = product.skus.find((s: SKUType) => s.value === selectedValue)
    setSelectedSkuId(matched ? matched.id : null)
  }, [product, selectedOptions])
  // Show loading state if product detail is loading
  if (isProductDetailLoading && !product) {
    return (
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-slate-500'>Đang tải thông tin sản phẩm...</div>
        </div>
      </div>
    )
  }

  // Show not found if product doesn't exist
  if (!isProductDetailLoading && !product) {
    return (
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-slate-500'>Không tìm thấy sản phẩm</div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-6 md:py-8'>
      {/* Breadcrumbs */}
      <nav className='text-xs text-slate-500 mb-4 cursor-pointer'>
        <Link to={PATH.HOME}>
          <span>Home</span>
        </Link>
        <span className='mx-1'>/</span>
        <span className='text-slate-700'>{product?.name ?? 'Product'}</span>
      </nav>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        {/* Left: Gallery */}
        <section className='lg:col-span-2'>
          <div className='relative rounded-xl ring-1 ring-slate-200 bg-white p-3 lg:p-4'>
            <div className='w-full h-[320px] lg:h-[420px] flex items-center justify-center'>
              <img
                src={mainImage}
                alt={product?.name ?? ''}
                className='max-h-full max-w-full w-auto h-auto object-contain'
              />
            </div>
          </div>
          {thumbnails.length > 0 && (
            <div className='mt-3 flex items-center gap-2'>
              {thumbnails.map((src) => (
                <button
                  key={src}
                  className='h-16 w-16 rounded-md ring-1 ring-slate-200 overflow-hidden bg-white'
                  aria-label='thumbnail'
                >
                  <img src={src} alt='' className='h-full w-full object-cover' />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right: Details */}
        <section className='lg:col-span-3'>
          <h1 className='text-xl md:text-2xl font-extrabold text-slate-900'>{product?.name ?? '—'}</h1>
          <div className='mt-1 flex items-center gap-3 text-xs text-slate-500'>
            <span>Brand: {product?.brand?.name ?? `#${product?.brandId ?? '—'}`}</span>
            {product?.categories && product.categories.length > 0 && (
              <span>
                • Category: {product.categories.map((cat: CategoryIncludeTranslationType) => cat.name).join(', ')}
              </span>
            )}
            {product?.publishAt && <span>• Phát hành: {new Date(product.publishAt).toLocaleDateString('vi-VN')}</span>}
          </div>

          <div className='mt-4 flex items-end gap-3'>
            <span className='text-2xl font-extrabold text-emerald-600'>
              {priceFmt.format(Number(product?.basePrice || 0))}
            </span>
            {product?.virtualPrice ? (
              <span className='text-sm text-slate-400 line-through'>
                {priceFmt.format(Number(product.virtualPrice))}
              </span>
            ) : null}
          </div>

          {/* Variants */}
          {product?.variants && product.variants.length > 0 && (
            <div className='mt-4 space-y-2'>
              {product.variants.map((v) => (
                <div key={v.value} className='flex items-center gap-2'>
                  <span className='text-xs text-slate-500 w-14'>{v.value}:</span>
                  <div className='flex flex-wrap gap-2'>
                    {v.options.map((o) => {
                      const selected = selectedOptions[v.value] === o
                      return (
                        <button
                          key={o}
                          type='button'
                          className={cn(
                            'text-[10px] px-2 py-1 rounded border',
                            selected ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-700 hover:bg-slate-50'
                          )}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [v.value]: o }))}
                        >
                          {o}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {/* Current combination preview */}
              {product?.skus && (
                <div className='text-xs text-slate-600'>
                  Đã Chọn: {product.variants.map((v) => selectedOptions[v.value]).join('-') || '—'}
                </div>
              )}
            </div>
          )}

          {/* Removed SKU selector; using first available SKU automatically */}

          {/* Quantity + actions */}
          <div className='mt-4 flex items-center gap-3'>
            <div className='inline-flex items-center rounded border overflow-hidden'>
              <button
                className='px-3 py-2 hover:bg-slate-50'
                aria-label='decrease'
                title='Giảm số lượng'
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className='h-4 w-4' />
              </button>
              <input className='w-12 text-center text-sm py-2 outline-none' value={qty} readOnly placeholder='1' />
              <button
                className='px-3 py-2 hover:bg-slate-50'
                aria-label='increase'
                title='Tăng số lượng'
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className='h-4 w-4' />
              </button>
            </div>
            <Link to='/cart'>
              <Button
                className='gap-2 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                disabled={!selectedSkuId}
                onClick={() => selectedSkuId && handleAddToCart({ skuId: selectedSkuId, quantity: qty })}
              >
                <ShoppingCart className='h-4 w-4' />
                Add to cart
              </Button>
            </Link>
          </div>

          {/* Info rows */}
          <div className='mt-4 space-y-2 text-xs'>
            <div className='flex items-start gap-2 rounded border p-2'>
              <ShieldCheck className='h-4 w-4 text-slate-700 mt-0.5' />
              <p className='text-slate-600'>
                Payment upon receipt of goods, Google Pay, credit cards. 3% discount in case of prepayment.
              </p>
            </div>
            <div className='flex items-start gap-2 rounded border p-2'>
              <Truck className='h-4 w-4 text-slate-700 mt-0.5' />
              <p className='text-slate-600'>Free return of this product if proper quality within 30 days.</p>
            </div>
          </div>

          {/* secondary actions */}
          <div className='mt-3 flex items-center gap-4 text-xs text-slate-600'>
            <button className='inline-flex items-center gap-1 hover:text-slate-900'>
              <Heart className='h-4 w-4' /> Add to wishlist
            </button>
            <button className='inline-flex items-center gap-1 hover:text-slate-900'>
              <Share2 className='h-4 w-4' /> Share this product
            </button>
            <button className='inline-flex items-center gap-1 hover:text-slate-900'>Compare</button>
          </div>
        </section>
      </div>

      {/* Tabs */}
      <div className='mt-8 rounded-xl ring-1 ring-slate-200 bg-white'>
        <div className='flex border-b text-sm'>
          <button className='px-4 py-3 font-medium text-slate-900 border-b-2 border-slate-900'>Mô tả sản phẩm</button>
        </div>

        <div className='p-6 text-sm text-slate-700 leading-relaxed space-y-4'>
          {/* Product Basic Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg'>
            <div>
              <p>
                <span className='font-semibold text-slate-900'>Tên sản phẩm:</span> {product?.name ?? '—'}
              </p>
              <p>
                <span className='font-semibold text-slate-900'>Thương hiệu:</span>{' '}
                {product?.brand?.translations?.find((t) => t.languageId === 'vi')?.name ??
                  product?.brand?.name ??
                  `#${product?.brandId ?? '—'}`}
              </p>
            </div>
            <div>
              {product?.categories && product.categories.length > 0 && (
                <p>
                  <span className='font-semibold text-slate-900'>Danh mục:</span>{' '}
                  {product.categories
                    .map(
                      (cat: CategoryIncludeTranslationType) =>
                        cat.translations?.find((t) => t.languageId === 'vi')?.name ?? cat.name
                    )
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {product?.publishAt && (
                <p>
                  <span className='font-semibold text-slate-900'>Ngày phát hành:</span>{' '}
                  {new Date(product.publishAt).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-slate-900 text-base'>Mô tả sản phẩm</h3>
            <div className='text-slate-600 leading-relaxed'>
              {product?.translations?.find((t) => t.languageId === 'vi')?.description ? (
                <p>{product.translations.find((t) => t.languageId === 'vi')?.description}</p>
              ) : (
                <p>
                  Sản phẩm <span className='font-medium'>{product?.name ?? 'này'}</span> là lựa chọn tuyệt vời dành cho
                  những ai đang tìm kiếm sự cân bằng giữa <span className='font-medium text-slate-900'>chất lượng</span>{' '}
                  và <span className='font-medium text-slate-900'>giá thành hợp lý</span>. Được thiết kế với độ hoàn
                  thiện cao, sản phẩm mang lại trải nghiệm sử dụng bền bỉ, hiện đại và đáp ứng tốt nhu cầu hàng ngày của
                  người dùng.
                </p>
              )}
            </div>
          </div>

          {/* Product Variants & SKUs */}
          {product?.variants && product.variants.length > 0 && (
            <div className='space-y-3'>
              <h3 className='font-semibold text-slate-900 text-base'>Thông số kỹ thuật</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {product.variants.map((variant) => (
                  <div key={variant.value} className='p-3 bg-slate-50 rounded-lg'>
                    <p className='font-medium text-slate-900 mb-2 capitalize'>{variant.value}:</p>
                    <div className='flex flex-wrap gap-2'>
                      {variant.options.map((option) => (
                        <span
                          key={option}
                          className='px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700'
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available SKUs */}
          {product?.skus && product.skus.length > 0 && (
            <div className='space-y-3'>
              <h3 className='font-semibold text-slate-900 text-base'>Các phiên bản có sẵn</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                {product.skus.slice(0, 6).map((sku: SKUType) => (
                  <div key={sku.id} className='p-3 border border-slate-200 rounded-lg'>
                    <p className='font-medium text-slate-900 text-xs mb-1'>{sku.value}</p>
                    <p className='text-slate-600 text-xs'>
                      Giá: <span className='font-medium'>{priceFmt.format(sku.price || product?.basePrice || 0)}</span>
                    </p>
                    <p className='text-slate-600 text-xs'>
                      Tồn kho: <span className='font-medium'>{sku.stock || 0} sản phẩm</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Features */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-slate-900 text-base'>Đặc điểm nổi bật</h3>
            <ul className='list-disc list-inside text-slate-600 space-y-2'>
              <li>Thiết kế tinh tế, phù hợp với nhiều không gian sử dụng</li>
              <li>Chất liệu cao cấp, đảm bảo độ bền và an toàn khi sử dụng</li>
              <li>Dễ dàng vệ sinh và bảo quản trong quá trình sử dụng</li>
              <li>Bảo hành chính hãng theo quy định của nhà sản xuất</li>
              {product?.brand?.name && <li>Được sản xuất bởi thương hiệu uy tín {product.brand.name}</li>}
            </ul>
          </div>

          {/* Pricing Information */}

          {/* Conclusion */}
          <div className='text-slate-600 leading-relaxed'>
            <p>
              Đây là một sản phẩm đáng cân nhắc cho những ai mong muốn nâng cao trải nghiệm sống hằng ngày, mang lại sự
              tiện nghi và phong cách cho không gian của bạn. Với chất lượng đảm bảo và giá thành hợp lý, sản phẩm này
              sẽ là lựa chọn lý tưởng cho nhu cầu sử dụng của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Related products */}
      <section className='mt-8'>
        <h2 className='text-lg md:text-xl font-semibold text-slate-900 mb-3'>Related products</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
          {productList.data
            .filter((p) => p.id !== Number(id)) // Loại bỏ sản phẩm hiện tại
            .slice(0, 6) // Chỉ hiển thị 6 sản phẩm
            .map((p) => (
              <RelatedCard key={p.id} p={p as ProductType} />
            ))}
        </div>
      </section>
    </div>
  )
}

function RelatedCard({ p }: { p: ProductType }) {
  return (
    <div className='group relative bg-white rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 transition-all'>
      <div className='absolute top-2 left-2 z-10'></div>
      <div className='aspect-square p-3'>
        <img
          src={p.images[0]}
          alt=''
          className='w-full h-full object-contain group-hover:scale-105 transition-transform'
        />
      </div>
      <div className='px-3 pb-3'>
        <h3 className='text-[12px] font-medium text-slate-900 line-clamp-2 h-8'>{p.name}</h3>
        <div className='mt-1 flex items-center justify-between'>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-[14px] font-semibold text-slate-900'>{formatVND(p.basePrice)}</span>
            <span className='text-[11px] text-slate-400 line-through'>{formatVND(p.virtualPrice)}</span>
          </div>
          <Link to={`/product/${p.id}`}>
            <Button className='h-8 px-3 gap-1 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'>
              <span className='text-[11px]'>View</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
