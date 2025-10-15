import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../components/ui/button'
import type { AppDispatch, RootState } from '~/store'
import type { CategoryIncludeTranslationType } from '~/validateSchema/category.schema'
import { useEffect } from 'react'
import { getCategory } from '~/features/categorySlice'

export default function CategorySection() {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((s: RootState) => s.category.data)
  const isCategoryLoading = useSelector((s: RootState) => s.category.isLoading)

  useEffect(() => {
    if (!isCategoryLoading && (!categories || categories.length === 0)) dispatch(getCategory()).catch(() => {})
  }, [dispatch, isCategoryLoading, categories])

  return (
    <section className='container mx-auto px-4 py-8 md:py-10 lg:py-12'>
      <div className='flex items-center justify-between gap-3 mb-4 md:mb-6'>
        <div className='items-baseline gap-3'>
          <h2 className='text-lg md:text-xl font-semibold text-slate-900'>Top Categories</h2>
        </div>
        <Button variant='outline' className='gap-1 text-slate-900'>
          <span>View All</span>
          <span aria-hidden>→</span>
        </Button>
      </div>

      {/* Grid: 9 columns on xl -> 2 rows for 18 items */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3 md:gap-4'>
        {categories.map((c: CategoryIncludeTranslationType) => (
          <CategoryCard key={c.name} item={c} />
        ))}
      </div>
    </section>
  )
}

function CategoryCard({ item }: { item: CategoryIncludeTranslationType }) {
  return (
    <div className='group rounded-xl bg-white ring-1 ring-slate-100 hover:ring-slate-200 transition-colors'>
      <div className='h-28 sm:h-32 grid place-items-center p-3'>
        <img src={item.logo ?? ''} alt={item.name} className='h-full max-h-28 object-contain select-none' />
      </div>
      <div className='border-t border-slate-100 px-3 py-2 text-center'>
        <p className='text-[12px] sm:text-sm text-slate-700 truncate'>{item.name}</p>
      </div>
    </div>
  )
}
