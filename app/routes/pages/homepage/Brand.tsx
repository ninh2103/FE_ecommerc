import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../components/ui/button'
import type { AppDispatch, RootState } from '~/store'
import { useEffect } from 'react'
import { getBrand } from '~/features/brandSlice'
import type { BrandIncludeTranslationType } from '~/validateSchema/brand.schema'

export default function BrandSection() {
  const dispatch = useDispatch<AppDispatch>()
  const brands = useSelector((s: RootState) => s.brand.data)
  const isBrandLoading = useSelector((s: RootState) => s.brand.isLoading)

  useEffect(() => {
    if (!isBrandLoading && (!brands || brands.length === 0)) dispatch(getBrand()).catch(() => {})
  }, [dispatch, isBrandLoading, brands])

  return (
    <section className='container mx-auto px-4 py-8 md:py-10 lg:py-12'>
      <div className='flex items-center justify-between gap-3 mb-4 md:mb-6'>
        <div className='flex items-baseline gap-3'>
          <h2 className='text-lg md:text-xl font-semibold text-slate-900'>Top Brands</h2>
        </div>
        <Button variant='outline' className='gap-1 text-slate-900'>
          <span>View All</span>
          <span aria-hidden>→</span>
        </Button>
      </div>

      {/* Grid logos: 8 cols on xl, 6 on lg, 4 on md, 3 on sm */}
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4'>
        {brands.map((b: BrandIncludeTranslationType) => (
          <BrandCard key={b.name} name={b.name} logo={b.logo} />
        ))}
      </div>
    </section>
  )
}

function BrandCard({ name, logo }: { name: string; logo: string }) {
  return (
    <div className='group rounded-xl bg-white ring-1 ring-slate-100 hover:ring-slate-200 transition-colors p-4 md:p-5 flex items-center justify-center'>
      <img
        src={logo ?? ''}
        alt={name}
        className='h-8 md:h-10 object-contain grayscale group-hover:grayscale-0 transition ease-in-out duration-200'
      />
    </div>
  )
}
