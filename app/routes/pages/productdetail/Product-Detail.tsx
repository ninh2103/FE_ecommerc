import { Heart, Minus, Plus, ShieldCheck, Share2, ShoppingCart, Star, Truck } from 'lucide-react'
import { Button } from '../../../components/ui/button'

export default function ProductDetailPage() {
	return (
		<div className='container mx-auto px-4 py-6 md:py-8'>
			{/* Breadcrumbs */}
			<nav className='text-xs text-slate-500 mb-4'>
				<span>Home</span>
				<span className='mx-1'>/</span>
				<span>Fruits & Vegetables</span>
				<span className='mx-1'>/</span>
				<span className='text-slate-700'>Marketside Fresh Organic Bananas, Bunch</span>
			</nav>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Left: Gallery */}
				<section>
					<div className='relative rounded-xl ring-1 ring-slate-200 bg-white p-4'>
						<img
							src='https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=1200&auto=format&fit=crop'
							alt='Bananas'
							className='w-full h-auto object-contain'
						/>
					</div>
					<div className='mt-3 flex items-center gap-2'>
						{[
							'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop',
							'https://images.unsplash.com/photo-1571771894853-7134a22fb39f?q=80&w=400&auto=format&fit=crop',
							'https://images.unsplash.com/photo-1571772996211-2f02f59f2db2?q=80&w=400&auto=format&fit=crop',
						].map((src) => (
							<button key={src} className='h-16 w-16 rounded-md ring-1 ring-slate-200 overflow-hidden bg-white'>
								<img src={src} alt='' className='h-full w-full object-cover' />
							</button>
						))}
					</div>
				</section>

				{/* Right: Details */}
				<section>
					<h1 className='text-xl md:text-2xl font-extrabold text-slate-900'>Marketside Fresh Organic Bananas, Bunch</h1>
					<div className='mt-1 flex items-center gap-3'>
						<div className='flex items-center gap-0.5'>
							{Array.from({ length: 5 }).map((_, i) => (
								<Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
							))}
						</div>
						<span className='text-xs text-slate-500'>300 • SKU: E79E9P49</span>
					</div>

					<div className='mt-4 flex items-end gap-3'>
						<span className='text-2xl font-extrabold text-emerald-600'>$0.89</span>
						<span className='text-sm text-slate-400 line-through'>$1.99</span>
						<span className='text-[10px] font-semibold text-rose-600 bg-rose-100 rounded px-1.5 py-0.5'>-55%</span>
					</div>

					<p className='mt-3 text-sm text-slate-600 max-w-prose'>
						Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora
						torquent per conubia nostra.
					</p>

					{/* Offer pills */}
					<div className='mt-4 flex items-center gap-2'>
						{['B1','B5','B10','02'].map((v) => (
							<span key={v} className='text-[10px] px-2 py-1 rounded border text-slate-700'>{v}</span>
						))}
					</div>

					{/* Quantity + actions */}
					<div className='mt-4 flex items-center gap-3'>
						<div className='inline-flex items-center rounded border overflow-hidden'>
							<button className='px-3 py-2 hover:bg-slate-50' aria-label='decrease'>
								<Minus className='h-4 w-4' />
							</button>
							<input className='w-12 text-center text-sm py-2 outline-none' defaultValue={1} />
							<button className='px-3 py-2 hover:bg-slate-50' aria-label='increase'>
								<Plus className='h-4 w-4' />
							</button>
						</div>
						<Button className='gap-2 bg-slate-900 hover:bg-slate-800 text-white'>
							<ShoppingCart className='h-4 w-4' />
							Add to cart
						</Button>
						<Button variant='outline' className='text-slate-900'>Buy Now</Button>
					</div>

					{/* Info rows */}
					<div className='mt-4 space-y-2 text-xs'>
						<div className='flex items-start gap-2 rounded border p-2'>
							<ShieldCheck className='h-4 w-4 text-slate-700 mt-0.5' />
							<p className='text-slate-600'>Payment upon receipt of goods, Google Pay, credit cards. 3% discount in case of prepayment.</p>
						</div>
						<div className='flex items-start gap-2 rounded border p-2'>
							<Truck className='h-4 w-4 text-slate-700 mt-0.5' />
							<p className='text-slate-600'>Free return of this product if proper quality within 30 days.</p>
						</div>
					</div>

					{/* secondary actions */}
					<div className='mt-3 flex items-center gap-4 text-xs text-slate-600'>
						<button className='inline-flex items-center gap-1 hover:text-slate-900'><Heart className='h-4 w-4' /> Add to wishlist</button>
						<button className='inline-flex items-center gap-1 hover:text-slate-900'><Share2 className='h-4 w-4' /> Share this product</button>
						<button className='inline-flex items-center gap-1 hover:text-slate-900'>Compare</button>
					</div>
				</section>
			</div>

			{/* Tabs */}
			<div className='mt-8 rounded-xl ring-1 ring-slate-200 bg-white'>
				<div className='flex border-b text-sm'>
					<button className='px-4 py-3 font-medium text-slate-900 border-b-2 border-slate-900'>Description</button>
					<button className='px-4 py-3 text-slate-500 hover:text-slate-900'>Reviews (2)</button>
				</div>
				<div className='p-4 text-sm text-slate-600'>
					Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi et ex, in viverra vitae ante vel, blandit feugiat ligula.
				</div>
			</div>

			{/* Related products */}
			<section className='mt-8'>
				<h2 className='text-lg md:text-xl font-semibold text-slate-900 mb-3'>Related products</h2>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
					{related.map((p) => (
						<RelatedCard key={p.id} p={p} />
					))}
				</div>
			</section>
		</div>
	)
}

