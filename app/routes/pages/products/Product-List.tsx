import { Filter, Grid3X3, Heart, List, ShoppingCart, Star, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'
import { getProducts } from '../../../features/productSlice'
import { getBrand } from '../../../features/brandSlice'
import { getCategory } from '../../../features/categorySlice'
import type { GetProductsQueryType, GetProductsResType, ProductType } from '../../../validateSchema/product.schema'
import { ProductOrderBy, ProductSortBy } from '../../../lib/type'
import AutoPagination from '~/components/auto-pagination'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { formatVND } from '~/lib/utils'

export default function ProductListPage() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: products, isLoading, totalItems, page, limit, totalPages } = useSelector((state: any) => state.product)

  // Initialize filters from URL params
  const [filters, setFilters] = useState<GetProductsQueryType>(() => {
    const params = Object.fromEntries(searchParams.entries())
    return {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 20,
      orderBy: (params.orderBy as any) || ProductOrderBy.DESC,
      sortBy: (params.sortBy as any) || ProductSortBy.CREATED_AT,
      brandId: params.brandId ? params.brandId.split(',').map(Number) : undefined,
      categories: params.categories ? params.categories.split(',').map(Number) : undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined
    }
  })

  useEffect(() => {
    dispatch(getProducts(filters) as any)
    dispatch(getBrand() as any)
    dispatch(getCategory() as any)
  }, [dispatch, filters])

  const handleFilterChange = (newFilters: Partial<GetProductsQueryType>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          newSearchParams.set(key, value.join(','))
        } else if (!Array.isArray(value)) {
          newSearchParams.set(key, String(value))
        }
      }
    })
    setSearchParams(newSearchParams)
  }

  const clearAllFilters = () => {
    const defaultFilters = {
      page: 1,
      limit: 20,
      orderBy: ProductOrderBy.DESC,
      sortBy: ProductSortBy.CREATED_AT
    }
    setFilters(defaultFilters)
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className='container mx-auto px-4 py-6 md:py-8'>
      {/* Breadcrumbs */}
      <nav className='text-xs text-slate-500 mb-3'>
        <Link to='/'>Home</Link>
        <span className='mx-1'>/</span>
        <Link to='/products' className='hover:text-slate-700'>
          Product List
        </Link>
        <span className='mx-1'>/</span>
        <span className='text-slate-700'>Product List</span>
      </nav>

      {/* Title + badge + description */}
      <div className='mb-4'>
        <h1 className='mt-2 text-xl md:text-2xl font-extrabold text-slate-900 leading-snug'>
          Grocery store with different
          <br className='hidden sm:block' /> treasures
        </h1>
        <p className='mt-1 text-xs md:text-sm text-slate-500 max-w-2xl'>
          We have prepared special discounts for you on grocery products...
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Sidebar filters */}
        <aside className='space-y-6'>
          {/* Clear All Filters Button */}
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-slate-800'>Filters</h3>
            <Button
              variant='outline'
              size='sm'
              onClick={clearAllFilters}
              className='text-xs text-slate-600 hover:text-slate-800'
            >
              <X className='h-3 w-3 mr-1' />
              Clear All
            </Button>
          </div>

          <PriceFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={(minPrice, maxPrice) => handleFilterChange({ minPrice, maxPrice })}
          />
          <CategoryFilter
            categories={filters.categories}
            onChange={(categories) => handleFilterChange({ categories })}
          />
          <BrandFilter brands={filters.brandId} onChange={(brandId) => handleFilterChange({ brandId })} />
        </aside>

        <section>
          {/* Toolbar */}
          <div className='flex items-center justify-between gap-3 border rounded-lg px-3 py-2 text-xs text-slate-500'>
            <div>Showing {totalItems} results</div>
            <div className='flex items-center gap-2'>
              <span>Sort:</span>
              <select
                value={`${filters.sortBy}-${filters.orderBy}`}
                onChange={(e) => {
                  const [sortBy, orderBy] = e.target.value.split('-')
                  handleFilterChange({ sortBy: sortBy as any, orderBy: orderBy as any })
                }}
                className='px-2 py-1 rounded border hover:bg-slate-50 text-slate-700 bg-white'
                aria-label='Sort products'
              >
                <option value={`${ProductSortBy.CREATED_AT}-${ProductOrderBy.DESC}`}>Latest</option>
                <option value={`${ProductSortBy.CREATED_AT}-${ProductOrderBy.ASC}`}>Oldest</option>
                <option value={`${ProductSortBy.PRICE}-${ProductOrderBy.ASC}`}>Price: Low to High</option>
                <option value={`${ProductSortBy.PRICE}-${ProductOrderBy.DESC}`}>Price: High to Low</option>
                <option value={`${ProductSortBy.SALE}-${ProductOrderBy.DESC}`}>Best Selling</option>
              </select>
              <span className='hidden sm:inline'>Show:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange({ limit: Number(e.target.value) })}
                className='hidden sm:inline-flex px-2 py-1 rounded border hover:bg-slate-50 text-slate-700 bg-white'
                aria-label='Items per page'
              >
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
              </select>
              <div className='flex items-center rounded border overflow-hidden'>
                <button className='px-2 py-1 text-slate-700 hover:bg-slate-50' aria-label='Grid view'>
                  <Grid3X3 className='h-4 w-4' />
                </button>
                <button className='px-2 py-1 text-slate-500 hover:bg-slate-50' aria-label='List view'>
                  <List className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Grid products */}
          {isLoading ? (
            <div className='mt-4 flex justify-center items-center h-64'>
              <LoadingSpinner size='lg' />
            </div>
          ) : (
            <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className='flex items-center justify-end space-x-2 py-4'>
            <AutoPagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={limit}
              pathname='/products'
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function PriceFilter({
  minPrice,
  maxPrice,
  onChange
}: {
  minPrice?: number
  maxPrice?: number
  onChange: (minPrice?: number, maxPrice?: number) => void
}) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || 1)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || 1000)

  // Reset local state when props change (e.g., when clear all filters is clicked)
  useEffect(() => {
    setLocalMinPrice(minPrice || 1)
    setLocalMaxPrice(maxPrice || 1000)
  }, [minPrice, maxPrice])

  const handleApply = () => {
    onChange(localMinPrice, localMaxPrice)
  }

  return (
    <div className='rounded-lg border p-3'>
      <div className='text-xs font-semibold text-slate-800 mb-2'>Price Filter</div>
      <div className='flex items-center gap-2 text-[11px] text-slate-500'>
        <div className='flex-1'>
          <label className='block'>Min price</label>
          <input
            type='number'
            min={minPrice || 1}
            max={maxPrice || 1000}
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(Number(e.target.value))}
            className='w-full px-2 py-1 border rounded text-xs'
            aria-label='Minimum price'
          />
        </div>
        <div className='flex-1'>
          <label className='block'>Max price</label>
          <input
            type='number'
            min={0}
            max={1000}
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
            className='w-full px-2 py-1 border rounded text-xs'
            aria-label='Maximum price'
          />
        </div>
      </div>
      <div className='mt-2 text-xs text-slate-500'>
        Price: {formatVND(localMinPrice)} - {formatVND(localMaxPrice)}
      </div>
      <Button variant='outline' className='mt-3 w-full text-slate-700 gap-1' onClick={handleApply}>
        <Filter className='h-4 w-4' />
        Filter
      </Button>
    </div>
  )
}

