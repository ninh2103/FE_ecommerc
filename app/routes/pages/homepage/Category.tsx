import { Button } from '../../../components/ui/button'

type CategoryItem = {
	name: string
	image: string
}

const categories: CategoryItem[] = [
	{ name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Baby & Pregnancy', image: 'https://images.unsplash.com/photo-1604293853107-19d94b3a6545?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Beverages', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76c9?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Meats & Seafood', image: 'https://images.unsplash.com/photo-1505575972945-280fd4c773d8?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Biscuits & Snacks', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9f?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Breads & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Breakfast & Dairy', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Frozen Foods', image: 'https://images.unsplash.com/photo-1586201375754-1421e0aa2f3b?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Grocery & Staples', image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Household', image: 'https://images.unsplash.com/photo-1581578017421-38b5b18d0b6b?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Personal Care', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Pet Care', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Health & Wellness', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Stationery', image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Electronics', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Fashion', image: 'https://images.unsplash.com/photo-1495121605193-b116b5b09a0d?q=80&w=800&auto=format&fit=crop' },
	{ name: 'Sports & Outdoors', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop' },
]

export default function CategorySection() {
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
				{categories.map((c) => (
					<CategoryCard key={c.name} item={c} />
				))}
			</div>
		</section>
	)
}

function CategoryCard({ item }: { item: CategoryItem }) {
	return (
		<div className='group rounded-xl bg-white ring-1 ring-slate-100 hover:ring-slate-200 transition-colors'>
			<div className='h-28 sm:h-32 grid place-items-center p-3'>
				<img src={item.image} alt={item.name} className='h-full max-h-28 object-contain select-none' />
			</div>
			<div className='border-t border-slate-100 px-3 py-2 text-center'>
				<p className='text-[12px] sm:text-sm text-slate-700 truncate'>{item.name}</p>
			</div>
		</div>
	)
}