const related = Array.from({ length: 6 }).map((_, i) => ({
	id: `rp-${i+1}`,
	title: ['Spinach & Herb Wraps','Peach — each','Yellow Potatoes Whole Fresh','Fresh Cauliflower, Each','Fresh Broccoli Crowns, Each','Fresh Purple Eggplant'][i],
	price: [27.99,0.75,0.5,12.79,11.54,2.99][i],
	old: [32.89,1.75,1.49,14.78,17.88,5.89][i],
	image: [
		'https://images.unsplash.com/photo-1604908554027-812726f8c4ea?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1571212515410-1e2d4ea1b83e?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1584308978642-1b4532b267b0?q=80&w=900&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1567302547237-6e25fdfb36a0?q=80&w=900&auto=format&fit=crop',
	][i],
	label: ['-18%','-31%','-75%','-14%','-36%','-48%'][i],
}))

function RelatedCard({ p }: { p: typeof related[number] }) {
	return (
		<div className='group relative bg-white rounded-xl ring-1 ring-slate-200 hover:ring-slate-300 transition-all'>
			<div className='absolute top-2 left-2 z-10'>
				<span className='text-[10px] font-semibold text-rose-600 bg-rose-100 rounded px-1.5 py-0.5'>{p.label}</span>
			</div>
			<div className='aspect-square p-3'>
				<img src={p.image} alt='' className='w-full h-full object-contain group-hover:scale-105 transition-transform' />
			</div>
			<div className='px-3 pb-3'>
				<h3 className='text-[12px] font-medium text-slate-900 line-clamp-2 h-8'>{p.title}</h3>
				<div className='mt-1 flex items-center justify-between'>
					<div className='flex items-baseline gap-1.5'>
						<span className='text-[14px] font-semibold text-slate-900'>${p.price}</span>
						<span className='text-[11px] text-slate-400 line-through'>${p.old}</span>
					</div>
					<Button className='h-8 px-3 gap-1 bg-slate-900 hover:bg-slate-800 text-white'>
						<ShoppingCart className='h-4 w-4' />
						<span className='text-[11px]'>Add</span>
					</Button>
				</div>
			</div>
		</div>
	)
}