function CategoryFilter({
  categories,
  onChange
}: {
  categories?: number[]
  onChange: (categories?: number[]) => void
}) {
  const { data: categoryData } = useSelector((state: any) => state.category)

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const currentCategories = categories || []
    if (checked) {
      onChange([...currentCategories, categoryId])
    } else {
      onChange(currentCategories.filter((id) => id !== categoryId))
    }
  }

  return (
    <div className='rounded-lg border p-3'>
      <div className='text-xs font-semibold text-slate-800 mb-2'>Product Categories</div>
      <ul className='space-y-1.5'>
        {categoryData?.map((category: any) => (
          <li key={category.id} className='flex items-center gap-2 text-xs text-slate-600'>
            <input
              type='checkbox'
              className='h-3.5 w-3.5 accent-slate-900'
              checked={categories?.includes(category.id) || false}
              onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
              aria-label={`Filter by ${category.translations?.[0]?.name || category.name}`}
            />
            <span className='truncate'>{category.translations?.[0]?.name || category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BrandFilter({ brands, onChange }: { brands?: number[]; onChange: (brands?: number[]) => void }) {
  const { data: brandData } = useSelector((state: any) => state.brand)

  const handleBrandChange = (brandId: number, checked: boolean) => {
    const currentBrands = brands || []
    if (checked) {
      onChange([...currentBrands, brandId])
    } else {
      onChange(currentBrands.filter((id) => id !== brandId))
    }
  }

  return (
    <div className='rounded-lg border p-3'>
      <div className='text-xs font-semibold text-slate-800 mb-2'>Filter by Brands</div>
      <div className='space-y-1.5'>
        {brandData?.map((brand: any) => (
          <label key={brand.id} className='flex items-center gap-2 text-xs text-slate-600'>
            <input
              type='checkbox'
              className='h-3.5 w-3.5 accent-slate-900'
              checked={brands?.includes(brand.id) || false}
              onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
            />
            <span>{brand.translations?.[0]?.name || brand.name}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: GetProductsResType['data'][0] }) {
  const discountPercentage =
    product.virtualPrice > product.basePrice
      ? Math.round(((product.virtualPrice - product.basePrice) / product.virtualPrice) * 100)
      : 0

  const productName = product.translations?.[0]?.name || product.name
  const productImage = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'
  return (
    <div className='group relative bg-white rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 transition-all'>
      {/* corner label */}
      {discountPercentage > 0 && (
        <div className='absolute top-2 left-2 z-10'>
          <span className='text-[10px] font-semibold text-rose-600 bg-rose-100 rounded px-1.5 py-0.5'>
            -{discountPercentage}%
          </span>
        </div>
      )}
      {/* wishlist */}
      <button
        className='absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-rose-50'
        aria-label='Add to wishlist'
      >
        <Heart className='h-4 w-4 text-slate-600' />
      </button>
      {/* image */}
      <div className='aspect-square p-3'>
        <img
          src={productImage}
          alt={productName}
          className='w-full h-full object-contain group-hover:scale-105 transition-transform'
        />
      </div>
      {/* info */}
      <div className='px-3 pb-3'>
        <h3 className='text-[12px] font-medium text-slate-900 line-clamp-2 h-8'>{productName}</h3>
        <div className='mt-1 flex items-center gap-1'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
          ))}
          <span className='ml-1 text-[11px] text-slate-500'>(0)</span>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <div className='flex items-baseline gap-1.5'>
            <span className='text-[15px] font-semibold text-slate-900'>{formatVND(product.basePrice)}</span>
            {product.virtualPrice > product.basePrice && (
              <span className='text-[11px] text-slate-400 line-through'>{formatVND(product.virtualPrice)}</span>
            )}
          </div>
        </div>
        <Link to={`/product/${product.id}`}>
          <Button className='mt-2 w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'>
            <ShoppingCart className='h-4 w-4' />
            <span className='text-xs'>Add to Cart</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
