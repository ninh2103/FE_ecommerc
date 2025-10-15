import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../../components/ui/button'
import type { AppDispatch, RootState } from '~/store'
import { useEffect } from 'react'
import { getBrand } from '~/features/brandSlice'
import type { BrandIncludeTranslationType } from '~/validateSchema/brand.schema'

// const brands: { name: string; logo: string }[] = [
// 	{ name: 'Nestlé', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Nestle_textlogo_blue.svg/512px-Nestle_textlogo_blue.svg.png' },
// 	{ name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Coca-Cola_logo.svg/512px-Coca-Cola_logo.svg.png' },
// 	{ name: 'Pepsi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pepsi_logo_2014.svg/512px-Pepsi_logo_2014.svg.png' },
// 	{ name: 'Oreo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Oreo_logo_2019.svg/512px-Oreo_logo_2019.svg.png' },
// 	{ name: 'Heinz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kraft_Heinz_Logo_2015.svg/512px-Kraft_Heinz_Logo_2015.svg.png' },
// 	{ name: 'Nescafé', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Nescafe_logo_2014.svg/512px-Nescafe_logo_2014.svg.png' },
// 	{ name: 'Kellogg\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Kellogg%27s_2012.svg/512px-Kellogg%27s_2012.svg.png' },
// 	{ name: 'Lay\'s', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Lays_logo_2019.svg/512px-Lays_logo_2019.svg.png' },
// 	{ name: 'Starbucks', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Starbucks_Corporation_Logo_2011.svg/512px-Starbucks_Corporation_Logo_2011.svg.png' },
// 	{ name: 'Ariel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Ariel_logo.svg/512px-Ariel_logo.svg.png' },
// 	{ name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/LG_logo_%282014%29.svg/512px-LG_logo_%282014%29.svg.png' },
// 	{ name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png' },
//   { name: 'Starbucks', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Starbucks_Corporation_Logo_2011.svg/512px-Starbucks_Corporation_Logo_2011.svg.png' },
// 	{ name: 'Ariel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Ariel_logo.svg/512px-Ariel_logo.svg.png' },
// 	{ name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/LG_logo_%282014%29.svg/512px-LG_logo_%282014%29.svg.png' },
// 	{ name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png' },
// ]

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
