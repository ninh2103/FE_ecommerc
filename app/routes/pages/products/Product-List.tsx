import { BadgePercent, ChevronDown, Filter, Grid3X3, Heart, List, ShoppingCart, Star } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Link } from 'react-router'

export default function ProductListPage() {
	return (
		<div className='container mx-auto px-4 py-6 md:py-8'>
			{/* Breadcrumbs */}
			<nav className='text-xs text-slate-500 mb-3'>
				<Link to='/'>Home</Link>
				<span className='mx-1'>/</span>
				<Link to='/products' className='hover:text-slate-700'>Products</Link>
				<span className='mx-1'>/</span>
				<span className='text-slate-700'>Fruits & Vegetables</span>
			</nav>

			{/* Title + badge + description */}
			<div className='mb-4'>
				<span className='inline-block text-[10px] font-semibold text-amber-600 bg-amber-100 rounded px-2 py-1'>Only This Week</span>
				<h1 className='mt-2 text-xl md:text-2xl font-extrabold text-slate-900 leading-snug'>Grocery store with different<br className='hidden sm:block'/> treasures</h1>
				<p className='mt-1 text-xs md:text-sm text-slate-500 max-w-2xl'>We have prepared special discounts for you on grocery products...</p>
				<div className='mt-3'>
					<Button variant='outline' className='gap-2 text-slate-900'>
						<BadgePercent className='h-4 w-4' />
						<span>Shop Now</span>
					</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6'>
				{/* Sidebar filters */}
				<aside className='space-y-6'>
					<PriceFilter />
					<CategoryFilter />
					<ColorFilter />
					<BrandFilter />
					<StatusFilter />
				</aside>

				<section>
					{/* Toolbar */}
					<div className='flex items-center justify-between gap-3 border rounded-lg px-3 py-2 text-xs text-slate-500'>
						<div>Showing 40 results</div>
						<div className='flex items-center gap-2'>
							<span>Sort:</span>
							<button className='inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50 text-slate-700'>
								<span>Sort by latest</span>
								<ChevronDown className='h-3.5 w-3.5' />
							</button>
							<span className='hidden sm:inline'>Show:</span>
							<button className='hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50 text-slate-700'>
								<span>20 items</span>
								<ChevronDown className='h-3.5 w-3.5' />
							</button>
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

					{/* Grid products 4 x 5 (sample 20 items) */}
					<div className='mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
						{demoProducts.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</div>
				</section>
			</div>
		</div>
	)
}

function PriceFilter() {
	return (
		<div className='rounded-lg border p-3'>
			<div className='text-xs font-semibold text-slate-800 mb-2'>Widget price filter</div>
			<div className='flex items-center gap-2 text-[11px] text-slate-500'>
				<div className='flex-1'>
					<label className='block'>Min price</label>
					<input type='range' min={0} max={30} className='w-full' />
				</div>
				<div className='flex-1'>
					<label className='block'>Max price</label>
					<input type='range' min={0} max={30} className='w-full' />
				</div>
			</div>
			<div className='mt-2 text-xs text-slate-500'>Price: $0 — $30</div>
			<Button variant='outline' className='mt-3 w-full text-slate-700 gap-1'>
				<Filter className='h-4 w-4' />
				Filter
			</Button>
		</div>
	)
}

function CategoryFilter() {
	const items = ['Fruits & Vegetables','Baby & Pregnancy','Beverages','Meats & Seafood','Biscuits & Snacks','Breads & Bakery','Breakfast & Dairy','Frozen Foods','Grocery & Staples','Healthcare','Household Needs']
	return (
		<div className='rounded-lg border p-3'>
			<div className='text-xs font-semibold text-slate-800 mb-2'>Product Categories</div>
			<ul className='space-y-1.5'>
				{items.map((it) => (
					<li key={it} className='flex items-center gap-2 text-xs text-slate-600'>
						<input type='checkbox' className='h-3.5 w-3.5 accent-slate-900' />
						<span className='truncate'>{it}</span>
					</li>
				))}
			</ul>
		</div>
	)
}

function ColorFilter() {
	return (
		<div className='rounded-lg border p-3'>
			<div className='text-xs font-semibold text-slate-800 mb-2'>Filter by Color</div>
			<div className='flex items-center gap-2 flex-wrap'>
				{['bg-green-500','bg-blue-500','bg-yellow-400','bg-rose-500','bg-orange-500','bg-slate-700'].map((c) => (
					<button key={c} className={`h-5 w-5 rounded-full ring-1 ring-slate-200 ${c}`} aria-label='color' />
				))}
			</div>
		</div>
	)
}

function BrandFilter() {
	return (
		<div className='rounded-lg border p-3'>
			<div className='text-xs font-semibold text-slate-800 mb-2'>Filter by Brands</div>
			<label className='flex items-center gap-2 text-xs text-slate-600'>
				<input type='checkbox' className='h-3.5 w-3.5 accent-slate-900' />
				<span>Fresh</span>
			</label>
		</div>
	)
}

function StatusFilter() {
	return (
		<div className='rounded-lg border p-3'>
			<div className='text-xs font-semibold text-slate-800 mb-2'>Product Status</div>
			<div className='space-y-1'>
				<label className='flex items-center gap-2 text-xs text-slate-600'>
					<input type='checkbox' className='h-3.5 w-3.5 accent-slate-900' />
					<span>In Stock</span>
				</label>
				<label className='flex items-center gap-2 text-xs text-slate-600'>
					<input type='checkbox' className='h-3.5 w-3.5 accent-slate-900' />
					<span>On Sale</span>
				</label>
			</div>
		</div>
	)
}

// Demo data and cards
const demoProducts = Array.from({ length: 20 }).map((_, i) => ({
	id: `p-${i+1}`,
	title: [
		'Yellow Potatoes Whole Fresh, 5lb Bag',
		'Large Bagged Oranges',
		'Strawberries — 1lb',
		'Sliced Strawberries — 10.8oz',
		'Peach — each',
		'Organic Bananas, Bunch',
		'Spinach & Herb Wraps',
		'Caramel Apple Soft Candies',
		'Fresh Purple Eggplant',
		'Fresh Pomegranate, Each',
	][i % 10],
	price: [0.5,0.89,1.5,21.9,0.75,0.89,27.99,19.37,2.99,1.5][i % 10],
	old: [1.49,1.28,2.15,24.89,1.75,1.89,32.89,21.57,5.89,2.99][i % 10],
	image: [
		'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1477512076069-d31eb021716f?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1604908554027-812726f8c4ea?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1567302547237-6e25fdfb36a0?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1609866176933-81f5881ae0a8?q=80&w=900&auto=format&fit=crop',
	][i % 10],
	rating: 4 + ((i % 3) / 10),
	reviews: 3 + (i % 20),
	label: ['-75%','-30%','-31%','-13%','-31%','-54%','-18%','-10%','-58%','-31%'][i % 10],
}))

function ProductCard({ product }: { product: typeof demoProducts[number] }) {
	return (
		<div className='group relative bg-white rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 transition-all'>
			{/* corner label */}
			<div className='absolute top-2 left-2 z-10'>
				<span className='text-[10px] font-semibold text-rose-600 bg-rose-100 rounded px-1.5 py-0.5'>{product.label}</span>
			</div>
			{/* wishlist */}
			<button className='absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 ring-1 ring-slate-200 hover:bg-rose-50'>
				<Heart className='h-4 w-4 text-slate-600' />
			</button>
			{/* image */}
			<div className='aspect-square p-3'>
				<img src={product.image} alt='' className='w-full h-full object-contain group-hover:scale-105 transition-transform' />
			</div>
			{/* info */}
			<div className='px-3 pb-3'>
				<h3 className='text-[12px] font-medium text-slate-900 line-clamp-2 h-8'>{product.title}</h3>
				<div className='mt-1 flex items-center gap-1'>
					{Array.from({ length: 5 }).map((_, i) => (
						<Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
					))}
					<span className='ml-1 text-[11px] text-slate-500'>({product.reviews})</span>
				</div>
				<div className='mt-2 flex items-center justify-between'>
					<div className='flex items-baseline gap-1.5'>
						<span className='text-[15px] font-semibold text-slate-900'>${product.price}</span>
						<span className='text-[11px] text-slate-400 line-through'>${product.old}</span>
					</div>
					<span className='text-[10px] text-emerald-600 font-semibold'>IN STOCK</span>
				</div>
				<Button className='mt-2 w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white'>
					<ShoppingCart className='h-4 w-4' />
					<span className='text-xs'>Add to Cart</span>
				</Button>
			</div>
		</div>
	)
}
